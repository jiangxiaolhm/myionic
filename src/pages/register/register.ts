import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { User } from './../../models/user';
import { AuthProvider } from './../../providers/auth';
import { UtilProvider } from './../../providers/util';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private user = {} as User;

  constructor(
    private authProvider: AuthProvider,
    private utilProvider: UtilProvider,
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
  private register() {
    if (!this.user.name || !this.user.name.trim()) {
      this.utilProvider.toastPresent('The user name must be a valid string');
    } else if (!this.user.email) {
      this.utilProvider.toastPresent('The email address must be a valid string');
    } else if (!this.user.password) {
      this.utilProvider.toastPresent('The password must be a valid string');
    } else {
      this.utilProvider.loadingPresent('Signing in. Please wait...');
      this.authProvider.register(this.user).then((data) => {
        // Register successfully
        this.utilProvider.loadingDismiss();
        this.navCtrl.pop();
        this.utilProvider.toastPresent('Register successfully');
      }, (error) => {
        // Register failed
        this.utilProvider.loadingDismiss();
        this.utilProvider.toastPresent(error.message);
      });
    }
  }
}
