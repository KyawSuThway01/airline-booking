import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="bg-gray-950 min-h-screen">

            {/* Navbar */}
            <div className="bg-gray-900 border-b border-white/10 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <a href="/" className="text-white font-bold text-xl">✈ DairyFlat<span className="text-sky-400">Air</span></a>
                    <div className="flex items-center gap-6">
                        <a href="/search" className="text-gray-400 hover:text-white text-sm transition">Search Flights</a>
                        <a href="/my-bookings" className="text-gray-400 hover:text-white text-sm transition">My Bookings</a>
                        <a href="/about" className="text-sky-400 text-sm font-semibold">About</a>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/myanmar-hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-950" />
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <p className="text-sky-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">Our Story</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Born in <span className="text-sky-400">Myanmar</span>,<br />
                        Built in <span className="text-green-400">New Zealand</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        A vision shaped by the golden spires of Bagan and the open skies of Auckland.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-sky-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">The Vision</p>
                            <h2 className="text-4xl font-bold text-white mb-6">Where Two Worlds Meet</h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                DairyFlat Air was born from a simple belief — that travel should be personal,
                                luxurious, and accessible. Inspired by the warmth and hospitality of Myanmar culture,
                                we bring that same spirit of genuine care to every flight.
                            </p>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Myanmar, the Land of Golden Pagodas, taught us that beauty lies in the details —
                                in the craftsmanship of ancient temples, in the warmth of its people, and in the
                                serenity of Inle Lake at dawn. We carry these values into everything we do.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                From the rolling green hills of Albany, New Zealand, we operate a fleet of
                                luxury private jets connecting people to the places they love most.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden">
                                <img
                                    src="/myanmar-culture.jpg"
                                    alt="Myanmar Culture"
                                    className="w-3/4 mx-auto h-auto rounded-2xl object-contain"
                                />
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            {/* Myanmar Culture Section */}
            <section className="py-20 px-6 bg-gray-900">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sky-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                        Cultural Inspiration
                    </p>
                    <h2 className="text-4xl font-bold text-white mb-4">The Spirit of Myanmar</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-16">
                        Myanmar's rich culture and traditions inspire our commitment to excellence,
                        hospitality, and the art of meaningful journeys.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Ancient Wisdom',
                                desc: 'Like the timeless pagodas of Bagan, we build our service on foundations of trust, reliability, and enduring quality.',
                                image: '/wisdom.jpg',
                            },
                            {
                                title: 'Warm Hospitality',
                                desc: 'Myanmar is known for the warmth of its people. We bring that same genuine care and personal touch to every passenger.',
                                image: '/hospitality.jpg',
                            },
                            {
                                title: 'Golden Standard',
                                desc: 'Inspired by the golden spires of Shwedagon Pagoda, we hold ourselves to the highest standard of luxury and precision.',
                                image: '/golden.jpg',
                            },
                        ].map((value) => (
                            <div key={value.title}
                                className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer">
                                {/* Background image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${value.image})` }}
                                />
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </section>

            {/* Developer Section */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10">
                        {/* Background */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url('/myanmar-hero.jpg')" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

                        {/* Content */}
                        <div className="relative z-10 p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <p className="text-sky-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">The Developer</p>
                                <h2 className="text-4xl font-bold text-white mb-6">Meet the Builder</h2>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    This application was designed and built by a Myanmar student studying
                                    Advanced Web Development at Massey University, New Zealand.
                                    Combining a passion for technology with the cultural richness of Myanmar,
                                    this project represents a journey of learning, creativity, and ambition.
                                </p>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">🇲🇲</span>
                                    <div className="flex-1 h-px bg-white/20"></div>
                                    <span className="text-gray-400 text-sm">×</span>
                                    <div className="flex-1 h-px bg-white/20"></div>
                                    <span className="text-3xl">🇳🇿</span>
                                </div>
                                <p className="text-gray-400 text-sm italic border-l-2 border-sky-500 pl-4">
                                    "Travel is the bridge between cultures — and code is the bridge between ideas and reality."
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'University', value: 'Massey University, NZ' },
                                    { label: 'Course', value: 'Advanced Web Development' },
                                    { label: 'Tech Stack', value: 'Next.js · MongoDB · Tailwind' },
                                    { label: 'Origin', value: 'Myanmar 🇲🇲' },
                                ].map(item => (
                                    <div key={item.label} className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">{item.label}</span>
                                        <span className="text-white font-semibold text-sm">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 bg-sky-600 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience DairyFlat Air?</h2>
                <p className="text-sky-100 mb-8">Search our routes and book your luxury private jet experience today.</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/search"
                        className="bg-white text-sky-700 font-bold px-8 py-3 rounded-full hover:bg-sky-50 transition">
                        Search Flights
                    </Link>
                    <Link href="/"
                        className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition">
                        Back to Home
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-10 px-6 text-center">
                <p className="text-white font-bold text-xl mb-1">✈ DairyFlat Air</p>
                <p className="text-gray-600 text-sm">Dairy Flat Airport (NZNE) · North of Albany · New Zealand</p>
                <div className="flex justify-center gap-6 mt-4 text-gray-600 text-sm">
                    <a href="/" className="hover:text-gray-400 transition">Home</a>
                    <a href="/search" className="hover:text-gray-400 transition">Search Flights</a>
                    <a href="/my-bookings" className="hover:text-gray-400 transition">My Bookings</a>
                    <a href="/about" className="hover:text-gray-400 transition">About</a>
                </div>
                <p className="text-gray-700 text-xs mt-4">© 2026 DairyFlat Air · Built with 🇲🇲 × 🇳🇿</p>
            </footer>

        </main>
    );
}