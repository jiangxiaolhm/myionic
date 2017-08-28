import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Booking } from './../../models/booking';
import { DataProvider } from './../../providers/data';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  bookings: Booking[] = [];

  constructor(
    private dataProvider: DataProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
  }

  addBookingData() {
    this.dataProvider.push("bookings", {
      groupName: "groupName",
      roomId: "KsbcA8Xxg0YKZjiW6Iv",
      membersId: ["mJmvEU0qrFa6KW4LY2zdJEg2O5v2"],
      startTime: "2017-08-30T16:00:00.000Z1",
      endTime: "2017-08-30T18:00:00.000Z1"
    }).then((data) => {
      console.log("success " + data);
    }, (error) => {
      console.log(" fail " + error);
    });
  }

  loadBookings() {
    this.dataProvider.list('bookings', { preserveSnapshot: true }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        let booking: Booking = {
          id: snapshot.$key,
          groupName: snapshot.groupName,
          roomId: snapshot.roomId,
          membersId: snapshot.membersId,
          startTime: snapshot.startTime,
          endTime: snapshot.endTime,
        };
        console.log(booking);
        this.bookings.push(booking);
      });
    });
  }
}
