import { DatePipe } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Clipboard } from '@ionic-native/clipboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { FIREBASE_CONFIG } from './app.config';
import { HomePageModule } from './../pages/home/home.module';
import { LoginPage } from './../pages/login/login';
import { RegisterPage } from './../pages/register/register';
import { AuthProvider } from './../providers/auth';
import { DataProvider } from './../providers/data';
import { UtilProvider } from './../providers/util';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HomePageModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFireAuth,
    AngularFireDatabase,
    AuthProvider,
    DataProvider,
    UtilProvider,
    DatePipe,
    Clipboard
  ]
})
export class AppModule { }
