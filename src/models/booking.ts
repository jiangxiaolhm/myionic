export interface Booking {
    $key: string;
    ownerId: string;
    groupName: string;
    roomKey: string;
    startTime: number;
    endTime: number;
}