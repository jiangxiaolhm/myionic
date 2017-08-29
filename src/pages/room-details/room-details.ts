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
  times: string[] = [];
  startTime: Date;
  endTime: Date;

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
    this.timeList();
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
        this.times.push(time);
        time = "";
      }
    }
  }

  selectTime(time: String) {
    if (!this.startTime) {
      this.startTime = new Date("2017-08-30T" + time + ":00.000");
      console.log("start " + this.startTime);
    } else if (!this.endTime) {
      this.endTime = new Date("2017-08-30T" + time + ":00.000");
      console.log("end " + this.endTime);
    } else {
      this.startTime = null;
      this.endTime = null;
      console.log("select again");
    }
  }

  book() {
    if (this.startTime && this.endTime) {

      let diff = this.endTime.getTime() - this.startTime.getTime();

      if (diff > 0 && diff <= 2 * 60 * 60 * 1000) {
        console.log("valid duration");

        let prompt = this.alertCtrl.create({
          title: 'Make a booking',
          message: "Enter a group name for your room.",
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
                startTime: this.startTime.toJSON(),
                endTime: this.endTime.toJSON()
              }).then((data) => {
                console.log("success " + data);
                this.navCtrl.popToRoot();
                this.navCtrl.push(BookingPage);
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