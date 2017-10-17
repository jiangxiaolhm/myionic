import { UtilProvider } from './../../providers/util';
import { MyApp } from './../../app/app.component';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/subscription';

import { BookingPage } from './../booking/booking';
import { LoginPage } from './../login/login';
import { RoomPage } from './../room/room';

import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';

import { User } from './../../models/user';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  private authStateSubscription: Subscription;

  constructor(
    private authProvider: AuthProvider,
    private dataProvider: DataProvider,
    private utilProvider: UtilProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    this.authStateSubscription = this.authProvider.afAuth.authState.subscribe(currentUser => {
      if (currentUser && currentUser.email && currentUser.uid) {
        // Keep updating user object
        this.dataProvider.getUser(currentUser.uid).then((user: User) => {
          this.dataProvider.user = user;
        });
      } else {
        this.authStateSubscription.unsubscribe();
        this.dataProvider.user = null;
        this.authProvider.logout();
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  /**
   * Logout
   * 
   * @memberof HomePage
   */
  logout() {
    this.authStateSubscription.unsubscribe();
    this.dataProvider.user = null;
    this.authProvider.logout();
    this.navCtrl.setRoot(LoginPage);
    this.utilProvider.toastPresent('You have already logged out.')
  }

  /**
   * Navigate to Room Page
   * 
   * @memberof HomePage
   */
  viewRoomPage() {
    this.navCtrl.push(RoomPage);
  }

  /**
   * Navigate to Booking Page
   * 
   * @memberof HomePage
   */
  viewBookingPage() {
    this.navCtrl.push(BookingPage);
  }
}
