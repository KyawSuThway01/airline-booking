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

        const res = await fetch(`/api/bookings/${reference}`, {
            method: 'DELETE',
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) return setError(data.error || 'Cancellation failed');
        setCancelled(true);
    }

    if (cancelled) return (
        <main className="min-h-screen bg-gradient-to-b from-sky-900 to-sky-600 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-10 shadow-xl text-center max-w-md">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Cancelled</h2>
                <p className="text-gray-500 mb-6">Your booking <span className="font-mono font-bold text-sky-700">{reference}</span> has been cancelled.</p>
                <button onClick={() => router.push('/')}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 py-3 rounded-full transition">
                    Back to Home
                </button>
            </div>
        </main>
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-sky-900 to-sky-600 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-10 shadow-xl text-center max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cancel Booking?</h2>
                <p className="text-gray-500 mb-2">Are you sure you want to cancel booking:</p>
                <p className="font-mono font-bold text-sky-700 text-xl mb-6">{reference}</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex gap-4">
                    <button onClick={() => router.back()}
                        className="flex-1 border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-full hover:bg-gray-50 transition">
                        Keep Booking
                    </button>
                    <button onClick={handleCancel} disabled={loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-full transition">
                        {loading ? 'Cancelling...' : 'Yes, Cancel'}
                    </button>
                </div>
            </div>
        </main>
    );
}