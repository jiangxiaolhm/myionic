import { Booking } from './booking';

export interface User {
    $key: string;
    name: string;
    email: string;
    password: string;
    bookings: Booking;
}