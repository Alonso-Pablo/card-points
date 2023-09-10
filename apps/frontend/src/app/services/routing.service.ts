import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(private router: Router) {}

  public navigate(commands: any[], extras?: any): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }
}
