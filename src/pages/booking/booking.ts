import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { Booking } from './../../models/booking';
import { DataProvider } from './../../providers/data';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  bookings: FirebaseListObservable<Booking[]> = null;

  constructor(
    private dataProvider: DataProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
    this.bookings = this.dataProvider.list('/bookings');
  }

  addBookingData() {
    this.dataProvider.push("bookings", {
      groupName: "groupName",
      roomKey: "KsbcA8Xxg0YKZjiW6Iv",
      membersKey: ["mJmvEU0qrFa6KW4LY2zdJEg2O5v2"],
      startTime: "2017-08-30T16:00:00.000Z1",
      endTime: "2017-08-30T18:00:00.000Z1"
    }).then((data) => {
      console.log("success " + data);
    }, (error) => {
      console.log("fail " + error);
    });
  }
}
