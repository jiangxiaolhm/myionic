import { Facility } from './../../models/facility';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { Room } from './../../models/room';
import { DataProvider } from './../../providers/data';
import { SchedulePage } from './../schedule/schedule';

@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  rooms: FirebaseListObservable<Room[]> = null;

  constructor(
    private dataProvider: DataProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.rooms = this.dataProvider.rooms;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  viewRoomDetail(key: string) {
    this.navCtrl.push(SchedulePage, key);
  }

  facilitiesToString(facilities: Facility[]): string {
    let result: string = "";
    facilities.forEach(facility => {
      result += facility.quantity + " " + facility.name + " ";
    });
    return result;
  }

    // debugging add test data
    addRoomData() {
      for (var i = 1; i <= 10; i++) {
        this.dataProvider.push("rooms", {
          name: i + "a",
          building: "Library",
          location: "Level 01",
          type: "Group Study",
          facilities: [{
            name: "computer",
            quantity: 1
          }, {
            name: "whiteboard",
            quantity: 1
          }],
          capacity: 6,
          notes: ""
        }).then((data) => {
          console.log("#" + i + " success " + data);
        }, (error) => {
          console.log("#" + i + " fail " + error);
        });
      }
    }
}
