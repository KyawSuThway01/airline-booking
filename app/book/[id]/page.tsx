'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [flight, setFlight] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/schedules/${id}`)
            .then(res => res.json())
            .then(data => setFlight(data));
    }, [id]);

    async function handleBooking() {
        if (!name || !email) return setError('Please fill in all fields');
        setLoading(true);
        setError('');
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduleId: id, passengerName: name, passengerEmail: email }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) return setError(data.error || 'Booking failed');
        router.push(`/confirmation/${data.bookingReference}`);
    }

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

    if (!flight) return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl mb-4 animate-pulse">✈</div>
                <p className="text-gray-400">Loading flight details...</p>
            </div>
        </main>
    );

    const seatsLeft = flight.capacity - flight.bookings.length;
    const duration = getDuration(flight.departureDateTime, flight.arrivalDateTime);

    return (
        <main className="min-h-screen bg-gray-950">

            {/* Header */}
            <div className="bg-gray-900 border-b border-white/10 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <a href="/" className="text-white font-bold text-xl">✈ DairyFlat<span className="text-sky-400">Air</span></a>
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm transition">
                        ← Back to Results
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Left: Flight Summary */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Flight card */}
                        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                            <div className="bg-sky-500/10 border-b border-sky-500/20 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {flight.flightNumber}
                                    </span>
                                    <span className="text-gray-400 text-sm">✈ {flight.aircraft}</span>
                                </div>
                                <span className={`text-sm font-semibold ${seatsLeft <= 2 ? 'text-amber-400' : 'text-green-400'}`}>
                                    {seatsLeft} seat{seatsLeft > 1 ? 's' : ''} remaining
                                </span>
                            </div>

                            <div className="p-6">
                                {/* Route visual */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div>
                                        <p className="text-4xl font-bold text-white">{formatTime(flight.departureDateTime)}</p>
                                        <p className="text-sky-400 font-semibold mt-1">{flight.origin}</p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <p className="text-gray-500 text-xs mb-2">{duration}</p>
                                        <div className="w-full flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></div>
                                            <div className="flex-1 h-px bg-gradient-to-r from-sky-500 to-sky-400"></div>
                                            <span className="text-sky-400 text-sm">✈</span>
                                            <div className="flex-1 h-px bg-gradient-to-r from-sky-400 to-sky-300"></div>
                                            <div className="w-2 h-2 rounded-full bg-sky-300 shrink-0"></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-bold text-white">{formatTime(flight.arrivalDateTime)}</p>
                                        <p className="text-sky-300 font-semibold mt-1">{flight.destination}</p>
                                    </div>
                                </div>

                                {/* Details grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-800/50 rounded-xl p-4">
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Departure</p>
                                        <p className="text-white text-sm font-medium">{formatDateTime(flight.departureDateTime)}</p>
                                    </div>
                                    <div className="bg-gray-800/50 rounded-xl p-4">
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Arrival</p>
                                        <p className="text-white text-sm font-medium">{formatDateTime(flight.arrivalDateTime)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price summary */}
                        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4">Price Summary</h3>
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-gray-400">Base fare × 1 passenger</span>
                                <span className="text-white font-medium">${flight.price}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-white font-bold text-lg">Total</span>
                                <span className="text-sky-400 font-bold text-3xl">${flight.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Passenger Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sticky top-6">
                            <h2 className="text-white font-bold text-xl mb-6">Passenger Details</h2>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="John Smith"
                                        className="w-full bg-gray-800 border border-white/10 hover:border-sky-500/50 focus:border-sky-500 text-white rounded-xl px-4 py-3 focus:outline-none transition placeholder-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full bg-gray-800 border border-white/10 hover:border-sky-500/50 focus:border-sky-500 text-white rounded-xl px-4 py-3 focus:outline-none transition placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={loading}
                                className="w-full mt-6 bg-sky-500 hover:bg-sky-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] text-lg">
                                {loading ? 'Processing...' : `Confirm Booking · $${flight.price}`}
                            </button>

                            <p className="text-gray-600 text-xs text-center mt-4">
                                No payment required for this demo
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}