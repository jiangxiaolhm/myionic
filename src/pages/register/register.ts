import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { User } from './../../models/user';

import { AuthProvider } from './../../providers/auth';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private user = {} as User;

  constructor(
    private authProvider: AuthProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  /**
   * Register new user with name, email and password
   * 
   * @param {User} user 
   * @memberof RegisterPage
   */
  register(user: User) {
    const loading = this.loadingCtrl.create({
      content: "Please waiting ..."
    });
    loading.present();

    this.authProvider.register(user).then((data) => {
      loading.dismiss();
      this.navCtrl.popToRoot();
      this.toastCtrl.create({
        message: `You have successfully registed in the system.`,
        duration: 2000
      }).present();
    }, (error) => {
      loading.dismiss();
      this.toastCtrl.create({
        message: `Sorry, your signup is failed`,
        duration: 2000
      }).present();
    });

  }
}
