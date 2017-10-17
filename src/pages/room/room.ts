import { UtilProvider } from './../../providers/util';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { DAY_KEY_FORMAT } from './../../app/app.config';
import { Day } from './../../models/day';
import { Facility } from './../../models/facility';
import { Room } from './../../models/room';
import { SchedulePage } from './../schedule/schedule';
import { DataProvider } from './../../providers/data';

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
    private utilProvider: UtilProvider,
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
    // let d1 = new Date('2017-10-17T23:00:00.000Z')
    // let d2 = new Date('2017-10-18T10:00:00.000Z')
    // d2.setHours(d2.getHours() - 11);
    // console.log(d1.getTime());
    // console.log(d2.getTime());

    // let d3 = new Date(Date.UTC(2017, 10, 18, 10, 0, 0));
    // d3.setUTCHours(d3.getUTCHours() - 10);
    // let d4 = new Date(Date.UTC(2017, 10, 18, 0, 0, 0));
    // console.log(d4.toISOString());
    // console.log(d3.toISOString());
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
      this.filterStartTimeNumber = this.utilProvider.localTimeToUTCTime(new Date(this.filterDate + 'T' + this.filterStartTime + ':00.000Z')).getTime();
    } else {
      this.filterStartTime = this.filterEndTime;
      this.filterStartTimeNumber = this.filterEndTimeNumber;
    }
    if (this.filterEndTime != '') {
      this.filterEndTimeNumber = this.utilProvider.localTimeToUTCTime(new Date(this.filterDate + 'T' + this.filterEndTime + ':00.000Z')).getTime();
    } else {
      this.filterEndTime = this.filterStartTime;
      this.filterEndTimeNumber = this.filterStartTimeNumber;
    }
  }

  // private getUTCDate(date: string, time: string): Date {
  //   let splitDate = date.split('-');
  //   let splitTime = time.split(':');
  //   // return new Date(Date.UTC(splitDate[0], splitDate[1], ))
  // }

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
      let date = this.utilProvider.localTimeToUTCTime(new Date(this.filterDate + 'T00:00:00.000Z'));
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.filterDateIndex = Math.round((date.getTime() - today.getTime()) / (86400000));
      if (this.filterStartTime != '' && this.filterEndTime != '') {
        if (room.days) {
          let day: Day = room.days[this.datePipe.transform(date, DAY_KEY_FORMAT)];
          if (day) {
            // console.log();


            // if (room.name == '2a')
            //   console.log('-------------');

            for (let i = 0; i < day.periods.length; i++) {
              // if (room.name == '2a' && day.periods[i].startTime == 1508281200000) {
              //   console.log(day.periods[i]);
              //   console.log(day.periods[i].startTime);
              //   console.log(this.filterStartTimeNumber);
              //   console.log(day.periods[i].startTime >= this.filterStartTimeNumber);
              // }
              if (day.periods[i].startTime >= this.filterStartTimeNumber && day.periods[i].endTime <= this.filterEndTimeNumber) {
                if (!day.periods[i].available) {
                  // return false;
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
