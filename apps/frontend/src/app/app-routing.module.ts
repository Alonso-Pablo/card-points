import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { HallComponent } from './pages/hall/hall.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'hall',
    pathMatch: 'full',
  },
  {
    path: 'hall',
    component: HallComponent,
  },
  {
    path: 'room/:roomId',
    component: RoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
