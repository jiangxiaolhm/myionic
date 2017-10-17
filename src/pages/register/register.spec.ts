// import { RegisterPage } from './register';
// import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
// import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
// import { By }              from '@angular/platform-browser';
// import { IonicModule, NavController, NavParams, ToastController, LoadingController } from "ionic-angular/index";
// import { AuthProvider } from './../../providers/auth';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { User } from './../../models/user';
// import { AuthMock } from '../../../test-config/authMock';
// import {NavControllerMock, NavParamsMock} from 'ionic-mocks';



// describe('Register : RegisterPage', () =>{
//     let comp: RegisterPage;
//     let af: AuthProvider;
//     let fixture: ComponentFixture<RegisterPage>;
//     let de: DebugElement;
//     let registerBTN: DebugElement;
//     let navCtrl : NavController;
//     let toastCtrl : ToastController;
//     let name : DebugElement;
//     let email : DebugElement;
//     let password: DebugElement;
//     let AuthMock : AuthMock;
    
   
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations:[RegisterPage],
//             imports:[
//                 IonicModule.forRoot(RegisterPage)
//             ],
         
//             providers:[ 
//                 ToastController, 
//                 LoadingController,
//                 {provide: NavParams, useValue: NavParams},
//                 {provide: AuthProvider, useValue: AuthMock},
//                 {provide: NavController, useClass: NavControllerMock},
               
//             ]
//         });

//         navCtrl = NavControllerMock.instance();
//       }));
     
//       let _user : User = {
//         $key: '1XeHDxrlOAP5XRKu8rITXajgU055',
//         name:'fake',
//         email: 'fake@test.com',
//         password: '1234',
//         bookings : {
//             $key: '1XnHDxrlOAP5XRKu8rITXajgU055',
//             groupName: 'group1',
//             roomKey: 'roomKey',
//             startTime: new Date,
//             endTime: new Date
//         }
//     }
    
//     describe('register component', () =>{
//         beforeEach(() => {
//             fixture = TestBed.createComponent(RegisterPage);
//             comp = fixture.componentInstance;        
//             registerBTN = fixture.debugElement.query(By.css('#regBTN'));
//             name = fixture.debugElement.query(By.css('.input1'));
//             email = fixture.debugElement.query(By.css('.input2'));
//             password =  fixture.debugElement.query(By.css('.input3'))
//         });

//         afterEach(() => {
//             fixture.destroy();
//             comp = null;
//             registerBTN = null;
//             name = null;
//             email = null;
//             password = null;
//           });

//         it('should create register page component', () => {
//             expect(comp instanceof RegisterPage).toBe(true);
//         });
      
//         it('TestBed register  created', () => {
//             expect(fixture).toBeTruthy();
//             expect(comp).toBeTruthy();
//          });

//          it('It has property navParams ', () => {
//             expect(comp.navParams).toBeDefined();
//          });

//          it('It has property navCtrl ', () => {
//             expect(comp.navCtrl).toBeDefined();
//          });
     
//         it('click register it should call register function', () => {
//             spyOn(comp, 'register');
//             registerBTN.triggerEventHandler('click', null);
//             expect(comp.register).toHaveBeenCalled();
//         });


//     }); 
       
 

// });






