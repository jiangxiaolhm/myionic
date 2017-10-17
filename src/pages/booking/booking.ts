import { async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Clipboard } from '@ionic-native/clipboard';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { DAY_KEY_FORMAT } from './../../app/app.config';
import { Booking } from './../../models/booking';
import { Day } from './../../models/day';
import { Period } from './../../models/period';
import { Room } from './../../models/room';
import { User } from './../../models/user';
import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';
import { UtilProvider } from './../../providers/util';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  bookings: Booking[] = [];
  searchBooking: Booking = null;

  constructor(
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private utilProvider: UtilProvider,
    private alertCtrl: AlertController,
    private datePipe: DatePipe,
    private clipboard: Clipboard,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }

  async ionViewDidLoad() {
    this.utilProvider.loadingPresent('Loading...');
    await this.loadBookings();
    this.bookings.forEach((booking: Booking) => {
      if (booking.ownerId != this.authProvider.getCurrentUserUid()) {
        // This booking is shared from other user.
        this.checkSharedBookingStatus(booking);
      }
    });
    this.utilProvider.loadingDismiss();
  }

  /**
   * Reset bookings list and search booking
   * 
   * @private
   * @returns {Promise<void>} 
   * @memberof BookingPage
   */
  private loadBookings(): Promise<void> {
    this.searchBooking = null;
    return this.dataProvider.getBookings(this.authProvider.getCurrentUserUid()).then((bookings: Booking[]) => {
      this.bookings = bookings;
    });
  }

  /**
   * Check and delete booking cancelled by the owner.
   * 
   * @private
   * @param {Booking} booking 
   * @memberof BookingPage
   */
  private async checkSharedBookingStatus(booking: Booking) {
    let dayKey: string = this.datePipe.transform(booking.startTime, DAY_KEY_FORMAT);
    let theDay: Day = null;
    await this.dataProvider.getDay(booking.roomKey, dayKey).then((day: Day) => {
      theDay = day;
    });

    for (let i = 0; i < theDay.periods.length; i++) {
      if (theDay.periods[i].startTime >= booking.startTime && theDay.periods[i].endTime <= booking.endTime) {
        if (theDay.periods[i].ownerId != booking.ownerId) {
          // This booking was cancelled by the booking owner.
          // Remove booking from user table.
          this.dataProvider.remove('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/', booking.$key);
          this.loadBookings();
          this.utilProvider.toastPresent('A booking was cancelled by the owner.')
          break;
        }
      }
    }
  }

  /**
   * Return if current user is the booking owner.
   * 
   * @private
   * @param {string} ownerId 
   * @returns {string} 
   * @memberof BookingPage
   */
  private getBookingType(ownerId: string): string {
    if (ownerId == this.authProvider.getCurrentUserUid()) {
      return 'Personal Booking';
    } else {
      return 'Shared Booking';
    }
  }

  /**
   * Share booking link with uid and booking key.
   * 
   * @private
   * @param {string} bookingKey 
   * @memberof BookingPage
   */
  private share(bookingKey: string) {
    this.alertCtrl.create({
      title: 'Copy the link to your friend.',
      inputs: [{
        name: 'link',
        value: this.authProvider.getCurrentUserUid() + bookingKey
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
   * @private
   * @param {string} link 
   * @memberof BookingPage
   */
  private search(link: string) {
    if (link.length != 48) {
      this.searchBooking = null;
    } else {
      let uid: string = link.substr(0, 28);
      let bookingKey: string = link.substr(28, 20);

      this.dataProvider.getBooking(uid, bookingKey).then((booking: Booking) => {
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
   * @private
   * @param {Booking} booking 
   * @memberof BookingPage
   */
  private async cancel(booking: Booking) {
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
            period.available = true;
            period.groupName = '';
            period.ownerId = '';
          }
        }
      });
      // Update the day of booking to available
      this.dataProvider.updateDay(booking.roomKey, dayKey, theDay);
    }
    // Remove booking from user table.
    this.dataProvider.remove('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/', booking.$key);
    this.loadBookings();
    this.utilProvider.toastPresent('Cancel booking successfully');
  }

  /**
   * Returen if the booking has started.
   * 
   * @private
   * @param {number} startTime 
   * @returns {boolean} 
   * @memberof BookingPage
   */
  private isExpired(startTime: number): boolean {
    return startTime < new Date().getTime();
  }

  /**
   * Add searched booking to user booking list.
   * 
   * @private
   * @param {Booking} booking 
   * @memberof BookingPage
   */
  private add(booking: Booking) {
    this.dataProvider.setBooking(this.authProvider.getCurrentUserUid(), booking);
    this.loadBookings();
    this.utilProvider.toastPresent('Add booking successfully');
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




