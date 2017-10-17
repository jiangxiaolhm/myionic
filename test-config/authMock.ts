import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DataProvider } from '../src/providers/data';
import { User } from '../src/models/user';


export class AuthMock {
    getCurrentUserUid(): string {
        return "1234567890";
    }

    getCurrentUserName(): string {
        return "fake@test.com";
    }
        
    login(user: User): Promise<any> {
        return Promise.resolve()
    };

    register(user: User): Promise<any> {
        return Promise.resolve()
    };

    logout(): Promise<any> {
        return Promise.resolve()
    };
}