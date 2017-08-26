import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DataProvider } from './data';
import { User } from './../models/user';

@Injectable()
export class AuthProvider {

    constructor(
        public afAuth: AngularFireAuth,
        private dataProvider: DataProvider
    ) { }

    /**
     * 
     * @param user 
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
     * 
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
     * 
     * @param user 
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
                        password: user.password
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