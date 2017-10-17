import { LoadingController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take'

import { Booking } from './../models/booking';
import { Day } from './../models/day';
import { Room } from './../models/room';
import { User } from './../models/user';


import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataProvider {

    user: User = null;
    rooms: Room[] = [];
    bookings: FirebaseListObservable<Booking[]> = null;
    processing = this.loadingCtrl.create({
        content: 'Processing ...'
    });
    loading = this.loadingCtrl.create({
        content: 'Loading ...'
    });

    constructor(
        private afDB: AngularFireDatabase,
        private authProvider: AngularFireAuth,
        private datePipe: DatePipe,
        private loadingCtrl: LoadingController
    ) { }


    /**
     * Get a user from database.
     * 
     * @param {string} uid 
     * @returns {Promise<User>} 
     * @memberof DataProvider
     */
    getUser(uid: string): Promise<User> {
        return this.object('users/' + uid).map((user: User) => {
            return user;
        }).first().toPromise();
    }

    /**
     * Get a room from database
     * 
     * @param {string} roomKey 
     * @returns {Promise<Room>} 
     * @memberof DataProvider
     */
    getRoom(roomKey: string): Promise<Room> {
        return this.object('rooms/' + roomKey).map((room: Room) => {
            return room;
        }).first().toPromise();
    }
    
    /**
     * Get a room list from database.
     * 
     * @returns {Promise<Room[]>} 
     * @memberof DataProvider
     */
    getRooms(): Promise<Room[]> {
        return this.list('rooms').map((rooms: Room[]) => {
            return rooms;
        }).first().toPromise();
    }

    /**
     * Get a day object of a room from database.
     * 
     * @param {string} roomKey 
     * @param {string} dayKey 
     * @returns {Promise<Day>} 
     * @memberof DataProvider
     */
    getDay(roomKey: string, dayKey: string): Promise<Day> {
        return this.object('rooms/' + roomKey + '/days/' + dayKey).map((day: Day) => {
            return day;
        }).first().toPromise();
    }

    /**
     * Update a day object of a room to database.
     * 
     * @param {string} roomKey 
     * @param {string} dayKey 
     * @param {Day} day 
     * @memberof DataProvider
     */
    setDay(roomKey: string, dayKey: string, day: Day) {
        this.update('rooms/' + roomKey + '/days/' + dayKey, day);
    }

    /**
     * Get a booking object of a user from database.
     * 
     * @param {string} uid 
     * @param {string} bookingKey 
     * @returns {Promise<Booking>} 
     * @memberof DataProvider
     */
    getBooking(uid: string, bookingKey: string): Promise<Booking> {
        return this.object('users/' + uid + '/bookings/' + bookingKey).map((booking: Booking) => {
            return booking;
        }).first().toPromise();
    }

    /**
     * Get a booking list of a user form database.
     * 
     * @param {string} uid 
     * @returns {Promise<Booking[]>} 
     * @memberof DataProvider
     */
    getBookings(uid: string): Promise<Booking[]> {
        return this.list('users/' + uid + '/bookings').map((bookings: Booking[]) => {
            return bookings;
        }).first().toPromise();
    }

    /**
     * Push new data to the list of firedatabase with given path 
     * @param path 
     * @param data 
     */
    push(path: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afDB.list(path).push(data).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * Set and update data to the list of firedatabase with given path and item name
     * @param path 
     * @param item 
     * @param data 
     */
    set(path: string, item: string, data: any) {
        return this.afDB.list(path).set(item, data);
    }

    /**
     * Remove data from the list of firedatabase with given path and item name
     * @param path 
     * @param item 
     */
    remove(path: string, item: string) {
        return this.afDB.list(path).remove(item);
    }

    list(path: string, query: any = {}): FirebaseListObservable<any> {
        return this.afDB.list(path, { query });
    }

    object(path: string): FirebaseObjectObservable<any> {
        return this.afDB.object(path);
    }

    update(path: string, data: any) {
        return this.afDB.object(path).update(data);
    }

}