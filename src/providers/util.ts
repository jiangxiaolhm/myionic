import { LoadingController, Loading, ToastController } from 'ionic-angular/index';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class UtilProvider {

    private loading: Loading;

    constructor(
        private datePipe: DatePipe,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController
    ) { }

    /**
     * Get day key of room using a time value.
     * 
     * @param {number} timeValue 
     * @returns {string} 
     * @memberof UtilProvider
     */
    transformTimeToDayKeyFormat(timeValue: number): string {
        return this.datePipe.transform(timeValue, "dd_MM_yyyy");
    }

    /**
     * Present a standard toast with message.
     * 
     * @param {string} message 
     * @memberof UtilProvider
     */
    toastPresent(message: string) {
        this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        }).present();
    }

    loadingPresent(message: string) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.present();
    }

    loadingDismiss() {
        this.loading.dismiss();
    }
}