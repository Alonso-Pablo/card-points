import { Component } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { SocketService } from '../../services/socket.service';
import { AppStateService } from '../../services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent {
  private usernameSubscription!: Subscription;
  isAbleToJoinARoom: boolean = true;
  roomId: string | null = null;
  username: string = '';

  constructor(
    private socketService: SocketService,
    private routingService: RoutingService,
    private appStateService: AppStateService,
  ) {}

  ngOnInit(): void {
    this.usernameSubscription = this.appStateService.username$.subscribe((username) => {
      this.username = username;
    });
    // Enviar eventos al servidor
    // Por ejemplo, cuando el usuario selecciona una carta, puedes enviar el ID de la carta al servidor
    // this.socket.emit('selectCard', { cardId: 123 });
  }

  ngOnDestroy(): void {
    this.usernameSubscription.unsubscribe();
  }

  sendUsername(): void {
    if (this.username.trim() !== '') {
      this.appStateService.setUsername(this.username);
    }
  }

  createNewRoom(): void {
    this.isAbleToJoinARoom = false;
    // Lógica para crear un nuevo room en el backend y redirigir al usuario a ese room
    // Por ejemplo:
    const newRoomId = Math.random().toString(36).substr(2, 5); // Genera un ID de room aleatorio
    this.socketService.sendCreateRoomRequest(newRoomId, this.username);
    this.routingService.navigate(['/room', newRoomId]);
  }

  joinRoom(): void {
    this.isAbleToJoinARoom = false;
    this.routingService.navigate(['/room', this.roomId]);
  }
}
