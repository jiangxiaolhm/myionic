import { Injectable } from '@angular/core';
import { LoadingController, Loading, ToastController } from 'ionic-angular/index';

@Injectable()
export class UtilProvider {

    private loading: Loading;

    constructor(
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController
    ) { }

    /**
     * Present a standard toast with message.
     * 
     * @param {string} message 
     * @memberof UtilProvider
     */
    public toastPresent(message: string) {
        this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        }).present();
    }

    /**
     * Present a standard loading with message.
     * 
     * @param {string} message 
     * @memberof UtilProvider
     */
    public loadingPresent(message: string) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.present();
    }
    
    /**
     * Dismiss previous loading.
     * 
     * @memberof UtilProvider
     */
    public loadingDismiss() {
        this.loading.dismiss();
    }

    /**
     * Offset the date created using local time as UTC time
     * 
     * @param {Date} date 
     * @returns {Date} 
     * @memberof UtilProvider
     */
    public localTimeToUTCTime(date: Date): Date {
        date.setHours(date.getHours()-11);
        return date;
    }
}