import { User } from './user';
import { Room } from './room';

export interface Booking {
    groupname: string;
    room: Room;
    members: User[];
    starttime: Date;
    endtime; Date;
}