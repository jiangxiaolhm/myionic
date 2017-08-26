export interface Room {
    name: string;
    building: string;
    location: string;
    type: string;
    facilities: {
        name: string;
        quantity: number;
    }[];
    capcity: number;
    notes: string;
}