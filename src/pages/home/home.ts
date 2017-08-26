import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { AuthProvider } from './../../providers/auth';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    private authProvider: AuthProvider,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    // Keep checking auth state
    // Redirect to login page when signout
    this.authProvider.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toastCtrl.create({
          message: `Welcome to Homepage, ${data.email}`,
          duration: 2000
        }).present();
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
}
