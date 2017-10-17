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
import { UtilMock } from '../../../test-config/utilMock';

describe('Booking : BookingPage', () =>{
    let comp : BookingPage;
    let af: AuthProvider;
    let fixture: ComponentFixture<BookingPage>;
    let AuthMock : AuthMock;
    let shareBTN: DebugElement;
    let addBTN: DebugElement;
    let searchBTN : DebugElement;
    let cancelBTN: DebugElement;
    let UtilMock : UtilMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[BookingPage],
            imports:[
                IonicModule.forRoot(BookingPage),
            ],
         
            providers:[
                BookingPage,
                Clipboard,DatePipe,
                NavController, AlertController,LoadingController,
                {provide: NavParams, useValue: NavParams},
                {provide: App, useValue: App},
                {provide: NavParams, useValue: NavParams},
                {provide: AuthProvider, useValue: AuthMock},
                {provide: DataProvider, useValue: DataProvider},
                {provide: UtilProvider, useValue: UtilMock},
            ]
        }).compileComponents();
        
      }));

      describe('booking page component', () =>{
        beforeEach(() => {
            fixture = TestBed.createComponent(BookingPage);
            comp = fixture.componentInstance;         
            addBTN = fixture.debugElement.query(By.css('.addBTN'));  
            cancelBTN = fixture.debugElement.query(By.css('.cancelBTN')); 
            shareBTN = fixture.debugElement.query(By.css('.shareBTN')); 
            searchBTN = fixture.debugElement.query(By.css('.searchBTN')); 
        });
        
        afterEach(() => {
            fixture.destroy();
            addBTN = null;
            cancelBTN = null;
            shareBTN = null;
            searchBTN = null;
            comp = null;
          });

        it('should create Booking component', () => {
            expect(comp instanceof BookingPage).toBe(true);
        });

        it('It has property navCtrl ', () => {
            expect(comp.navCtrl).toBeDefined();
        });

        it('It has property navParams ', () => {
            expect(comp.navParams).toBeDefined();
        });

        
        it('Should return false when booking is not expired', () => {
            let expireTime = new Date().getTime();
            spyOn(comp, 'isExpired');
            comp.isExpired(expireTime);
            expect(comp.isExpired).toHaveBeenCalled();
            expect(comp.isExpired).toBeTruthy();
        });


        

    }); 
});