import { RoomDetailsPage } from './../room-details/room-details';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Room } from './../../models/room';
import { DataProvider } from './../../providers/data';


@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  rooms: Room[] = [];

  constructor(
    public dataProvider: DataProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.loadData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
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
        capcity: 6,
        notes: ""
      }).then((data) => {
        console.log("#" + i + " success " + data);
      }, (error) => {
        console.log("#" + i + " fail " + error);
      });
    }
  }

  /**
   * Load room data from database to local
   */
  loadData() {
    this.dataProvider.list('rooms', { preserveSnapshot: true }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        let room: Room = {
          name: snapshot.name,
          building: snapshot.building,
          location: snapshot.location,
          type: snapshot.type,
          facilities: snapshot.facilities,
          capcity: snapshot.capcity,
          notes: snapshot.notes
        };
        console.log(room);
        this.rooms.push(room);
      });
    })
  }

  foo(room) {
    console.log(room);
  }

  viewRoomDetail(){
    this.navCtrl.push(RoomDetailsPage);
  }

  loopFacilities(facilities: {
    name: string;
    quantity: number;
    }[]): string {
    let result: string = "";
    facilities.forEach(facility => {
      result += facility.quantity + " " + facility.name + " ";
    });

    return result;
  }

 

}
