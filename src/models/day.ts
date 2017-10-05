import { Period } from './period';

export interface Day {
    $key: string;
    startTime: number;
    endTime: number;
    periods: Period[];
}