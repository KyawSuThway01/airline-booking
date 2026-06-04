import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import clientPromise from '@/lib/mongodb';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
    const { message } = await request.json();

    const client = await clientPromise;
    const db = client.db('airline-booking');

    // Fetch airports and sample schedules from DB
    const airports = await db.collection('airports').find({}).toArray();
    const schedules = await db.collection('schedules').find({
        departureDateTime: { $gte: new Date() }
    }).sort({ departureDateTime: 1 }).limit(50).toArray();

    const airportInfo = airports.map(a => `${a.code}: ${a.name} (${a.timezone})`).join('\n');
    const flightInfo = schedules.map(s =>
        `Flight ${s.flightNumber} | ${s.origin} → ${s.destination} | Departs: ${new Date(s.departureDateTime).toLocaleString('en-NZ')} | Arrives: ${new Date(s.arrivalDateTime).toLocaleString('en-NZ')} | Aircraft: ${s.aircraft} | Seats available: ${s.capacity - s.bookings.length} | Price: $${s.price}`
    ).join('\n');

    const systemPrompt = `You are a helpful flight assistant for DairyFlat Air, a premium private jet airline operating out of Dairy Flat Airport (NZNE) in New Zealand.

Here are our airports:
${airportInfo}

Here are our upcoming scheduled flights:
${flightInfo}

Help users find flights, answer questions about routes, prices, aircraft, and booking. Be friendly, concise, and professional. If asked about booking, direct them to use the Search Flights feature on the website. Only answer questions related to DairyFlat Air flights and travel.`;

    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
        ],
        max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    return NextResponse.json({ reply });
}