import { UtilProvider } from './../../providers/util';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { User } from './../../models/user';

import { HomePage } from './../home/home';
import { RegisterPage } from './../register/register';

import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    private authProvier: AuthProvider,
    private utilProvider: UtilProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /**
   * Login with user email and password
   * 
   * @memberof LoginPage
   */
  login() {
    if (!this.user.email) {
      this.utilProvider.toastPresent('The email address must be a valid string');
    } else if (!this.user.password) {
      this.utilProvider.toastPresent('The password must be a valid string');
    } else {
      this.utilProvider.loadingPresent('Signing in. Please wait...');
      this.authProvier.login(this.user).then((data) => {
        // Login successfully
        this.utilProvider.loadingDismiss();
        this.navCtrl.setRoot(HomePage);
        this.utilProvider.toastPresent('Welcome to Room Booking System, ' + this.authProvier.getCurrentUserName());
      }, (error) => {
        // Login failed
        this.utilProvider.loadingDismiss();
        this.utilProvider.toastPresent(error.message);
      });
    }
  }

  /**
   * Navigate to register page
   * 
   * @memberof LoginPage
   */
  register() {
    this.navCtrl.push(RegisterPage);
  }

}
