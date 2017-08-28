export interface Booking {
    $key: string;
    groupName: string;
    roomId: string;
    membersId: string[];
    startTime: Date;
    endTime: Date;
}