export default function Footer() {
    return (
        <footer className="bg-black py-10 px-6 text-center">
            <p className="text-white font-bold text-xl mb-1">✈ DairyFlat Air</p>
            <p className="text-gray-600 text-sm">Dairy Flat Airport (NZNE) · North of Albany · New Zealand</p>
            <div className="flex justify-center gap-6 mt-4 text-gray-600 text-sm">
                <a href="/" className="hover:text-gray-400 transition">Home</a>
                <a href="/search" className="hover:text-gray-400 transition">Search Flights</a>
                <a href="/my-bookings" className="hover:text-gray-400 transition">My Bookings</a>
                <a href="/about" className="hover:text-gray-400 transition">About Us</a>
            </div>
            <p className="text-gray-700 text-xs mt-4">© 2026 DairyFlat Air · Built with 🇲🇲 × 🇳🇿</p>
        </footer>
    );
}