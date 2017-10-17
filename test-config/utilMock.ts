import { LoadingController, Loading, ToastController } from 'ionic-angular/index';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';


export class UtilMock {

    transformTimeToDayKeyFormat(timeValue: number): string {
        return "";
    }

    
    toastPresent(message: string) {
        
    }

    loadingPresent(message: string) {
        
    }

    loadingDismiss() {
        
    }


}