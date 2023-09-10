import { Card } from './Card';
import { User } from './User';

export enum VotingStatus {
  WAITING = 'WAITING',
  VOTING = 'VOTING',
  SHOWING = 'SHOWING',
}

export interface VotingResult {
  cardId: string;
  votes: number
}

export interface Room {
  id: string;
  users: User[];
  cards: Card[];
  roomCreatorId: string;
  votingResults: VotingResult[];
  votingStatus: VotingStatus;
}

// class Room {
//   private constructor(
//     private id: string,
//     private users: User[],
//     private cards: Card[],
//     private roomCreatorId: string,
//     private votingResults: VotingResult[],
//     private votingStatus: VotingStatus,
//   ) {}

//   static create({
//     id,
//     users,
//     cards,
//     roomCreatorId,
//     votingResults,
//     votingStatus,
//   }: Room): Room {
//     return new Room(
//       id,
//       users,
//       cards,
//       roomCreatorId,
//       votingResults,
//       votingStatus,
//     )
//   }

//   static generate(
//     { roomId, roomCreator }:
//     { roomId: string; roomCreator: {id: string, username: string }
//   }): Room {
//     const defaultCardValues = ['1/2', '1', '3', '5', '8', '12', '15', '20', '40', '100', '?'];
//     const defaultCards: Card[] = defaultCardValues.map<Card>(
//       (cardValue: string, index: number) => ({id: index.toString(), value: cardValue, numberTimesChosen: 0})
//     );
//     const defaultRoom: Room = {
//       id: '',
//       users: [],
//       cards: defaultCards,
//       roomCreatorId: '',
//       votingResults: [],
//       votingStatus: VotingStatus.WAITING,
//     };
//   }
// }