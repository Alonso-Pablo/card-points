// socket.service.ts (ejemplo)
import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Room, Card, User } from '../../../../shared/domain'

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Conectar con el servidor de Socket.io
    this.socket = io('http://localhost:3000'); // Reemplaza la URL con la de tu servidor
  }

  sendCreateRoomRequest(roomId: string, username: string): void {
    this.socket.emit('createRoom', {roomId, username});
  }

  sendJoinRoomRequest(roomId: string, username: string): void {
    this.socket.emit('joinRoom', {roomId, username});
  }

  sendLeaveRoom(roomId: string, username: string): void {
    this.socket.emit('disconnect', {roomId, username});
  }

  sendVotedCard(cardId: string): void {
    this.socket.emit('voteCard', { cardId });
  }

  sendShowResult(roomId: string): void {
    this.socket.emit('showResult', { roomId });
  }

  sendRestartResult(roomId: string): void {
    this.socket.emit('restartResult', { roomId });
  }

  onUpdateRoom(): Observable<Room> {
    return new Observable<Room>((observer) => {
      this.socket.on('updateRoom', (room: Room) => {
        console.log('onUpdateRoom', room);
        observer.next(room);
      });
    })
  }
}
