import express, { Request, Response } from 'express';
import { CardsController } from './src/card/infrastructure/CardsController';
import { createServer } from 'http'; // Importamos createServer de 'http' para usarlo con Socket.io
import { Socket } from 'socket.io';
// import { createClient } from 'redis';
import { Room, User, Card, VotingStatus } from '../shared/domain/';

export interface CustomSocket extends Socket {
  username?: string;
}

const app = express();
const router = express.Router();
const port = 3000; // Puedes cambiar el puerto si es necesario
const httpServer = createServer(app);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const io: Socket = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});
// Vincular los controladores HTTP
app.use('/cards', CardsController);
app.use('/', router.get('/', (req: Request, res: Response) => res.send('Hello World')));

// Iniciar el servidor
httpServer.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

// REDIS
// const redisClient = createClient({
//   url: 'redis://localhost:6379', // Reemplaza con la dirección real y el puerto si son diferentes
// });
// redisClient.on('connect', () => {
//   console.log('Conexión a Redis establecida correctamente.');
// });
// redisClient.on('error', (err) => {
//   console.error('Error de conexión a Redis:', err);
// });
// (async () => await redisClient.connect())();

// Aca guardamos las Rooms activas
const activeRoomsMap = new Map<string, Room>();

// Aca tenemos las plantillas de las cards y room
const defaultCardValues = ['1/2', '1', '3', '5', '8', '12', '15', '20', '40', '100', '?'];
const defaultCards: Card[] = defaultCardValues.map<Card>(
  (cardValue: string, index: number) => ({id: index.toString(), value: cardValue, numberTimesChosen: 0})
);
const defaultRoom: Room = {
  id: '',
  users: [],
  cards: defaultCards,
  roomCreatorId: '',
  votingResults: [],
  votingStatus: VotingStatus.WAITING,
};
const defaultUser: User = {
  id: '',
  username: '',
  votedCardId: null,
};

// Configurar eventos de Socket.io (si es necesario)
io.on('connection', async (socket: CustomSocket) => {
  console.log('Usuario conectado con Socket ID:', socket.id);

  // Crear una Sala
  socket.on('createRoom', ({ roomId, username }: { roomId: string, username: string }) => {
    const doesExistTheRoomWithThatId = activeRoomsMap.has(roomId);
    if (doesExistTheRoomWithThatId) {
      return;
    }

    const newRoom = createRoom({ roomId, roomCreator: { id: socket.id, username } });

    activeRoomsMap.set(roomId, newRoom);
    socket.join(roomId);
    io.to(roomId).emit('updateRoom', newRoom);
    console.log('Sala creada:', activeRoomsMap.get(roomId));
  });

  // Entrar a una Sala
  socket.on('joinRoom', ({ roomId, username }: { roomId: string, username: string }) => {
    const doesExistTheRoomWithThatId = activeRoomsMap.has(roomId);
    if (!doesExistTheRoomWithThatId) {
      // Si la sala no existe lo crea.
      const newRoom = createRoom({ roomId, roomCreator: { id: socket.id, username } });

      activeRoomsMap.set(roomId, newRoom);
      socket.join(roomId);
      io.to(roomId).emit('updateRoom', newRoom);
      console.log('Sala creada:', activeRoomsMap.get(roomId));
      return;
    }

    const userToJoin: User = {
      ...defaultUser,
      id: socket.id,
      username,
    };
    const roomFound = activeRoomsMap.get(roomId)!;
    const userIsAlreadyInTheRoom = roomFound.users.find((user: User) => user.id === userToJoin.id);
    if (userIsAlreadyInTheRoom) {
      console.log(`Usuario: '${username}' ya se encontraba dentro de la sala:`, roomId);
      return;
    }
    const usersInRoom = roomFound.users;
    usersInRoom.push(userToJoin);
    const updatedRoom: Room = {...roomFound, users: usersInRoom};
    activeRoomsMap.set(roomId, updatedRoom);
    socket.join(roomId);
    io.to(roomId).emit('updateRoom', updatedRoom);
    console.log(`Usuario: '${username}' se ha unido a la sala:`, roomId);
  });

  // Desconectarse
  socket.on('disconnect', () => {
    const disconnectedUserSocketId = socket.id;
    const { user, room } = foundUserAndRoomBySocketId(activeRoomsMap, disconnectedUserSocketId);
    if (!(user && room)) {
      return;
    }

    room.users = room.users.filter((roomUser: User) => roomUser.id !== user.id);

    activeRoomsMap.set(room.id, room);
    io.to(room.id).emit('updateRoom', room);
    console.log('Usuario desconectado:', user.username);
  });

  // Votar Card
  socket.on('voteCard', ({ cardId }: { cardId: string }) => {
    const socketIdOfUserWhoVoted = socket.id;
    const { user, room } = foundUserAndRoomBySocketId(activeRoomsMap, socketIdOfUserWhoVoted);
    if (!(user && room)) {
      return;
    }

    if (room.votingStatus === VotingStatus.WAITING) {
      room.votingStatus = VotingStatus.VOTING;
    }

    room.users = room.users.map((roomUser: User) => {
      if (roomUser.id === user.id) {
        roomUser.votedCardId = cardId;
      }

      return roomUser;
    });

    room.cards = room.cards.map((card: Card) => {
      if (card.id === cardId) {
        card.numberTimesChosen =+ 1;
      }

      return card;
    });
    

    activeRoomsMap.set(room.id, room);
    io.to(room.id).emit('updateRoom', room);
    console.log(`Usuario ${user.username} ha votado la CardId: ${cardId};`);
    console.log('[-------------------------] START CARDS');
    console.log(room.cards);
    console.log('[-------------------------] END CARDS');
  });

  // Mostrar Resultado
  socket.on('showResult', () => {
    const socketIdOfUserWhoStartTheCountVotes = socket.id;
    const { room } = foundUserAndRoomBySocketId(activeRoomsMap, socketIdOfUserWhoStartTheCountVotes);

    if (!room || room.votingStatus !== VotingStatus.VOTING) {
      return;
    }

    const cardVotesById: Record<string, number> = {};
    room.users.forEach((roomUser: User) => {
      if (!roomUser.votedCardId) {
        return;
      }

      if (!cardVotesById[roomUser.votedCardId]) {
        cardVotesById[roomUser.votedCardId] = 0;
      }

      cardVotesById[roomUser.votedCardId] += 1;
    });
    console.log('cardVotesById', cardVotesById);
    const { mostVotedCardsId, highestNumberOfVotes } = getMostVotedCards(cardVotesById);

    room.votingResults = mostVotedCardsId.map((mostVotedCardId: string) =>
      ({cardId: mostVotedCardId, votes: highestNumberOfVotes})
    );

    room.votingStatus = VotingStatus.SHOWING;
    console.log('room.result', room.votingResults);

    activeRoomsMap.set(room.id, room);
    io.to(room.id).emit('updateRoom', room);
  });

  // Reiniciar la votacion
  socket.on('restartResult', () => {
    const socketIdOfUserWhoStartTheReset = socket.id;
    const { room } = foundUserAndRoomBySocketId(activeRoomsMap, socketIdOfUserWhoStartTheReset);

    if (!room || room.votingStatus !== VotingStatus.SHOWING) {
      return;
    }

    room.users = room.users.map(user => {
      user.votedCardId = null;
      return user;
    });

    room.cards = room.cards.map(card => {
      card.numberTimesChosen = 0;
      return card;
    });

    room.votingResults = [];

    room.votingStatus = VotingStatus.WAITING;

    activeRoomsMap.set(room.id, room);
    io.to(room.id).emit('updateRoom', room);
  });

  socket.on('setUsername', (data) => {
    const { username } = data;
    socket.username = username;
    console.log(`Usuario conectado (setUsername): ${socket.username}`);
  });
});

function createRoom({ roomId, roomCreator }: { roomId: string; roomCreator: { id: string, username: string } }): Room {
  const userRoomCreator: User = {
    ...defaultUser,
    id: roomCreator.id,
    username: roomCreator.username,
  };
  const newRoom: Room = {
    ...defaultRoom,
    id: roomId,
    users: [userRoomCreator],
    roomCreatorId: userRoomCreator.id,
  };

  return newRoom;
}

function foundUserAndRoomBySocketId(
  roomMap: Map<string, Room>,userSocketId: string
): {
  user: User | undefined;
  room: Room | undefined;
} {
  let userFound: User | undefined;
  let roomFound: Room | undefined;
  const roomIterator = roomMap[Symbol.iterator]();
  for (const keyAndRoom of roomIterator) {
    const room: Room = keyAndRoom[1];
    const userIndex = room.users.findIndex((user: User) => user.id === userSocketId);
    const isUserFound = userIndex !== -1;
    if (!isUserFound) {
      continue;
    }

    userFound = room.users[userIndex];
    roomFound = room;
    break;
  }

  return ({ user: userFound, room: roomFound });
}

function getMostVotedCards(
  cardVotesById: Record<string, number>
): { mostVotedCardsId: string[], highestNumberOfVotes: number } {
  let mostVotedCardsId: string[] = [];
  let highestNumberOfVotes = 0; // Inicializa con el valor mínimo seguro de un número

  for (const cardId in cardVotesById) {
    if (cardVotesById[cardId]) {
      const numberVotesCurrentCard: number = cardVotesById[cardId];

      if (numberVotesCurrentCard > highestNumberOfVotes) {
        highestNumberOfVotes = numberVotesCurrentCard;
        mostVotedCardsId = [cardId]; // Restablece el array con una nueva cardId
      }
      
      if (numberVotesCurrentCard === highestNumberOfVotes) {
        if (!mostVotedCardsId.includes(cardId)) {
          mostVotedCardsId.push(cardId); // Agrega la cardId al array si es igual al votes máximo
        }
      }
    }
  }

  return ({ mostVotedCardsId, highestNumberOfVotes });
}
