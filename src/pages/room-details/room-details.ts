import { Duration } from './../../models/duration';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { BookingPage } from './../booking/booking';

import { DataProvider } from './../../providers/data';
import { AuthProvider } from './../../providers/auth';

@Component({
  selector: 'page-room-details',
  templateUrl: 'room-details.html',
})

export class RoomDetailsPage {
  durations: Duration[] = [];

  startDuration: Duration = null;
  endDuration: Duration = null;

  constructor(
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomDetailsPage');
    console.log(this.navParams);
    // this.timeList();
    this.initialiseSchedule();
  }

  initialiseSchedule() {
    let stTime = new Date("2017-08-30T00:00:00");
    let enTime = new Date("2017-08-30T00:15:00");

    for (let i = 0; i < 96; i++) {
      let duration: Duration = {
        startTime: new Date(stTime),
        endTime: new Date(enTime),
        available: true
      };
      this.durations.push(duration);
      stTime.setTime(stTime.getTime() + 15 * 60 * 1000);
      enTime.setTime(enTime.getTime() + 15 * 60 * 1000);
    }
  }

  timeList() {
    let time: string = "";
    for (var i = 0; i < 24; i++) {
      for (var j = 0; j <= 45; j += 15) {
        if (i < 10)
          time += "0";
        time += i + ":" + j;
        if (j == 0) {
          time += "0";
        }
        // this.times.push(time);
        time = "";
      }
    }
  }

  selectDuration(duration: Duration) {
    if (!this.startDuration) {
      this.startDuration = duration;
      console.log("start at " + this.startDuration.startTime);
    } else if (!this.endDuration) {
      this.endDuration = duration;
      console.log("end at " + this.endDuration.endTime);
    } else {
      this.startDuration = null;
      this.endDuration = null;
      console.log("select again");
    }
  }

  book() {
    if (this.startDuration && this.endDuration) {

      let diff = this.endDuration.endTime.getTime() - this.startDuration.startTime.getTime();

      if (diff < 0) {
        let temp: Duration = this.startDuration;
        this.startDuration = this.endDuration;
        this.endDuration = temp;
      }
      if (diff <= 2 * 60 * 60 * 1000) {
        console.log("valid duration");
        let prompt = this.alertCtrl.create({
          title: 'Make a booking',
          message: "Start Time: " + this.startDuration.startTime.toLocaleTimeString() + "<br>End Time: " + this.endDuration.endTime.toLocaleTimeString(),
          inputs: [{
            name: 'groupName',
            placeholder: 'Group Name'
          },],
          buttons: [{
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          }, {
            text: 'Book',
            handler: data => {
              this.dataProvider.push("bookings", {
                groupName: data.groupName,
                roomKey: this.navParams.data,
                membersKey: [this.authProvider.afAuth.auth.currentUser.uid],
                startTime: this.startDuration.startTime.toJSON(),
                endTime: this.endDuration.endTime.toJSON()
              }).then((data) => {
                console.log("success " + data);
                this.alertCtrl.create({
                  title: 'Congratulation',
                  subTitle: 'You have successfully booked a room.',
                  buttons: [{
                    text: 'OK',
                    handler: data => {
                      this.navCtrl.popToRoot();
                      this.navCtrl.push(BookingPage);
                    }
                  }]
                }).present();
                
              }, (error) => {
                console.log("fail " + error);
              });
            }
          }]
        });
        prompt.present();
      } else {
        console.log("invalid duration");
      }
    }
  }
}