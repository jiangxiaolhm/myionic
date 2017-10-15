import { RegisterPage } from './register';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { By }              from '@angular/platform-browser';
import { IonicModule, NavController, NavParams, ToastController, LoadingController } from "ionic-angular/index";
import { AuthProvider } from './../../providers/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../../models/user';

//create mock  
describe('Register : RegisterPage', () =>{
    let comp: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;
    let de: DebugElement;
    let registerBTN: DebugElement;
    let authMock = {
        "login": (auth: {
            provider?: AuthProvider;
        }) => {}
    
    };
    
    
   
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[RegisterPage],
            imports:[
                IonicModule.forRoot(RegisterPage)
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

    
    describe('register component', () =>{
        beforeEach(() => {
            fixture = TestBed.createComponent(RegisterPage);
            comp = fixture.componentInstance;        
            registerBTN = fixture.debugElement.query(By.css('#regBTN'));
                    
        });



      
        it('should create register page component', () => {
            expect(comp instanceof RegisterPage).toBe(true);
        });
    
     
        it('click register it should register user ', () => {
            spyOn(comp, 'register');
            registerBTN.triggerEventHandler('click', null);
            expect(comp.register).toHaveBeenCalled();
        });

    


    
    }); 
       
 

});






