import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { User } from './../../models/user';
import { HomePage } from './../home/home';
import { RegisterPage } from './../register/register';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /**
   * Asynchronously perform authentication with Firebase
   * @param user 
   */
  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result);
      this.navCtrl.setRoot(HomePage);
    } catch (e) {
      console.error(e);
    }
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

}
