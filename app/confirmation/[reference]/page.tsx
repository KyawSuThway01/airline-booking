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

    function formatTime(dt: string) {
        return new Date(dt).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' });
    }

    function getDuration(dep: string, arr: string) {
        const diff = new Date(arr).getTime() - new Date(dep).getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return `${h}h ${m}m`;
    }

    if (loading) return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl mb-4 animate-pulse">✈</div>
                <p className="text-gray-400">Loading your confirmation...</p>
            </div>
        </main>
    );

    const myBooking = booking?.bookings?.find(
        (b: any) => b.bookingReference === reference
    );

    return (
        <main className="min-h-screen bg-gray-950">

            {/* Header */}
            <div className="bg-gray-900 border-b border-white/10 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <a href="/" className="text-white font-bold text-xl">✈ DairyFlat<span className="text-sky-400">Air</span></a>
                    <a href="/my-bookings" className="text-gray-400 hover:text-white text-sm transition">My Bookings</a>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12">

                {/* Success banner */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                        <span className="text-4xl">✓</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">Booking Confirmed!</h1>
                    <p className="text-gray-400 mb-4">Your booking reference number is</p>
                    <div className="inline-block bg-gray-900 border border-sky-500/30 rounded-2xl px-8 py-4">
                        <p className="text-3xl font-mono font-bold text-sky-400 tracking-wider">{reference}</p>
                    </div>
                </div>

                {/* Flight card */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden mb-6">

                    {/* Card header */}
                    <div className="bg-sky-500/10 border-b border-sky-500/20 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {booking?.flightNumber}
                            </span>
                            <span className="text-gray-400 text-sm">✈ {booking?.aircraft}</span>
                        </div>
                        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                            CONFIRMED
                        </span>
                    </div>

                    {/* Route visual */}
                    <div className="px-6 py-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div>
                                <p className="text-5xl font-bold text-white">{formatTime(booking?.departureDateTime)}</p>
                                <p className="text-sky-400 font-semibold text-lg mt-2">{booking?.origin}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-gray-500 text-sm mb-2">
                                    {getDuration(booking?.departureDateTime, booking?.arrivalDateTime)}
                                </p>
                                <div className="w-full flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-sky-500 shrink-0"></div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-sky-500 to-sky-400"></div>
                                    <span className="text-sky-400">✈</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-sky-400 to-sky-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-sky-300 shrink-0"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-bold text-white">{formatTime(booking?.arrivalDateTime)}</p>
                                <p className="text-sky-300 font-semibold text-lg mt-2">{booking?.destination}</p>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Passenger</p>
                                <p className="text-white font-semibold">{myBooking?.passengerName}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</p>
                                <p className="text-white font-semibold truncate">{myBooking?.passengerEmail}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Booked On</p>
                                <p className="text-white font-semibold text-sm">{new Date(myBooking?.bookedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4 col-span-2">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Departure</p>
                                <p className="text-white font-semibold">{formatDateTime(booking?.departureDateTime)}</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Arrival</p>
                                <p className="text-white font-semibold text-sm">{formatDateTime(booking?.arrivalDateTime)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price footer */}
                    <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
                        <p className="text-gray-400 font-medium">Total Paid</p>
                        <p className="text-sky-400 font-bold text-3xl">${booking?.price}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => router.push(`/cancel/${reference}`)}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-3 rounded-xl transition text-sm">
                        Cancel Booking
                    </button>
                    <button
                        onClick={() => router.push('/search')}
                        className="flex-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold py-3 rounded-xl transition text-sm">
                        Book Another Flight
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 rounded-xl transition text-sm">
                        Back to Home
                    </button>
                </div>
            </div>
        </main>
    );
}