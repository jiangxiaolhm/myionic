import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { Day } from './../../models/day';
import { Facility } from './../../models/facility';
import { Room } from './../../models/room';
import { DataProvider } from './../../providers/data';
import { SchedulePage } from './../schedule/schedule';

@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  private filterBuilding: any = '';
  private filterCapacity: any = '';
  private filterType: any = '';
  private filterDate: any = '';
  private filterDateIndex: number = 0;
  private filterStartTime: any = '';
  private filterEndTime: any = '';
  private filterStartTimeNumber: number = 0;
  private filterEndTimeNumber: number = 0; s

  private rooms: Room[] = null;

  constructor(
    private dataProvider: DataProvider,
    private loadingCtrl: LoadingController,
    private datePipe: DatePipe,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    const loading = this.loadingCtrl.create({
      content: 'Loading ...'
    });
    loading.present();

    this.filterDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.dataProvider.list('/rooms').map((data: Room[]) => {
      this.rooms = data;
      loading.dismiss();
    }).first().toPromise();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  /**
   * Direct to room's schedule page with room key
   * 
   * @private
   * @param {string} key 
   * @memberof RoomPage
   */
  private viewSchedule(key: string) {
    this.navCtrl.push(SchedulePage, {
      roomKey: key,
      slidesIndex: this.filterDateIndex
    });
  }

  /**
   * Return facility string for presentation
   * 
   * @private
   * @param {Facility[]} facilities 
   * @returns {string} 
   * @memberof RoomPage
   */
  private facilitiesToString(facilities: Facility[]): string {
    let result: string = '';
    facilities.forEach(facility => {
      result += facility.quantity + ' ' + facility.name + ' ';
    });
    return result;
  }

  private minDate(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  private maxDate(): string {
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  private timeChanged() {
    if (this.filterStartTime != '') {
      this.filterStartTimeNumber = new Date(this.filterDate + 'T' + this.filterStartTime + ':00.000').getTime();
    } else {
      this.filterStartTime = this.filterEndTime;
      this.filterStartTimeNumber = this.filterEndTimeNumber;
    }
    if (this.filterEndTime != '') {
      this.filterEndTimeNumber = new Date(this.filterDate + 'T' + this.filterEndTime + ':00.000').getTime();
    } else {
      this.filterEndTime = this.filterStartTime;
      this.filterEndTimeNumber = this.filterStartTimeNumber;
    }
  }

  // debugging add test data
  addRoomData() {
    for (var i = 1; i <= 10; i++) {
      this.dataProvider.push('rooms', {
        name: i + 'b',
        building: 'Building 11',
        location: 'Level 01',
        type: 'Individual Study',
        facilities: [{
          name: 'computer',
          quantity: 1
        }, {
          name: 'whiteboard',
          quantity: 1
        }],
        capacity: 4,
        notes: ''
      }).then((data) => {
        console.log('#' + i + ' success ' + data);
      }, (error) => {
        console.log('#' + i + ' fail ' + error);
      });
    }
  }

  private filter(room: Room) {

    if (this.filterBuilding != '' && room.building != this.filterBuilding) {
      return false;
    }
    if (this.filterCapacity != '' && room.capacity != this.filterCapacity) {
      return false;
    }
    if (this.filterType != '' && room.type != this.filterType) {
      return false;
    }
    if (this.filterDate != '') {
      let date = new Date(this.filterDate + 'T00:00:00.000');
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.filterDateIndex = Math.round((date.getTime() - today.getTime()) / (86400000));
      if (this.filterStartTime != '' && this.filterEndTime != '') {
        if (room.days) {
          let day: Day = room.days[this.datePipe.transform(date, "dd_MM_yyyy")];
          if (day != undefined) {
            let startTime = new Date(this.filterDate + 'T' + this.filterStartTime + ':00.000').getTime();
            let endTime = new Date(this.filterDate + 'T' + this.filterEndTime + ':00.000').getTime();
            for (let i = 0; i < day.periods.length; i++) {
              if (day.periods[i].startTime >= startTime && day.periods[i].endTime <= endTime) {
                if (!day.periods[i].available) {
                  return false;
                }
              }
            }
          }
        }
      }
    }

    return true;
  }

}
