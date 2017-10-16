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
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /**
   * Login with user email and password
   * 
   * @param {User} user 
   * @memberof LoginPage
   */
  login(user: User): void {
    const loading = this.loadingCtrl.create({
      content: "Please waiting ..."
    });
    loading.present();
    this.authProvier.login(user).then((data) => {
      loading.dismiss();
      this.navCtrl.setRoot(HomePage);
      this.toastCtrl.create({
        message: `Welcome to Homepage, ${data.email}`,
        duration: 2000
      }).present();
    }, (error) => {
      loading.dismiss();
      this.toastCtrl.create({
        message: `${error.message}`,
        showCloseButton: true
      }).present();
    });
  }

  /**
   * Navigate to register page
   * 
   * @memberof LoginPage
   */
  register(): void {
    this.navCtrl.push(RegisterPage);
  }

}
