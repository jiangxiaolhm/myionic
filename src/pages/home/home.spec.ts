import { MyApp } from './../../app/app.component';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { IonicModule, IonicPage, NavController, NavParams, App, ToastController,LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs/subscription';
import { BookingPage } from './../booking/booking';
import { LoginPage } from './../login/login';
import { RoomPage } from './../room/room';
import { HomePage } from './../home/home';

import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';
import { AuthMock } from '../../../test-config/authMock';
import { User } from './../../models/user';
import { UtilProvider } from './../../providers/util';
import { UtilMock } from '../../../test-config/utilMock';

describe('Home : HomePage', () =>{
    let comp : HomePage;
    let af: AuthProvider;
    let fixture: ComponentFixture<HomePage>;
    let AuthMock : AuthMock;
    let de: DebugElement;
    let logoutBTN: DebugElement;
    let viewBookingBTN : DebugElement;
    let viewRoomBTN:DebugElement;
    let UtilMock : UtilMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[HomePage],
            imports:[
                IonicModule.forRoot(HomePage),
            ],
         
            providers:[
                NavController, AuthProvider, HomePage,
                ToastController, 
                ToastController, 
                LoadingController,
                {provide: NavParams, useValue: NavParams},
                {provide: App, useValue: App},
                {provide: NavParams, useValue: NavParams},
                {provide: AuthProvider, useValue: AuthMock},
                {provide: DataProvider, useValue: DataProvider},
                {provide: UtilProvider, useValue: UtilMock},
            ]
        }).compileComponents();
        
      }));
 
      describe('home page component', () =>{
        beforeEach(() => {
            fixture = TestBed.createComponent(HomePage);
            comp = fixture.componentInstance;        
            logoutBTN = fixture.debugElement.query(By.css('.logoutBTN'));  
            viewBookingBTN = fixture.debugElement.query(By.css('.viewBooking')); 
            viewRoomBTN = fixture.debugElement.query(By.css('.viewRoom')); 
        });
        
        afterEach(() => {
            fixture.destroy();
            comp = null;
          });

         it('should create home component', () => {
            expect(comp instanceof HomePage).toBe(true);
        });
    
        it('TestBed home created', () => {
            expect(fixture).toBeTruthy();
            expect(comp).toBeTruthy();
         });

         it('It has property navCtrl ', () => {
            expect(comp.navCtrl).toBeDefined();
        });

        it('It has property NavParams ', () => {
            expect(comp.app).toBeDefined();
        });

        it('click logout it should call logout function', () => {
            spyOn(comp, 'logout');
            logoutBTN.triggerEventHandler('click', null);
            expect(comp.logout).toHaveBeenCalled();
        });

        it('click viewRoomPage, it should launch room page', () => {
            let navCtrl = fixture.debugElement.injector.get(NavController);
            spyOn(navCtrl, 'push');
            viewRoomBTN.triggerEventHandler('click', null);
            expect(navCtrl.push).toHaveBeenCalledWith(RoomPage);
         });

         it('click viewBooking, it should launch booking page', () => {
            let navCtrl = fixture.debugElement.injector.get(NavController);
            spyOn(navCtrl, 'push');
            viewBookingBTN.triggerEventHandler('click', null);
            expect(navCtrl.push).toHaveBeenCalledWith(BookingPage);
         });

    }); 
});