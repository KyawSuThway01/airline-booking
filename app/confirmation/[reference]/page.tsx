'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
    const { reference } = use(params);
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/bookings/${reference}`)
            .then(res => res.json())
            .then(data => {
                setBooking(data[0]);
                setLoading(false);
            });
    }, [reference]);

    function formatDateTime(dt: string) {
        return new Date(dt).toLocaleString('en-NZ', {
            weekday: 'long', day: 'numeric', month: 'long',
            year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    if (loading) return (
        <main className="min-h-screen bg-gradient-to-b from-sky-900 to-sky-600 flex items-center justify-center">
            <p className="text-white text-xl">Loading confirmation...</p>
        </main>
    );

    const myBooking = booking?.bookings?.find(
        (b: any) => b.bookingReference === reference
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-sky-900 to-sky-600 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="text-7xl mb-4">🎉</div>
                    <h1 className="text-4xl font-bold text-white">Booking Confirmed!</h1>
                    <p className="text-sky-200 mt-2">Your booking reference is:</p>
                    <p className="text-4xl font-mono font-bold text-yellow-300 mt-2">{reference}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                    <h2 className="text-2xl font-bold text-sky-800 mb-6 border-b pb-3">✈ Flight Invoice</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div><p className="text-gray-400 text-xs">PASSENGER</p><p className="font-bold text-gray-800">{myBooking?.passengerName}</p></div>
                        <div><p className="text-gray-400 text-xs">EMAIL</p><p className="font-bold text-gray-800">{myBooking?.passengerEmail}</p></div>
                        <div><p className="text-gray-400 text-xs">FLIGHT NUMBER</p><p className="font-bold text-gray-800">{booking?.flightNumber}</p></div>
                        <div><p className="text-gray-400 text-xs">AIRCRAFT</p><p className="font-bold text-gray-800">{booking?.aircraft}</p></div>
                        <div><p className="text-gray-400 text-xs">FROM</p><p className="font-bold text-gray-800">{booking?.origin}</p></div>
                        <div><p className="text-gray-400 text-xs">TO</p><p className="font-bold text-gray-800">{booking?.destination}</p></div>
                        <div className="col-span-2"><p className="text-gray-400 text-xs">DEPARTURE</p><p className="font-bold text-gray-800">{formatDateTime(booking?.departureDateTime)}</p></div>
                        <div className="col-span-2"><p className="text-gray-400 text-xs">ARRIVAL</p><p className="font-bold text-gray-800">{formatDateTime(booking?.arrivalDateTime)}</p></div>
                        <div><p className="text-gray-400 text-xs">BOOKED ON</p><p className="font-bold text-gray-800">{formatDateTime(myBooking?.bookedAt)}</p></div>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center">
                        <p className="text-gray-600 font-semibold">Total Price</p>
                        <p className="text-3xl font-bold text-sky-700">${booking?.price}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => router.push(`/cancel/${reference}`)}
                        className="flex-1 border-2 border-white text-white font-bold py-3 rounded-full hover:bg-white/10 transition text-center">
                        Cancel Booking
                    </button>
                    <button onClick={() => router.push('/')}
                        className="flex-1 bg-white text-sky-900 font-bold py-3 rounded-full hover:bg-sky-100 transition text-center">
                        Back to Home
                    </button>
                </div>
            </div>
        </main>
    );
}