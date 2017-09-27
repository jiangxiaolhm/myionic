import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, NavParams, AlertController, Slides } from 'ionic-angular';

import { PERIOD_CONFIG, MAX_ADVANCE_BOOKING_DAY } from './../../app/app.firebase.config';
import { Period } from './../../models/period';
import { Day } from './../../models/day';
import { DataProvider } from './../../providers/data';
import { AuthProvider } from './../../providers/auth';

@Component({
  selector: 'page-room-details',
  templateUrl: 'room-details.html',
})

export class RoomDetailsPage {
  @ViewChild(Slides) slides: Slides;

  day: Day = null;
  days: Day[] = [];
  // index: number = null;
  indexA: number = null;
  indexB: number = null;

  constructor(
    private datePipe: DatePipe,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.day = this.newDay();
    this.days.push(this.day);
    this.days.push(this.newDay());
    this.days[1].startTime = new Date("2017-08-31T08:00:00");
    this.days[1].endTime = new Date("2017-08-31T22:00:00");
    console.log(this.days);
    // this.index = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomDetailsPage');
    console.log(this.navParams);
    // console.log('index is ' + this.index);
  }

  newDay() {
    let newDay: Day = {
      startTime: new Date("2017-08-30T08:00:00"),
      endTime: new Date("2017-08-30T22:00:00"),
      periods: []
    };

    let numberOfPeriods = (newDay.endTime.getTime() - newDay.startTime.getTime()) / PERIOD_CONFIG;

    for (let i = 0; i < numberOfPeriods; i++) {
      let period: Period = {
        index: i,
        available: (i < 10),
        groupName: ""
      };
      newDay.periods.push(period);
    }
    return newDay;
  }

  getPeriodInfo(period: Period) {
    let periodStart: Date = new Date(this.day.startTime.getTime() + period.index * PERIOD_CONFIG);
    let periodEnd: Date = new Date(periodStart.getTime() + PERIOD_CONFIG);
    let periodInfo: string = this.datePipe.transform(periodStart, 'HH:mm') + ' - ' + this.datePipe.transform(periodEnd, 'HH:mm');
    periodInfo += period.available ? " Free" : " Booked";
    return periodInfo;
  }

  getColor(period: Period) {
    if (period.index == this.indexA || period.index == this.indexB)
      return "danger";
    
    if (period.index > this.indexA && period.index < this.indexB)
      return "primary";


    return period.available ? "light" : "dark";
  }

  lastDay() {
    this.indexA = null;
    this.indexB = null;
    if (this.slides.getActiveIndex() > 0)
      this.slides.slidePrev();
  }

  nextDay() {
    this.indexA = null;
    this.indexB = null;
    if (this.slides.getActiveIndex() < this.days.length - 1)
      this.slides.slideNext();
  }

  selectPeriod(index: number) {
    if (this.indexA == null) {
      this.indexA = index;
    }
    else if (this.indexB == null) {
      if (index < this.indexA) {
        this.indexB = this.indexA;
        this.indexA = index;
      } else {
        this.indexB = index;
      }
    }
    else {
      this.indexA = null;
      this.indexB = null;
    }
  }
}