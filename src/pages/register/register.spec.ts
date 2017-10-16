import { RegisterPage } from './register';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { By }              from '@angular/platform-browser';
import { IonicModule, NavController, NavParams, ToastController, LoadingController } from "ionic-angular/index";
import { AuthProvider } from './../../providers/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../../models/user';


describe('Register : RegisterPage', () =>{
    let comp: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;
    let de: DebugElement;
    let registerBTN: DebugElement;
    let name : DebugElement;
    let email : DebugElement;
    let password: DebugElement;
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
                {provide: AuthProvider, useValue: AuthMock},
               
            ]
        });
      }));

    
    describe('register component', () =>{
        beforeEach(() => {
            fixture = TestBed.createComponent(RegisterPage);
            comp = fixture.componentInstance;        
            registerBTN = fixture.debugElement.query(By.css('#regBTN'));
            name = fixture.debugElement.query(By.css('.input1'));
            email = fixture.debugElement.query(By.css('.input2'));
            password =  fixture.debugElement.query(By.css('.input3'))
        });
        
        afterEach(() => {
            fixture.destroy();
            comp = null;
            registerBTN = null;
            name = null;
            email = null;
            password = null;
          });

      
        xit('should create register page component', () => {
            expect(comp instanceof RegisterPage).toBe(true);
        });
      
        it('TestBed register  created', () => {
            expect(fixture).toBeTruthy();
            expect(comp).toBeTruthy();
         });
     
        it('click register it should call register function', () => {
            spyOn(comp, 'register');
            registerBTN.triggerEventHandler('click', null);
            expect(comp.register).toHaveBeenCalled();
        });

    }); 
       
 

});






