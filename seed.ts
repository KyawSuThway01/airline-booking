import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://admin:mypass123@cluster0.zhtv6f6.mongodb.net/airline-booking?retryWrites=true&w=majority&appName=Cluster0';

const airports: Record<string, { name: string; timezone: string }> = {
    NZNE: { name: 'Dairy Flat', timezone: 'Pacific/Auckland' },
    YSSY: { name: 'Sydney', timezone: 'Australia/Sydney' },
    NZRO: { name: 'Rotorua', timezone: 'Pacific/Auckland' },
    NZCI: { name: 'Tuuta (Chatham Islands)', timezone: 'Pacific/Chatham' },
    NZGB: { name: 'Claris (Great Barrier Island)', timezone: 'Pacific/Auckland' },
    NZTL: { name: 'Lake Tekapo', timezone: 'Pacific/Auckland' },
};

// All times in NZ local time
const flightTemplates = [
    // Sydney prestige service - SyberJet SJ30i (6 passengers)
    { flightNumber: 'DF101', origin: 'NZNE', destination: 'YSSY', dayOfWeek: 5, departureTime: '10:00', arrivalTime: '14:00', aircraft: 'SyberJet SJ30i', capacity: 6, price: 1200 },
    { flightNumber: 'DF102', origin: 'YSSY', destination: 'NZNE', dayOfWeek: 0, departureTime: '14:00', arrivalTime: '21:00', aircraft: 'SyberJet SJ30i', capacity: 6, price: 1200 },

    // Rotorua shuttle - Cirrus SF50 (4 passengers) - twice daily Mon-Fri
    { flightNumber: 'DF201', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 1, departureTime: '07:00', arrivalTime: '07:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF202', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 1, departureTime: '08:15', arrivalTime: '09:00', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF203', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 1, departureTime: '16:30', arrivalTime: '17:15', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF204', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 1, departureTime: '18:00', arrivalTime: '18:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },

    { flightNumber: 'DF201', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 2, departureTime: '07:00', arrivalTime: '07:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF202', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 2, departureTime: '08:15', arrivalTime: '09:00', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF203', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 2, departureTime: '16:30', arrivalTime: '17:15', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF204', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 2, departureTime: '18:00', arrivalTime: '18:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },

    { flightNumber: 'DF201', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 3, departureTime: '07:00', arrivalTime: '07:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF202', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 3, departureTime: '08:15', arrivalTime: '09:00', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF203', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 3, departureTime: '16:30', arrivalTime: '17:15', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF204', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 3, departureTime: '18:00', arrivalTime: '18:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },

    { flightNumber: 'DF201', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 4, departureTime: '07:00', arrivalTime: '07:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF202', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 4, departureTime: '08:15', arrivalTime: '09:00', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF203', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 4, departureTime: '16:30', arrivalTime: '17:15', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF204', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 4, departureTime: '18:00', arrivalTime: '18:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },

    { flightNumber: 'DF201', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 5, departureTime: '07:00', arrivalTime: '07:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF202', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 5, departureTime: '08:15', arrivalTime: '09:00', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF203', origin: 'NZNE', destination: 'NZRO', dayOfWeek: 5, departureTime: '16:30', arrivalTime: '17:15', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },
    { flightNumber: 'DF204', origin: 'NZRO', destination: 'NZNE', dayOfWeek: 5, departureTime: '18:00', arrivalTime: '18:45', aircraft: 'Cirrus SF50', capacity: 4, price: 180 },

    // Great Barrier Island - Cirrus SF50 (4 passengers) Mon, Wed, Fri outbound / Tue, Thu, Sat inbound
    { flightNumber: 'DF301', origin: 'NZNE', destination: 'NZGB', dayOfWeek: 1, departureTime: '09:00', arrivalTime: '09:30', aircraft: 'Cirrus SF50', capacity: 4, price: 220 },
    { flightNumber: 'DF302', origin: 'NZGB', destination: 'NZNE', dayOfWeek: 2, departureTime: '09:00', arrivalTime: '09:30', aircraft: 'Cirrus SF50', capacity: 4, price: 220 },
    { flightNumber: 'DF301', origin: 'NZNE', destination: 'NZGB', dayOfWeek: 3, departureTime: '09:00', arrivalTime: '09:30', aircraft: 'Cirrus SF50', capacity: 4, price: 220 },
    { flightNumber: 'DF302', origin: 'NZGB', destination: 'NZNE', dayOfWeek: 4, departureTime: '09:00', arrivalTime: '09:30', aircraft: 'Cirrus SF50', capacity: 4, price: 220 },
    { flightNumber: 'DF301', origin: 'NZNE', destination: 'NZGB', dayOfWeek: 5, departureTime: '09:00', arrivalTime: '09:30', aircraft: 'Cirrus SF50', capacity: 4, price: 220 },
    { flightNumber: 'DF302', origin: 'NZGB', destination: 'NZNE', dayOfWeek: 6, departureTime: '09:00', arrivalTime: '09:30', aircraft: 'Cirrus SF50', capacity: 4, price: 220 },

    // Chatham Islands - HondaJet Elite (5 passengers) Tue, Fri outbound / Wed, Sat inbound
    { flightNumber: 'DF401', origin: 'NZNE', destination: 'NZCI', dayOfWeek: 2, departureTime: '08:00', arrivalTime: '10:45', aircraft: 'HondaJet Elite', capacity: 5, price: 650 },
    { flightNumber: 'DF402', origin: 'NZCI', destination: 'NZNE', dayOfWeek: 3, departureTime: '11:00', arrivalTime: '12:45', aircraft: 'HondaJet Elite', capacity: 5, price: 650 },
    { flightNumber: 'DF401', origin: 'NZNE', destination: 'NZCI', dayOfWeek: 5, departureTime: '08:00', arrivalTime: '10:45', aircraft: 'HondaJet Elite', capacity: 5, price: 650 },
    { flightNumber: 'DF402', origin: 'NZCI', destination: 'NZNE', dayOfWeek: 6, departureTime: '11:00', arrivalTime: '12:45', aircraft: 'HondaJet Elite', capacity: 5, price: 650 },

    // Lake Tekapo - HondaJet Elite (5 passengers) Mon outbound / Tue inbound
    { flightNumber: 'DF501', origin: 'NZNE', destination: 'NZTL', dayOfWeek: 1, departureTime: '08:00', arrivalTime: '09:30', aircraft: 'HondaJet Elite', capacity: 5, price: 350 },
    { flightNumber: 'DF502', origin: 'NZTL', destination: 'NZNE', dayOfWeek: 2, departureTime: '08:00', arrivalTime: '09:15', aircraft: 'HondaJet Elite', capacity: 5, price: 350 },
];

function getNextWeekday(startDate: Date, dayOfWeek: number): Date {
    const date = new Date(startDate);
    const diff = (dayOfWeek - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + diff);
    return date;
}

async function seed() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('airline-booking');

    // Clear existing data
    await db.collection('schedules').deleteMany({});
    await db.collection('airports').deleteMany({});

    // Insert airports
    const airportDocs = Object.entries(airports).map(([code, info]) => ({ code, ...info }));
    await db.collection('airports').insertMany(airportDocs);
    console.log('Airports inserted');

    // Generate 8 weeks of scheduled flights
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const schedules = [];

    for (const template of flightTemplates) {
        for (let week = 0; week < 8; week++) {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() + week * 7);

            const flightDate = getNextWeekday(startOfWeek, template.dayOfWeek);

            const [depHour, depMin] = template.departureTime.split(':').map(Number);
            const [arrHour, arrMin] = template.arrivalTime.split(':').map(Number);

            const departureDateTime = new Date(flightDate);
            departureDateTime.setHours(depHour, depMin, 0, 0);

            const arrivalDateTime = new Date(flightDate);
            arrivalDateTime.setHours(arrHour, arrMin, 0, 0);
            // Handle overnight flights
            if (arrivalDateTime < departureDateTime) {
                arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
            }

            schedules.push({
                flightNumber: template.flightNumber,
                origin: template.origin,
                destination: template.destination,
                departureDateTime,
                arrivalDateTime,
                aircraft: template.aircraft,
                capacity: template.capacity,
                price: template.price,
                bookings: [],
            });
        }
    }

    await db.collection('schedules').insertMany(schedules);
    console.log(`Inserted ${schedules.length} scheduled flights`);

    await client.close();
    console.log('Seeding complete!');
}

seed().catch(console.error);