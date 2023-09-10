import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  static readonly LOCAL_STORAGE_USERNAME_KEY = 'card-points-username';

  private usernameSubject: BehaviorSubject<string>;
  username$: Observable<string>;

  private connectedUsersSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  connectedUsers$ = this.connectedUsersSubject.asObservable();

  constructor() {
    // Inicializar el usernameSubject con el valor del localStorage si existe
    const storedUsername = localStorage.getItem(AppStateService.LOCAL_STORAGE_USERNAME_KEY);
    this.usernameSubject = new BehaviorSubject<string>(storedUsername || `username-${v4()}`);
    this.username$ = this.usernameSubject.asObservable();
  }

  setUsername(username: string): void {
    this.usernameSubject.next(username);
    // Guardar el username en el localStorage
    localStorage.setItem(AppStateService.LOCAL_STORAGE_USERNAME_KEY, username);
  }

  updateConnectedUsers(users: string[]): void {
    this.connectedUsersSubject.next(users);
  }
}
