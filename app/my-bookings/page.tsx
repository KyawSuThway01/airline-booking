'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyBookingsPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [flights, setFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSearch() {
        if (!email) return alert('Please enter your email');
        setLoading(true);
        setSearched(true);
        const res = await fetch(`/api/passenger?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        setFlights(data);
        setLoading(false);
    }

    function formatDateTime(dt: string) {
        return new Date(dt).toLocaleString('en-NZ', {
            weekday: 'short', day: 'numeric', month: 'short',
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

    const allBookings = flights.flatMap(flight =>
        flight.bookings
            .filter((b: any) => b.passengerEmail === email)
            .map((b: any) => ({ ...b, flight }))
    );

    const upcoming = allBookings.filter(b => new Date(b.flight.departureDateTime) >= new Date());
    const past = allBookings.filter(b => new Date(b.flight.departureDateTime) < new Date());

    return (
        <main className="min-h-screen bg-gray-950 flex flex-col">

            {/* Header */}
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">

                <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
                <p className="text-gray-500 mb-8">Enter your email to view all your upcoming and past flights.</p>

                {/* Search bar */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-10">
                    <div className="flex gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder="your@email.com"
                            className="flex-1 bg-gray-800 border border-white/10 hover:border-sky-500/50 focus:border-sky-500 text-white rounded-xl px-4 py-3 focus:outline-none transition placeholder-gray-600"
                        />
                        <button onClick={handleSearch}
                            className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]">
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* No results */}
                {searched && !loading && allBookings.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📭</p>
                        <p className="text-white text-xl font-semibold mb-2">No bookings found</p>
                        <p className="text-gray-500 mb-6">No flights booked with this email address.</p>
                        <a href="/search" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3 rounded-xl transition inline-block">
                            Search Flights
                        </a>
                    </div>
                )}

                {/* Upcoming flights */}
                {upcoming.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                            Upcoming Flights ({upcoming.length})
                        </h2>
                        <div className="space-y-4">
                            {upcoming.map((booking) => (
                                <BookingCard
                                    key={booking.bookingReference}
                                    booking={booking}
                                    isPast={false}
                                    formatTime={formatTime}
                                    formatDateTime={formatDateTime}
                                    getDuration={getDuration}
                                    router={router}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Past flights */}
                {past.length > 0 && (
                    <div>
                        <h2 className="text-gray-500 font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-600 inline-block"></span>
                            Past Flights ({past.length})
                        </h2>
                        <div className="space-y-4 opacity-60">
                            {past.map((booking) => (
                                <BookingCard
                                    key={booking.bookingReference}
                                    booking={booking}
                                    isPast={true}
                                    formatTime={formatTime}
                                    formatDateTime={formatDateTime}
                                    getDuration={getDuration}
                                    router={router}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}

function BookingCard({ booking, isPast, formatTime, formatDateTime, getDuration, router }: any) {
    const { flight } = booking;
    return (
        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-sky-500/30 transition-all duration-300">

            {/* Top bar */}
            <div className="px-6 py-3 bg-gray-800/50 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-sky-500/20 text-sky-400 text-xs font-bold px-3 py-1 rounded-full">
                        {flight.flightNumber}
                    </span>
                    <span className="font-mono text-gray-400 text-sm">{booking.bookingReference}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isPast ? 'bg-gray-700 text-gray-400' : 'bg-green-500/20 text-green-400'}`}>
                    {isPast ? 'COMPLETED' : 'CONFIRMED'}
                </span>
            </div>

            <div className="p-6">
                {/* Route visual */}
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <p className="text-3xl font-bold text-white">{formatTime(flight.departureDateTime)}</p>
                        <p className="text-sky-400 text-sm font-semibold mt-1">{flight.origin}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <p className="text-gray-600 text-xs mb-2">{getDuration(flight.departureDateTime, flight.arrivalDateTime)}</p>
                        <div className="w-full flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></div>
                            <div className="flex-1 h-px bg-gray-700"></div>
                            <span className="text-gray-500 text-xs">✈</span>
                            <div className="flex-1 h-px bg-gray-700"></div>
                            <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-white">{formatTime(flight.arrivalDateTime)}</p>
                        <p className="text-sky-300 text-sm font-semibold mt-1">{flight.destination}</p>
                    </div>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Date</p>
                        <p className="text-white text-sm font-medium">{formatDateTime(flight.departureDateTime)}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Aircraft</p>
                        <p className="text-white text-sm font-medium">{flight.aircraft}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Price</p>
                        <p className="text-sky-400 text-lg font-bold">${flight.price}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push(`/confirmation/${booking.bookingReference}`)}
                        className="flex-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold py-2.5 rounded-xl transition text-sm">
                        View Invoice
                    </button>
                    {!isPast && (
                        <button
                            onClick={() => router.push(`/cancel/${booking.bookingReference}`)}
                            className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-2.5 rounded-xl transition text-sm">
                            Cancel Booking
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}