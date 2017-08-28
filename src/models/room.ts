export interface Room {
    id: string;
    name: string;
    building: string;
    location: string;
    type: string;
    facilities: {
        name: string;
        quantity: number;
    }[];
    capacity: number;
    notes: string;
}