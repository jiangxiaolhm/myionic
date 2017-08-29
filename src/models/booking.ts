export interface Booking {
    $key: string;
    groupName: string;
    roomKey: string;
    membersKey: string[];
    startTime: Date;
    endTime: Date;
}