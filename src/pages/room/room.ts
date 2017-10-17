import { DAY_KEY_FORMAT } from './../../app/app.firebase.config';
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

    this.dataProvider.getRooms().then((rooms: Room[]) => {
      this.rooms = rooms;
      this.dataProvider.rooms = rooms;
      loading.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  /**
   * Direct to room's schedule page
   * Send index of date to set active slide index.
   * 
   * @private
   * @param {Room} room 
   * @memberof RoomPage
   */
  private viewSchedule(room: Room) {
    this.navCtrl.push(SchedulePage, {
      room: room,
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

  /**
   * Get and transform today to ISO format
   * 
   * @private
   * @returns {string} 
   * @memberof RoomPage
   */
  private minDate(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  /**
   * Get and transform next 7th day to ISO format
   * 
   * @private
   * @returns {string} 
   * @memberof RoomPage
   */
  private maxDate(): string {
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  /**
   * Update selected times
   * Transform datetime from ISO format to number of miliseconds.
   * 
   * @private
   * @memberof RoomPage
   */
  private timeChanged(): void {
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

  /**
   * Filter room with properties
   * 
   * @private
   * @param {Room} room 
   * @returns {boolean} 
   * @memberof RoomPage
   */
  private filter(room: Room): boolean {
    // Filter by building
    if (this.filterBuilding != '' && room.building != this.filterBuilding) {
      return false;
    }
    // Filter by room capacity
    if (this.filterCapacity != '' && room.capacity != this.filterCapacity) {
      return false;
    }
    // Filter by room type
    if (this.filterType != '' && room.type != this.filterType) {
      return false;
    }
    // Filter by date and time
    if (this.filterDate != '') {
      let date = new Date(this.filterDate + 'T00:00:00.000');
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.filterDateIndex = Math.round((date.getTime() - today.getTime()) / (86400000));
      if (this.filterStartTime != '' && this.filterEndTime != '') {
        if (room.days) {
          let day: Day = room.days[this.datePipe.transform(date, DAY_KEY_FORMAT)];
          if (day != undefined) {
            for (let i = 0; i < day.periods.length; i++) {
              if (day.periods[i].startTime >= this.filterStartTimeNumber && day.periods[i].endTime <= this.filterEndTimeNumber) {
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
