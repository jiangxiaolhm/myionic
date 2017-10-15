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

    class authMock {
        login(user: User):  Promise<void>  {
            return Promise.resolve()
        }
    };
  
    
   
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[LoginPage],
            imports:[
                IonicModule.forRoot(LoginPage)
            ],
         
            providers:[
                NavController, 
                ToastController, 
                LoadingController,
                {provide: NavParams, useValue: NavParams},
                {provide: AuthProvider, useValue: authMock},
               
            ]
        });
       
      }));

    
    describe('login component', () =>{
        beforeEach(() => {
            fixture = TestBed.createComponent(LoginPage);
            comp = fixture.componentInstance;        
            loginBtn = fixture.debugElement.query(By.css('.marginTop'));
            regBtn = fixture.debugElement.query(By.css('.regBTN'));     
            
        });
        
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
      
        it('should create login component', () => {
            expect(comp instanceof LoginPage).toBe(true);
        });
    
     
        it('click login, it should call login method', () => {
            spyOn(comp, 'login');
            loginBtn.triggerEventHandler('click', null);
            expect(comp.login).toHaveBeenCalled();
           
        });


        it('click register, it should redirect to register page', () => {
            spyOn(comp, 'register');
            regBtn.triggerEventHandler('click', null);
            expect(comp.register).toHaveBeenCalled();
        });
        

    
    }); 
       
 

});






