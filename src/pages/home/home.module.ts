import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { RoomPage } from './../room/room';

@NgModule({
  declarations: [
    HomePage,
    RoomPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    RoomPage
  ]
})
export class HomePageModule {}
