import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../models/user';
import { DataProvider } from './data';

@Injectable()
export class AuthProvider {

    constructor(
        public afAuth: AngularFireAuth,
        private dataProvider: DataProvider
    ) { }

    /**
     * Get current user's uid.
     * 
     * @returns {string}
     * @memberof AuthProvider
     */
    getCurrentUserUid(): string {
        return this.afAuth.auth.currentUser.uid;
    }

    /**
     * Get current user's diaplay name
     * 
     * @returns {string} 
     * @memberof AuthProvider
     */
    getCurrentUserName(): string {
        return this.afAuth.auth.currentUser.displayName;
    }

    /**
     * Login user with emal and password
     * 
     * @param {User} user 
     * @returns {Promise<any>} 
     * @memberof AuthProvider
     */
    login(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * Logout
     * 
     * @returns {Promise<any>} 
     * @memberof AuthProvider
     */
    logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.signOut().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * Register new user with email and password.
     * 
     * @param {User} user 
     * @returns {Promise<any>} 
     * @memberof AuthProvider
     */
    register(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((data) => {
                this.afAuth.auth.currentUser.updateProfile({
                    displayName: user.name,
                    photoURL: ""
                }).then((data) => {
                    this.dataProvider.set("users", this.afAuth.auth.currentUser.uid, {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        bookingsKey: false
                    }).then(() => {
                        resolve("success");
                    }, (error) => {
                        reject(error);
                    });
                }, (error) => {
                    reject(error);
                });
            }, (error) => {
                reject(error);
            });
        });
    }
}