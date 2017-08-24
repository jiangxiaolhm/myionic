import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { User } from './../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  /**
   * Asynchronously signup new user into Firebase
   * @param user
   */
  async register(user: User) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      console.log(result);
      this.navCtrl.popToRoot();
      this.toast.create({
        message: `You have successfully registed in the system.`,
        duration: 2000
      }).present();
    } catch (e) {
      console.error(e);
      this.toast.create({
        message: `Sorry, your signup is failed`,
        duration: 2000
      }).present();
    }
  }

}
