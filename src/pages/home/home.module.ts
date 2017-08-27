import { RoomDetailsPage } from './../room-details/room-details';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { RoomPage } from './../room/room';

@NgModule({
  declarations: [
    HomePage,
    RoomPage,
    RoomDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    RoomPage,
    RoomDetailsPage
  ]
})
export class HomePageModule {}
