import { Period } from './period';

export interface Day {
    startTime: Date;
    endTime: Date;
    periods: Period[];
}