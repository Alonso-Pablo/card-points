import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../services/app-state.service';
import { Room, User, Card, VotingStatus } from '../../../../../shared/domain'
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  private usernameSubscription!: Subscription;
  username: string = '';
  private usersSubscription!: Subscription;
  usersInRoom: User[] = [];
  private roomSubscription!: Subscription;
  room: Room = {
    id: '',
    users: [],
    cards: [],
    roomCreatorId: '',
    votingResults: [],
    votingStatus: VotingStatus.WAITING,
  };

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private routingService: RoutingService,
    private appStateService: AppStateService,
  ) {}

  ngOnInit(): void {
    this.usernameSubscription = this.appStateService.username$.subscribe((username: string) => {
      this.username = username;
    });

    // Obtén la lista de usuarios conectados en la sala (roomId)
    this.roomSubscription = this.socketService.onUpdateRoom().subscribe((room: Room) => {
      this.room = room;
    });

    this.route.params.subscribe((params) => {
      const roomIdFromParams: string = params['roomId'];
      if (!roomIdFromParams) {
        this.routingService.navigate(['/hall']);
        return;
      }
      this.socketService.sendJoinRoomRequest(roomIdFromParams, this.username);
    });

  }

  ngOnDestroy(): void {
    this.usernameSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.roomSubscription.unsubscribe();
    this.socketService.sendLeaveRoom(this.room.id!, this.username);
  }

  sendVotedCard(cardId: string): void {
    this.socketService.sendVotedCard(cardId);
  }

  sendShowResult(roomId: string): void {
    this.socketService.sendShowResult(roomId);
  }

  sendRestartResult(roomId: string): void {
    this.socketService.sendRestartResult(roomId);
  }
}
