import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { By }              from '@angular/platform-browser';
import { IonicModule, NavController, NavParams, ToastController, LoadingController } from "ionic-angular/index";
import { LoginPage } from './../login/login';
import { AuthProvider } from './../../providers/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../../models/user';
import { Booking } from './../../models/booking';
//create mock  
describe('Login : LoginPage', () =>{
    let comp: LoginPage;
    let fixture: ComponentFixture<LoginPage>;
    let de: DebugElement;
    let loginBtn: DebugElement;
    let regBtn: DebugElement;
    let authMock = {
        "login": (auth: {
            provider?: AuthProvider;
        }) => {}
    
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



      
        it('should create component', () => {
            expect(comp instanceof LoginPage).toBe(true);
        });
    
     
        it('click login button the login function should be called', () => {
            spyOn(comp, 'login');
            loginBtn.triggerEventHandler('click', null);
            expect(comp.login).toHaveBeenCalled();
        });

    

        it('click register button the register function should be called', () => {
            spyOn(comp, 'register');
            regBtn.triggerEventHandler('click', null);
            expect(comp.register).toHaveBeenCalled();
        });
        

    
    }); 
       
 

});






