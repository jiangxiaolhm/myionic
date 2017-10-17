import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HomePage } from './home';
import { BookingPage } from './../booking/booking';
import { RoomPage } from './../room/room';
import { SchedulePage } from './../schedule/schedule';

@NgModule({
  declarations: [
    HomePage,
    BookingPage,
    RoomPage,
    SchedulePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    HomePage,
    BookingPage,
    RoomPage,
    SchedulePage
  ]
})
export class HomePageModule {}
