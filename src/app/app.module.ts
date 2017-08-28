
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from './../pages/login/login';
import { RegisterPage } from './../pages/register/register';
import { HomePageModule } from './../pages/home/home.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FIREBASE_CONFIG } from './app.firebase.config';

import { AuthProvider } from './../providers/auth';
import { DataProvider } from './../providers/data';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    
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
    RegisterPage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFireAuth,
    AngularFireDatabase,
    AuthProvider,
    DataProvider
  ]
})
export class AppModule { }
