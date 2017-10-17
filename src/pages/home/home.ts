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
    this.authStateSubscription = this.authProvider.afAuth.authState.subscribe(currentUser => {
      if (currentUser && currentUser.email && currentUser.uid) {
        // Initilise user object
        this.dataProvider.getUser(currentUser.uid).then((user: User) => {
          this.dataProvider.user = user;
        });
        // Initilise user's bookings list
        this.dataProvider.bookings = this.dataProvider.list('/users/' + currentUser.uid + '/bookings');
      } else {
        this.logout();
      }
    });
  }

  /**
   * Logout
   * 
   * @memberof HomePage
   */
  logout(): void {
    this.authProvider.logout().then(() => {
    }, (error) => {
      console.log(error);
    });
    this.authStateSubscription.unsubscribe();
    this.navCtrl.setRoot(LoginPage);
    this.toastCtrl.create({
      message: `You are sign out already`,
      duration: 2000
    }).present();
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
