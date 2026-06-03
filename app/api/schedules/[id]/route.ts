import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db('airline-booking');

    const schedule = await db.collection('schedules').findOne({
        _id: new ObjectId(id),
    });

    if (!schedule) {
        return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json(schedule);
}