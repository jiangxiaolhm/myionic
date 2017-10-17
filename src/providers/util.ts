import { LoadingController } from 'ionic-angular/index';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class UtilProvider {

    constructor(
        private datePipe: DatePipe,
        private loadingCtrl: LoadingController
    ) { }

    /**
     * Get day key of room using a time value.
     * 
     * @param {number} timeValue 
     * @returns {string} 
     * @memberof UtilProvider
     */
    getTimeToDayKeyFormat(timeValue: number): string {
        return this.datePipe.transform(timeValue, "dd_MM_yyyy");
    }

}