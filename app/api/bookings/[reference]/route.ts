import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function generateReference(): string {
    return 'DF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { scheduleId, passengerName, passengerEmail } = body;

    if (!scheduleId || !passengerName || !passengerEmail) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('airline-booking');

    const schedule = await db.collection('schedules').findOne({ _id: new ObjectId(scheduleId) });

    if (!schedule) {
        return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    if (schedule.bookings.length >= schedule.capacity) {
        return NextResponse.json({ error: 'Flight is full' }, { status: 400 });
    }

    const bookingReference = generateReference();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pushUpdate = { $push: { bookings: { bookingReference, passengerName, passengerEmail, bookedAt: new Date() } } } as any;

    await db.collection('schedules').updateOne(
        { _id: new ObjectId(scheduleId) },
        pushUpdate
    );

    const updatedSchedule = await db.collection('schedules').findOne({ _id: new ObjectId(scheduleId) });

    return NextResponse.json({ bookingReference, schedule: updatedSchedule }, { status: 201 });
}