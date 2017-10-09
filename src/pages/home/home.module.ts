import { SchedulePage } from './../schedule/schedule';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HomePage } from './home';
import { RoomPage } from './../room/room';
import { BookingPage } from './../booking/booking';

@NgModule({
  declarations: [
    HomePage,
    RoomPage,
    SchedulePage,
    BookingPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    HomePage,
    RoomPage,
    SchedulePage,
    BookingPage
  ]
})
export class HomePageModule {}
