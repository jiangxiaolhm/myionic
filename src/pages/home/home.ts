import { MyApp } from './../../app/app.component';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';

import { LoginPage } from './../login/login';
import { RoomPage } from './../room/room';
import { BookingPage } from './../booking/booking';

import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    // Keep checking auth state
    // Redirect to login page when signout
    this.authProvider.afAuth.authState.subscribe(currentUser => {
      if (currentUser && currentUser.email && currentUser.uid) {
        this.toastCtrl.create({
          message: `Welcome to Homepage, ${currentUser.email}`,
          duration: 2000
        }).present();

        // Initilise user object
        this.dataProvider.user = this.dataProvider.object('/users/' + currentUser.uid);
        // Initilise user's bookings list
        this.dataProvider.bookings = this.dataProvider.list('/users/' + currentUser.uid + '/bookings');
      } else {
        this.toastCtrl.create({
          message: `You are sign out already`,
          duration: 2000
        }).present();
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  logout() {
    this.authProvider.logout().then(() => {
    }, (error) => {
      console.log(error);
    });
  }

  viewRoomPage() {
    this.navCtrl.push(RoomPage);
  }

  viewBookingPage() {
    this.navCtrl.push(BookingPage);
  }
}
