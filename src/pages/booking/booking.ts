import { Room } from './../../models/room';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
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

  cancel(id){
     this.dataProvider.remove('users/' + this.authProvider.afAuth.auth.currentUser.uid + '/bookings/',id);
     
  }

  isExpired(endTime){
    var q = new Date();
    var m = q.getMonth();
    var d = q.getDate();
    var y = q.getFullYear();
    var date = new Date(y,m,d);
    
    var endDate = new Date(endTime);
    return endDate < date;
  }
}
