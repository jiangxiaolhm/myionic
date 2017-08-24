
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App
  ) { }

  ionViewDidLoad() {
    // Keep checking auth state
    // Redirect to login page when signout
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: `Welcome to Homepage, ${data.email}`,
          duration: 2000
        }).present();
      } else {
        this.toast.create({
          message: `You are sign out already`,
          duration: 2000
        }).present();
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
