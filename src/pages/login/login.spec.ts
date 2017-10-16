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

 
describe('Login : LoginPage', () =>{
    let comp: LoginPage;
    let af: AuthProvider;
    let fixture: ComponentFixture<LoginPage>;
    let de: DebugElement;
    let loginBtn: DebugElement;
    let regBtn: DebugElement;
    let usernameField: DebugElement;
    let passwordField: DebugElement;

    class LoginMock{
        login(user:User): Promise<any> {
            return Promise.resolve()
        };
    }

    class AuthMock  {
        login(user: User): Promise<any> {
            return Promise.resolve()
        };

        register(user: User): Promise<any> {
            return Promise.resolve()
        };

        logout(): Promise<any> {
            return Promise.resolve()
        };
    }


    
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
                {provide: NavParams, useValue: NavParams},
                {provide: AuthProvider, useClass: AuthMock},
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
     
        it('click login, it should call login function', () => {
            spyOn(comp, 'login');
            loginBtn.triggerEventHandler('click', null);
            expect(comp.login).toHaveBeenCalled();
        });

    
        it('click register, it should call register function', () => {
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






