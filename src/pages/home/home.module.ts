import { RoomDetailsPage } from './../room-details/room-details';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HomePage } from './home';
import { RoomPage } from './../room/room';
import { BookingPage } from './../booking/booking';

@NgModule({
  declarations: [
    HomePage,
    RoomPage,
    RoomDetailsPage,
    BookingPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    RoomPage,
    RoomDetailsPage,
    BookingPage
  ]
})
export class HomePageModule {}
