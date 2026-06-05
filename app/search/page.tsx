'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AIRPORTS = [
    { code: 'NZNE', name: 'Dairy Flat', country: 'New Zealand' },
    { code: 'YSSY', name: 'Sydney', country: 'Australia' },
    { code: 'NZRO', name: 'Rotorua', country: 'New Zealand' },
    { code: 'NZGB', name: 'Great Barrier Island', country: 'New Zealand' },
    { code: 'NZCI', name: 'Chatham Islands', country: 'New Zealand' },
    { code: 'NZTL', name: 'Lake Tekapo', country: 'New Zealand' },
];

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [origin, setOrigin] = useState(searchParams.get('orig') || 'NZNE');
    const [destination, setDestination] = useState(searchParams.get('dest') || 'YSSY');
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSearch() {
        if (!date1 || !date2) return alert('Please select both dates');
        setLoading(true);
        setSearched(true);
        const res = await fetch(`/api/schedules?orig=${origin}&dest=${destination}&date1=${date1}&date2=${date2}T23:59:59`);
        const data = await res.json();
        setResults(data);
        setLoading(false);
    }

    function formatDate(dt: string) {
        return new Date(dt).toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
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

    const originName = AIRPORTS.find(a => a.code === origin)?.name;
    const destName = AIRPORTS.find(a => a.code === destination)?.name;

    return (
        <main className="min-h-screen bg-gray-950 flex flex-col">

            {/* Header */}
            <Navbar />

            {/* Search Panel */}
            <div className="bg-gray-900 border-b border-white/10 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-6">Search Flights</h1>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* From */}
                        <div className="bg-gray-800 rounded-xl p-4 border border-white/10 hover:border-sky-500/50 transition">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">From</p>
                            <select value={origin} onChange={e => setOrigin(e.target.value)}
                                className="w-full bg-transparent text-white font-semibold text-lg focus:outline-none cursor-pointer">
                                {AIRPORTS.map(a => (
                                    <option key={a.code} value={a.code} className="bg-gray-800">{a.name} ({a.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* Swap button + To */}
                        <div className="relative bg-gray-800 rounded-xl p-4 border border-white/10 hover:border-sky-500/50 transition">
                            <button
                                onClick={() => { setOrigin(destination); setDestination(origin); }}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm z-10 transition hidden md:flex">
                                ⇄
                            </button>
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">To</p>
                            <select value={destination} onChange={e => setDestination(e.target.value)}
                                className="w-full bg-transparent text-white font-semibold text-lg focus:outline-none cursor-pointer">
                                {AIRPORTS.map(a => (
                                    <option key={a.code} value={a.code} className="bg-gray-800">{a.name} ({a.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* Dates */}
                        <div className="bg-gray-800 rounded-xl p-4 border border-white/10 hover:border-sky-500/50 transition">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">From Date</p>
                            <input type="date" value={date1} onChange={e => setDate1(e.target.value)}
                                className="w-full bg-transparent text-white font-semibold text-lg focus:outline-none cursor-pointer" />
                        </div>

                        <div className="bg-gray-800 rounded-xl p-4 border border-white/10 hover:border-sky-500/50 transition">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">To Date</p>
                            <input type="date" value={date2} onChange={e => setDate2(e.target.value)}
                                className="w-full bg-transparent text-white font-semibold text-lg focus:outline-none cursor-pointer" />
                        </div>
                    </div>

                    <button onClick={handleSearch}
                        className="mt-4 bg-sky-500 hover:bg-sky-400 text-white font-bold px-10 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]">
                        {loading ? 'Searching...' : 'Search Flights'}
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">

                {searched && !loading && results.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">✈</p>
                        <p className="text-white text-xl font-semibold mb-2">No flights found</p>
                        <p className="text-gray-500">Try a different date range or route.</p>
                    </div>
                )}

                {searched && !loading && results.length > 0 && (
                    <p className="text-gray-400 text-sm mb-6">
                        {results.length} flight{results.length > 1 ? 's' : ''} found · {originName} → {destName}
                    </p>
                )}

                <div className="space-y-4">
                    {results.map((flight) => {
                        const seatsLeft = flight.capacity - flight.bookings.length;
                        const duration = getDuration(flight.departureDateTime, flight.arrivalDateTime);
                        return (
                            <div key={flight._id}
                                className="bg-gray-900 border border-white/10 rounded-2xl p-6 hover:border-sky-500/40 transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    {/* Left: Date + Flight info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-sky-500/20 text-sky-400 text-xs font-bold px-3 py-1 rounded-full">
                                                {flight.flightNumber}
                                            </span>
                                            <span className="text-gray-500 text-sm">{formatDate(flight.departureDateTime)}</span>
                                            <span className="text-gray-600 text-xs">✈ {flight.aircraft}</span>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-3xl font-bold text-white">{formatTime(flight.departureDateTime)}</p>
                                                <p className="text-gray-400 text-sm mt-1">{flight.origin}</p>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center">
                                                <p className="text-gray-600 text-xs mb-1">{duration}</p>
                                                <div className="w-full flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                                                    <div className="flex-1 h-px bg-gray-700"></div>
                                                    <div className="text-gray-500 text-xs">✈</div>
                                                    <div className="flex-1 h-px bg-gray-700"></div>
                                                    <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-white">{formatTime(flight.arrivalDateTime)}</p>
                                                <p className="text-gray-400 text-sm mt-1">{flight.destination}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Price + Book */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:min-w-[160px]">
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-white">${flight.price}</p>
                                            <p className={`text-sm font-semibold mt-1 ${seatsLeft === 0 ? 'text-red-400' : seatsLeft <= 2 ? 'text-amber-400' : 'text-green-400'}`}>
                                                {seatsLeft === 0 ? 'Fully booked' : `${seatsLeft} seat${seatsLeft > 1 ? 's' : ''} left`}
                                            </p>
                                        </div>
                                        {seatsLeft > 0 && (
                                            <button
                                                onClick={() => router.push(`/book/${flight._id}`)}
                                                className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                                                Book Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense>
            <SearchContent />
        </Suspense>
    );
}