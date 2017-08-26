import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class DataProvider {

    constructor(
        private afDB: AngularFireDatabase
    ) { }

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