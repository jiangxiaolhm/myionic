import { UtilProvider } from './../../providers/util';
import { Period } from './../../models/period';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Clipboard } from '@ionic-native/clipboard';
import { Booking } from './../../models/booking';
import { Day } from './../../models/day';
import { Room } from './../../models/room';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { MyApp } from './../../app/app.component';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { IonicModule, IonicPage, NavController, NavParams, App, ToastController,LoadingController, AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/subscription';

import { BookingPage } from './../booking/booking';
import { LoginPage } from './../login/login';
import { RoomPage } from './../room/room';
import { HomePage } from './../home/home';

import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';
import { AuthMock } from '../../../test-config/authMock';
import { User } from './../../models/user';


describe('Booking : BookingPage', () =>{
    let comp : BookingPage;
    let af: AuthProvider;
    let fixture: ComponentFixture<BookingPage>;
    let AuthMock : AuthMock;
    let de: DebugElement;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[BookingPage],
            imports:[
                IonicModule.forRoot(BookingPage),
            ],
         
            providers:[
                BookingPage,
                UtilProvider, Clipboard,DatePipe,
                NavController, AlertController,LoadingController,
                {provide: NavParams, useValue: NavParams},
                {provide: App, useValue: App},
                {provide: NavParams, useValue: NavParams},
                {provide: AuthProvider, useValue: AuthMock},
                {provide: DataProvider, useValue: DataProvider},
            ]
        }).compileComponents();
        
      }));

      describe('home page component', () =>{
        beforeEach(() => {
            fixture = TestBed.createComponent(BookingPage);
            comp = fixture.componentInstance;        
 
        });
        
        afterEach(() => {
            fixture.destroy();
            comp = null;
          });

          it('should create Booking component', () => {
            expect(comp instanceof BookingPage).toBe(true);
        });

    }); 
});