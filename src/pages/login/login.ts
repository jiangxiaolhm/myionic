import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { User } from './../../models/user';
import { HomePage } from './../home/home';
import { RegisterPage } from './../register/register';

import { AuthProvider } from './../../providers/auth';

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
   * @param user 
   */
  login(user: User) {
    const loading = this.loadingCtrl.create({
      content: "Please waiting ..."
    });
    loading.present();
    this.authProvier.login(user).then((data) => {
      loading.dismiss();
      this.navCtrl.setRoot(HomePage);
    }, (error) => {
      loading.dismiss();
      console.log(error);
      this.toastCtrl.create({
        message: `${error.message}`,
        showCloseButton: true
      }).present();
    });
  }

  /**
   * Navigate to register page
   */
  register() {
    this.navCtrl.push(RegisterPage);
  }

}
