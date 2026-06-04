'use client';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelPage({ params }: { params: Promise<{ reference: string }> }) {
    const { reference } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [error, setError] = useState('');

    async function handleCancel() {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/bookings/${reference}`, { method: 'DELETE' });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) return setError(data.error || 'Cancellation failed');
        setCancelled(true);
    }

    if (cancelled) return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <a href="/" className="text-white font-bold text-xl">✈ DairyFlat<span className="text-sky-400">Air</span></a>
                </div>
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                        <span className="text-4xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Booking Cancelled</h2>
                    <p className="text-gray-400 mb-2">Your booking has been successfully cancelled.</p>
                    <div className="inline-block bg-gray-800 rounded-xl px-6 py-3 mb-8">
                        <p className="font-mono font-bold text-sky-400 text-lg">{reference}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => router.push('/search')}
                            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition">
                            Search New Flights
                        </button>
                        <button onClick={() => router.push('/')}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 rounded-xl transition">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );

    return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full">

                {/* Logo */}
                <div className="text-center mb-8">
                    <a href="/" className="text-white font-bold text-xl">✈ DairyFlat<span className="text-sky-400">Air</span></a>
                </div>

                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

                    {/* Red top bar */}
                    <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                            !
                        </div>
                        <p className="text-red-400 font-semibold">Cancellation Request</p>
                    </div>

                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-3">Cancel this booking?</h2>
                        <p className="text-gray-400 mb-2">You are about to cancel booking:</p>
                        <div className="inline-block bg-gray-800 border border-white/10 rounded-xl px-6 py-3 mb-2">
                            <p className="font-mono font-bold text-sky-400 text-xl">{reference}</p>
                        </div>
                        <p className="text-gray-600 text-sm mb-8">This action cannot be undone.</p>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={() => router.back()}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 rounded-xl transition">
                                Keep Booking
                            </button>
                            <button onClick={handleCancel} disabled={loading}
                                className="flex-1 bg-red-500 hover:bg-red-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition">
                                {loading ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}