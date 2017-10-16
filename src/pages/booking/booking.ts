import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Booking } from './../../models/booking';
import { User } from './../../models/user';
import { Room } from './../../models/room';

import { DataProvider } from './../../providers/data';
import { AuthProvider } from './../../providers/auth';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as Clipboard from 'clipboard/dist/clipboard.min.js';
import * as NGClipboard from 'ngclipboard/dist/ngclipboard.min.js';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  
  
  bookings: FirebaseListObservable<Booking[]> = null;
  clipboard : Clipboard;
  searchBooking: FirebaseListObservable<Booking[]> = null;
  location: string = 'null';

  constructor(
    private datePipe: DatePipe,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) { 
    
  }

  async ionViewDidLoad() {

    this.bookings = this.dataProvider.bookings;

    // Get room location using room key from rooms table
    await this.dataProvider.list('rooms', {
      orderByKey: true,
      equalTo: '-Ksdgn_rXX1nUrovbqUv'
    }).map((rooms: Room[]) => {
      this.location = rooms[0].building + ' ' + rooms[0].location + ' ' + rooms[0].name;
    }).first().toPromise();
  }


   //share link
  share(bookingId){
    // push to share booking table

    //share link pop up using key of sharebooking table
    this.alertCtrl.create({
      title: 'Copy the link to your friend.',
      inputs: [
        {
          name: 'link',
          id: 'copyTarget',
          value: this.authProvider.afAuth.auth.currentUser.uid + '/' + bookingId
        },
      ],
      buttons: [{
        text: 'OK',
        handler: data => {
          this.navCtrl.push(BookingPage);
        }
      },{
        text:'clipBoard',
        handler:data => {
          this.clipboard = new Clipboard('#copyTarget');
          this.clipboard.on('success', () => this.showMsg(this.toastCtrl));
        }
      }]
    }).present();
    
  }


  // search share booking from given link
  search(link){
    var split = link.split("/");
    this.searchBooking = this.dataProvider.list('users/'+ split[0] + '/bookings/', {
      orderByKey: '$key',
      equalTo:  split[1]
    });
    console.log(this.searchBooking);
  }
  
 
  // Cancel the booking 
  cancel(id){
    this.dataProvider.remove('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/',id);
  }

 // disable buttons if booking is expired
  isExpired(endTime){
    return endTime < new Date().getTime();
  }


  //show message when copied
  showMsg(toastCtrl: ToastController) {
    let toast = toastCtrl.create({
        message: 'copied to clipboard',
        duration: 3000,
        position: 'top'
    });
    toast.present();
  }

  add(groupName, roomKey, startTime, endTime, location){
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


  

