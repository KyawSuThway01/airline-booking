import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ reference: string }> }
) {
    const { reference } = await params;

    const client = await clientPromise;
    const db = client.db('airline-booking');

    const schedules = await db.collection('schedules').find({
        'bookings.bookingReference': reference,
    }).toArray();

    if (schedules.length === 0) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(schedules);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ reference: string }> }
) {
    const { reference } = await params;

    const client = await clientPromise;
    const db = client.db('airline-booking');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = { $pull: { bookings: { bookingReference: reference } } } as any;

    const result = await db.collection('schedules').updateOne(
        { 'bookings.bookingReference': reference },
        update
    );

    if (result.modifiedCount === 0) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking cancelled successfully' });
}