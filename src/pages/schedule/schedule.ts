import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { NavController, NavParams, AlertController, Slides, LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs/subscription'

import { PERIOD_LENGTH, MAX_ADVANCE_BOOKING_DAY, DAY_KEY_FORMAT } from './../../app/app.config';
import { Day } from './../../models/day';
import { Period } from './../../models/period';
import { Room } from './../../models/room';
import { BookingPage } from './../booking/booking';
import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';
import { UtilProvider } from './../../providers/util';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})

export class SchedulePage {

  @ViewChild(Slides)
  private slides: Slides;
  private slidesIndex: number = 0;
  private room: Room = null;
  private days: Day[] = [];
  private periodA: Period = null;
  private periodB: Period = null;

  constructor(
    private datePipe: DatePipe,
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private utilProvider: UtilProvider,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.room = this.navParams.data.room;
    this.initialiseDays();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
    this.slidesIndex = this.navParams.data.slidesIndex;
  }

  /**
   * get current day and next 7 days data for booking
   * 
   * @private
   * @memberof SchedulePage
   */
  private initialiseDays() {
    this.utilProvider.loadingPresent('Loading...');
    let startTime = new Date();
    let endTime = new Date();
    startTime.setHours(8, 0, 0, 0);
    endTime.setHours(20, 0, 0, 0);

    for (let i = 0; i <= 7; i++) {
      let dayKey: string = this.datePipe.transform(startTime, DAY_KEY_FORMAT)
      if (this.room.days[dayKey]) {
        // initialise using exsiting day record
        this.days.push(this.room.days[dayKey]);
      } else {
        // no booking record, initialise with empty day
        let day: Day = {
          $key: dayKey,
          startTime: startTime.getTime(),
          endTime: endTime.getTime(),
          periods: []
        };
        for (let j = day.startTime; j < day.endTime; j += PERIOD_LENGTH) {
          day.periods.push({
            ownerId: '',
            startTime: j,
            endTime: j + PERIOD_LENGTH,
            available: true,
            groupName: ''
          });
        }
        this.days.push(day);
      }

      startTime.setDate(startTime.getDate() + 1);
      endTime.setDate(endTime.getDate() + 1);
    }
    this.utilProvider.loadingDismiss();
  }

  /**
   * disable unavailable periods
   * 
   * @private
   * @param {Period} period 
   * @returns {boolean} 
   * @memberof SchedulePage
   */
  private isDisabled(period: Period): boolean {
    return !period.available;
  }

  /**
   * hide expired periods
   * 
   * @private
   * @param {Period} period 
   * @returns {boolean} 
   * @memberof SchedulePage
   */
  private isHidden(period: Period): boolean {
    return period.startTime < new Date().getTime();
  }

  /**
   * highlight periods' status with different colours
   * 
   * @private
   * @param {Period} period 
   * @returns {string} 
   * @memberof SchedulePage
   */
  private getColour(period: Period): string {
    if (period == this.periodA || period == this.periodB) {
      // highlight first and last selected periods
      return 'primary';
    }
    if (this.periodA != null && this.periodB != null && period.startTime >= this.periodA.startTime && period.endTime <= this.periodB.endTime) {
      // highlight periods between selected periods
      return 'primary';
    }
    // highlight available and unavailable periods
    return period.available ? 'light' : 'dark';
  }

  /**
   * get period start time, end time and status to a formatted string
   * 
   * @private
   * @param {Period} period 
   * @returns {string} 
   * @memberof SchedulePage
   */
  private getPeriodInfo(period: Period): string {
    let periodInfo: string = this.datePipe.transform(period.startTime, 'HH:mm') + ' - ' + this.datePipe.transform(period.endTime, 'HH:mm');
    if (period.startTime < new Date().getTime()) {
      periodInfo += ' Expired';
    } else {
      periodInfo += period.available ? ' Free' : ' Booked \"' + period.groupName + '\"';
    }
    return periodInfo;
  }

  /**
   * store and reset user period selections for booking rooms
   * 
   * @private
   * @param {Period} period 
   * @memberof SchedulePage
   */
  private selectPeriod(period: Period) {
    if (this.periodA != null && this.periodB != null) {
      // reset selections
      this.periodA = null;
      this.periodB = null;
    } else if (this.periodA == null) {
      // store first selected period
      this.periodA = period;
    } else if (period == this.periodA) {
      this.periodA = null;
    } else if (this.periodB == null) {
      // store second selected period
      if (period.startTime < this.periodA.startTime) {
        // make sure periodA is easier than periodB
        this.periodB = this.periodA;
        this.periodA = period;
      } else {
        this.periodB = period;
      }
    }
  }

  /**
   * only display the active slide in presentation to improve performance
   * 
   * @private
   * @param {number} i 
   * @returns {boolean} 
   * @memberof SchedulePage
   */
  private isActiveSlide(i: number): boolean {
    return (this.slides.getActiveIndex() == i);
  }

  /**
   * Slides to last day
   * 
   * @private
   * @memberof SchedulePage
   */
  private lastDay() {
    if (!this.slides.isBeginning()) {
      this.periodA = null;
      this.periodB = null;
      this.slides.slidePrev();
    }
  }


  /**
   * Slides to next day
   * 
   * @private
   * @memberof SchedulePage
   */
  private nextDay() {
    if (!this.slides.isEnd()) {
      this.periodA = null;
      this.periodB = null;
      this.slides.slideNext();
    }
  }

  /**
   * book a room for a sequence of periods
   * 
   * @private
   * @memberof SchedulePage
   */
  private bookRoom() {
    let bookingStartTime: number = null;
    let bookingEndTime: number = null;

    if (this.periodA != null) {
      bookingStartTime = this.periodA.startTime;
      if (this.periodB == null) {
        // user may only choose one period
        bookingEndTime = this.periodA.endTime;
      } else {
        bookingEndTime = this.periodB.endTime;
      }
      // prompt alert to input group name
      let prompt = this.alertCtrl.create({
        title: 'Make a booking',
        message: "Start Time: " + this.datePipe.transform(bookingStartTime, 'MMM d, y HH:mm')
        + "<br>End Time: " + this.datePipe.transform(bookingEndTime, 'MMM d, y HH:mm'),
        inputs: [{
          name: 'groupName',
          placeholder: 'Enter your group name'
        },],
        buttons: [{
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Book',
          handler: data => {
            if (data.groupName == "") {
              console.log("groupname is empty");
            } else {
              this.addUserBooking(data.groupName, bookingStartTime, bookingEndTime);
              this.addRoomBooking(data.groupName, bookingStartTime, bookingEndTime);
              this.periodA = null;
              this.periodB = null;
            }
          }
        }]
      });
      prompt.present();
    } else {
      console.log("invalid duration");
    }
  }

  /**
   * push new booking to user in database
   * 
   * @private
   * @param {string} groupName 
   * @param {number} bookingStartTime 
   * @param {number} bookingEndTime 
   * @memberof SchedulePage
   */
  private addUserBooking(groupName: string, bookingStartTime: number, bookingEndTime: number) {
    this.dataProvider.push('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/', {
      ownerId: this.authProvider.afAuth.auth.currentUser.uid,
      groupName: groupName,
      roomKey: this.room.$key,
      location: this.room.building + ' ' + this.room.location + ' ' + this.room.name,
      startTime: bookingStartTime,
      endTime: bookingEndTime
    }).then(data => {
      console.log('add user booking success');
    }, error => {
      console.log('add user booking fail');
    })
  }

  /**
   * update room state of days in database
   * 
   * @private
   * @param {string} groupName 
   * @param {number} bookingStartTime 
   * @param {number} bookingEndTime 
   * @memberof SchedulePage
   */
  private addRoomBooking(groupName: string, bookingStartTime: number, bookingEndTime: number) {
    let day: Day = this.days[this.slides.getActiveIndex()];

    for (let i = 0; i < day.periods.length; i++) {
      if (day.periods[i].startTime >= bookingStartTime && day.periods[i].endTime <= bookingEndTime) {
        day.periods[i].ownerId = this.authProvider.afAuth.auth.currentUser.uid;
        day.periods[i].groupName = groupName;
        day.periods[i].available = false;
      }
    }
    this.dataProvider.update(
      'rooms/' + this.room.$key + '/days/' + this.datePipe.transform(day.startTime, DAY_KEY_FORMAT), {
        startTime: day.startTime,
        endTime: day.endTime,
        periods: day.periods
      }
    ).then(() => {
      console.log('update room booking success');
      this.navCtrl.popToRoot();
      this.navCtrl.push(BookingPage);
    }, error => {
      console.log('update room booking fail');
      this.alertCtrl.create({
        title: 'Booking was unsuccessful, please try again',
        buttons: [{
          text: 'OK',
          handler: data => {
            this.navCtrl.pop();
            this.navCtrl.push(SchedulePage);
          }
        }]
      }).present();

    });
  }

}