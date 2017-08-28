import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from './../../providers/data';


@Component({
  selector: 'page-room-details',
  templateUrl: 'room-details.html',
})

export class RoomDetailsPage {
  times : any[] = [];
  
  constructor(
      public dataProvider: DataProvider,
      public navCtrl: NavController, 
      public navParams: NavParams) {
      
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomDetailsPage');
  }


  timeList(){
    let time:string = "";
     for(var i = 5; i < 24; i++){
       for(var j = 0; j <= 45; j += 15 ){
           time+= i + " : " + j;
           if(j == 0){ time+="0";}
           this.times.push(time);
           time = "";
         }
     }
     return this.times;
  }
   a = this.timeList();

  // generate list of time 15 minutes each and return as array
 
    
  }
 
  // timeList(){
  //    let list = new Array(100);
  //    let time: string = "";
  //    for(var i = 5; i < 24; i++){
  //      for(var j = 0; j <=45; j += 15 ){
  //          time+= i + " : " + j;
  //          if(j === 0){ time+="0";}
  //          this.times.push(time);
  //        }
  //    }
  //    return this.times;
  // }


