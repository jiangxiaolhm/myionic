import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { By }              from '@angular/platform-browser';
import { IonicModule, NavController, NavParams, ToastController, LoadingController } from "ionic-angular/index";
import { LoginPage } from './../login/login';
import { AuthProvider } from './../../providers/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../../models/user';
import { Booking } from './../../models/booking';

 
describe('Login : LoginPage', () =>{

    
    let comp: LoginPage;
    let fixture: ComponentFixture<LoginPage>;
    let de: DebugElement;
    let loginBtn: DebugElement;
    let regBtn: DebugElement;
    let usernameField : DebugElement;
    let passwordField : DebugElement;

    class LoginMock  {
       
        login(user:User): Promise<any> {
            let auth = new AuthMock();
            auth.login(user);
            return  Promise.resolve()
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
    
    // let af:AuthMock;
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
                AuthMock,
                NavController, 
                ToastController, 
                LoadingController,
                {provide: NavParams, useValue: NavParams},
                {provide: AuthProvider, useClass: AuthMock},
            ]
        });
       
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
        

        xit('should create login component', () => {
            expect(comp instanceof LoginPage).toBe(true);
        });
    
     
        xit('click login, it should call login method', () => {
            spyOn(comp, 'login');
            loginBtn.triggerEventHandler('click', null);
            expect(comp.login).toHaveBeenCalled();
           
        });

        it('It should call login service', ()=> {
            let user : User;        
            spyOn(AuthMock.prototype, 'login');
            comp.login(user);
            expect(AuthMock.prototype.login).toHaveBeenCalled();
          });
        

        xit('Entering email and password  loggedIn event', () => {
            // usernameField.nativeElement.value = "fake@test.com"; 
            // passwordField.nativeElement.value = "1234";
            comp.login(_user);
            expect(_user.email).toBe("fake@test.com");
            expect(_user.password).toBe("1234");
          });

        
        xit('click register, it should redirect to register page', () => {
            spyOn(comp, 'register');
            regBtn.triggerEventHandler('click', null);
            expect(comp.register).toHaveBeenCalled();
        });
        

    
    }); 
 
 

});






