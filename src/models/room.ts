import { Day } from './day';
import { Facility } from './facility';

export interface Room {
    $key: string;
    name: string;
    building: string;
    location: string;
    type: string;
    facilities: Facility[];
    capacity: number;
    notes: string;
    days: Day[];
}