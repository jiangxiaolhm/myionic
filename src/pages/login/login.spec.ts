import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { By }              from '@angular/platform-browser';
import { IonicModule, NavController, NavParams, ToastController, LoadingController } from "ionic-angular/index";
import { LoginPage } from './../login/login';
import { RegisterPage } from './../register/register';
import { AuthProvider } from './../../providers/auth';
import { DataProvider } from './../../providers/data';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../../models/user';
import { Booking } from './../../models/booking';
import { AuthMock } from '../../../test-config/authMock';
import { UtilProvider } from './../../providers/util';
 
describe('Login : LoginPage', () =>{

    let comp : LoginPage;
    let af: AuthProvider;
    let fixture: ComponentFixture<LoginPage>;
    let de: DebugElement;
    let loginBtn: DebugElement;
    let regBtn: DebugElement;
    let usernameField: DebugElement;
    let passwordField: DebugElement;
    let AuthMock : AuthMock;

    //mock user data
    let _user : User = {
        $key: '1XeHDxrlOAP5XRKu8rITXajgU055',
        name:'fake',
        email: 'fake@test.com',
        password: '1234',
        bookings : {
            $key: '1XnHDxrlOAP5XRKu8rITXajgU055',
            groupName: 'group1',
            roomKey: 'roomKey',
            startTime: new Date,
            endTime: new Date
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[LoginPage],
            imports:[
                IonicModule.forRoot(LoginPage),
            ],
         
            providers:[
                NavController, AuthProvider, LoginPage,
                ToastController, 
                LoadingController,
                {provide: UtilProvider, useValue: UtilProvider},
                {provide: NavParams, useValue: NavParams},
                {provide: AuthProvider, useValue: AuthMock},
            ]
        }).compileComponents();
        
      }));

      

    describe('login component', () =>{
        beforeEach(() => {
            fixture = TestBed.createComponent(LoginPage);
            comp = fixture.componentInstance;        
            loginBtn = fixture.debugElement.query(By.css('.marginTop'));
            regBtn = fixture.debugElement.query(By.css('.regBTN'));     
            usernameField = fixture.debugElement.query(By.css('.input1'));
            passwordField = fixture.debugElement.query(By.css('.input2'));
        });
        
        afterEach(() => {
            fixture.destroy();
            comp = null;
            regBtn = null;
            loginBtn = null;
          });

        it('should create login component', () => {
            expect(comp instanceof LoginPage).toBe(true);
        });
    
        it('TestBed login created', () => {
            expect(fixture).toBeTruthy();
            expect(comp).toBeTruthy();
         });
     
         
         it('It has property navCtrl ', () => {
            expect(comp.navCtrl).toBeDefined();
         });

        
         it('It has property navParams ', () => {
            expect(comp.navParams).toBeDefined();
         });

        it('should be able to login', () => {
            spyOn(comp, 'login');
            loginBtn.triggerEventHandler('click', null);
            expect(comp.login).toHaveBeenCalled();
        });


        it('should call register function', () => {
            spyOn(comp, 'register');
            regBtn.triggerEventHandler('click', null);
            expect(comp.register).toHaveBeenCalled();
        });

        it('should launch register page', () => {
            let navCtrl = fixture.debugElement.injector.get(NavController);
            spyOn(navCtrl, 'push');
            regBtn.triggerEventHandler('click', null);
            expect(navCtrl.push).toHaveBeenCalledWith(RegisterPage);
        });
        
    
    }); 
 
 

});






