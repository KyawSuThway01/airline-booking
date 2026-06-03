export interface Airport {
    code: string;
    name: string;
    timezone: string;
}

export interface Flight {
    _id?: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string; // "HH:MM"
    arrivalTime: string;   // "HH:MM"
    dayOfWeek: number[];   // 0=Sunday, 1=Monday, etc.
    aircraft: string;
    capacity: number;
    price: number;
}

export interface ScheduledFlight {
    _id?: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureDateTime: Date;
    arrivalDateTime: Date;
    aircraft: string;
    capacity: number;
    price: number;
    bookings: Booking[];
}

export interface Booking {
    bookingReference: string;
    passengerName: string;
    passengerEmail: string;
    bookedAt: Date;
}

export interface Passenger {
    _id?: string;
    name: string;
    email: string;
}