import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('orig');
    const destination = searchParams.get('dest');
    const date1 = searchParams.get('date1');
    const date2 = searchParams.get('date2');

    if (!origin || !destination || !date1 || !date2) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('airline-booking');

    const schedules = await db.collection('schedules').find({
        origin,
        destination,
        departureDateTime: {
            $gte: new Date(date1),
            $lte: new Date(date2),
        },
    }).sort({ departureDateTime: 1 }).toArray();

    return NextResponse.json(schedules);
}