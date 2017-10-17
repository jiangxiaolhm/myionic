export interface Booking {
    $key: string;
    ownerId: string;
    groupName: string;
    roomKey: string;
    location: string;
    startTime: number;
    endTime: number;
}