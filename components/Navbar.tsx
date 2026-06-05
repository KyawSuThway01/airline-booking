'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/search', label: 'Search Flights' },
        { href: '/my-bookings', label: 'My Bookings' },
        { href: '/about', label: 'About' },
    ];

    return (
        <div className="bg-gray-900 border-b border-white/10 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-white font-bold text-xl">
                    ✈ DairyFlat<span className="text-sky-400">Air</span>
                </Link>
                <div className="flex items-center gap-6">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition ${pathname === link.href
                                    ? 'text-sky-400 font-semibold'
                                    : 'text-gray-400 hover:text-white'
                                }`}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}