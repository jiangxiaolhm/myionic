export interface Booking {
    id: string;
    groupName: string;
    roomId: string;
    membersId: string[];
    startTime: Date;
    endTime: Date;
}