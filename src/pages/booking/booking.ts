import { Room } from './../../models/room';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { Booking } from './../../models/booking';
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

  bookings: FirebaseListObservable<Booking[]> = null;
  location: string = 'null';
  constructor(
    private datePipe: DatePipe,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    private localNotifications: LocalNotifications,
    public navCtrl: NavController,
    public navParams: NavParams


  ) { }

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

  cancel(id) {
    this.dataProvider.remove('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/', id);
  }

  private setNotification(bookingStartTime) {
      let prompt = this.alertCtrl.create({
                title: 'Remind Me In ',
                inputs: [
                 {
                   type: 'radio',
                   label: 'now(should be: 30mins)',
                   value: '0'
                 },
                 {
                   type:'radio',
                   label: '1 hour',
                   value:'3600000'
                 },
                 {
                   type:'radio',
                   label: '2 hours',
                   value:'7200000'
                 },
                 {
                   type:'radio',
                   label: '1 days',
                   value:'86400000'
                 },
               ],
                buttons: [
                  {
                    text:'Cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text:'Set',
                    handler: data => {
                      console.log('Set clicked');
                      this.scheduleNotification(bookingStartTime,data);
                    }
                  }
                ]
      });
            prompt.present();
  }

  scheduleNotification(time,value) {
    var v = +value;
    this.localNotifications.schedule({
      title: 'Room Booking System',
      text: 'Room booking reminder :: ' + this.datePipe.transform(time , 'short'),

      //this is the tester reminder time
      at:  new Date(new Date().getTime() + v)
      //at:  new Date(time + v)
      //This is the correct reminder time
    })
  }
}
