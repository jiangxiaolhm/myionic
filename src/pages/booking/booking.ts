import { DAY_KEY_FORMAT } from './../../app/app.firebase.config';
import { UtilProvider } from './../../providers/util';
import { Period } from './../../models/period';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Clipboard } from '@ionic-native/clipboard';
import { Booking } from './../../models/booking';
import { Day } from './../../models/day';
import { User } from './../../models/user';
import { Room } from './../../models/room';

import { DataProvider } from './../../providers/data';
import { AuthProvider } from './../../providers/auth';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {


  // bookings: FirebaseListObservable<Booking[]> = null;
  bookings: Booking[] = [];
  searchBooking: Booking = null;
  location: string = 'null';

  constructor(
    private datePipe: DatePipe,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private utilProvider: UtilProvider,
    private alertCtrl: AlertController,
    private clipboard: Clipboard,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {

    this.dataProvider.getBookings(this.authProvider.getCurrentUserUid()).then((bookings: Booking[]) => {
      this.bookings = bookings;
      console.log(this.bookings);
    })
    if (this.dataProvider.user.bookings) {
      this.bookings = this.dataProvider.user.bookings;
    }
  }

  ionViewDidLoad() {

    
    // this.dataProvider.getUser()

    // this.bookings = this.dataProvider.bookings;

    // // Get room location using room key from rooms table
    // await this.dataProvider.list('rooms', {
    //   orderByKey: true,
    //   equalTo: '-Ksdgn_rXX1nUrovbqUv'
    // }).map((rooms: Room[]) => {
    //   this.location = rooms[0].building + ' ' + rooms[0].location + ' ' + rooms[0].name;
    // }).first().toPromise();
  }

  getBookingRoomLocation(roomKey: string): string {
    // have a bug
    let location: string = '';
    this.dataProvider.getRoom(roomKey).then((room: Room) => {
      location = room.building + ' ' + room.location + ' ' + room.name;
    });
    return location;
  }


  share(bookingId) {
    //share link pop up using key of sharebooking table
    this.alertCtrl.create({
      title: 'Copy the link to your friend.',
      inputs: [{
        name: 'link',
        value: this.authProvider.getCurrentUserUid() + bookingId
      }],
      buttons: [{
        text: 'OK'
      }, {
        text: 'clipBoard',
        handler: data => {
          this.clipboard.copy(data.link).then((link) => {
            this.utilProvider.toastPresent('Copied link to clipboard');
          }, (error) => {
            this.utilProvider.toastPresent('Cannot copy link to clipboard, please copy again manually.');
          });
        }
      }]
    }).present();
  }

  /**
   * Search shared booking using the owner's booking link.
   * 
   * @param {string} link 
   * @memberof BookingPage
   */
  async search(link: string) {
    if (link.length != 48) {
      this.searchBooking = null;
    } else {
      let uid: string = link.substr(0, 28);
      let bookingKey: string = link.substr(28, 20);

      await this.dataProvider.getBooking(uid, bookingKey).then((booking: Booking) => {
        if (booking.ownerId == null) {
          this.searchBooking = null;
        } else {
          this.searchBooking = booking;
        }
      });
    }
  }

  /**
   * Cancel booking
   * The owner can cancel booking and update availability of room.
   * The shared user can cancel booking from user booking list.
   * 
   * @param {Booking} booking 
   * @memberof BookingPage
   */
  async cancel(booking: Booking) {
    // If current user is the booking owner.
    if (booking.ownerId == this.authProvider.afAuth.auth.currentUser.uid) {
      let dayKey: string = this.datePipe.transform(booking.startTime, DAY_KEY_FORMAT);
      let theDay: Day = null;
      await this.dataProvider.getDay(booking.roomKey, dayKey).then((day: Day) => {
        theDay = day;
      });

      theDay.periods.forEach((period: Period) => {
        if (period.startTime >= booking.startTime && period.endTime <= booking.endTime) {
          if (period.ownerId == booking.ownerId) {
            console.log('aa');
            period.available = true;
            period.groupName = '';
            period.ownerId = '';
          }
        }
      });
      // Update the day of booking to available
      this.dataProvider.setDay(booking.roomKey, dayKey, theDay);
    }
    // Remove booking from user table.
    this.dataProvider.remove('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/', booking.$key);
  }

  /**
   * Returen if the booking has started.
   * 
   * @param {any} startTime 
   * @returns {boolean} 
   * @memberof BookingPage
   */
  isExpired(startTime: number): boolean {
    return startTime < new Date().getTime();
  }

  add(groupName, roomKey, startTime, endTime, location) {
    this.dataProvider.push('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/', {
      groupName: groupName,
      roomKey: roomKey,
      startTime: startTime,
      endTime: endTime,
      location: location

    }).then(data => {
      console.log('add success');
      this.alertCtrl.create({
        title: 'Add to your booking list successfully',
        buttons: [{
          text: 'OK',
          handler: data => {
            this.navCtrl.push(BookingPage);
          }
        }]
      }).present();
    }, error => {
      console.log('add fail');
    })
  }

  // private setNotification(bookingStartTime) {
  //     let prompt = this.alertCtrl.create({
  //               title: 'Remind Me In ',
  //               inputs: [
  //                {
  //                  type: 'radio',
  //                  label: 'now(should be: 30mins)',
  //                  value: '0'
  //                },
  //                {
  //                  type:'radio',
  //                  label: '1 hour',
  //                  value:'3600000'
  //                },
  //                {
  //                  type:'radio',
  //                  label: '2 hours',
  //                  value:'7200000'
  //                },
  //                {
  //                  type:'radio',
  //                  label: '1 days',
  //                  value:'86400000'
  //                },
  //              ],
  //               buttons: [
  //                 {
  //                   text:'Cancel',
  //                   handler: data => {
  //                     console.log('Cancel clicked');
  //                   }
  //                 },
  //                 {
  //                   text:'Set',
  //                   handler: data => {
  //                     console.log('Set clicked');
  //                     this.scheduleNotification(bookingStartTime,data);
  //                   }
  //                 }
  //               ]
  //     });
  //           prompt.present();
  // }

  // scheduleNotification(time,value) {
  //   var v = +value;
  //   this.localNotifications.schedule({
  //     title: 'Room Booking System',
  //     text: 'Room booking reminder :: ' + this.datePipe.transform(time , 'short'),

  //     //this is the tester reminder time
  //     at:  new Date(new Date().getTime() + v)
  //     //at:  new Date(time + v)
  //     //This is the correct reminder time
  //   })
  // }
}




