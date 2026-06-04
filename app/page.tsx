'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RouteMap = dynamic(() => import('@/components/RouteMap'), { ssr: false });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, []);

  return (
    <main className="bg-black min-h-screen">

      {/* Hero Section with Video */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-sky-400 text-sm font-semibold tracking-[0.3em] uppercase mb-6">
            Welcome to
          </p>
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 tracking-tight">
            DairyFlat<span className="text-sky-400">Air</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            Private jet travel from Dairy Flat Airport
          </p>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Experience luxury point-to-point flights across New Zealand and beyond.
            Small aircraft. Big skies. Unforgettable journeys.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search"
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105">
              Search Flights
            </Link>
            <Link href="/my-bookings"
              className="border border-white/40 hover:border-white text-white font-semibold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:bg-white/10 backdrop-blur">
              My Bookings
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-white/50 text-xs tracking-widest uppercase">Scroll</p>
          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-sky-500 py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '5', label: 'Destinations' },
            { value: '6', label: 'Flights Weekly' },
            { value: '3', label: 'Aircraft Types' },
            { value: '100%', label: 'Private' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sky-100 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Routes Section */}
      <section className="bg-gray-950 py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🌏', dest: 'Sydney', code: 'YSSY',
                freq: 'Weekly — Fridays', price: 'From $1,200',
                aircraft: 'SyberJet SJ30i', seats: '6 seats',
                desc: 'Our prestige transtasman service in ultimate luxury.',
                image: '/sydney.jpg',
              },
              {
                icon: '🌋', dest: 'Rotorua', code: 'NZRO',
                freq: 'Twice daily — Mon to Fri', price: 'From $180',
                aircraft: 'Cirrus SF50', seats: '4 seats',
                desc: 'Fast daily shuttle to the geothermal capital.',
                image: '/rotorua.jpg',
              },
              {
                icon: '🏝️', dest: 'Great Barrier Island', code: 'NZGB',
                freq: '3× weekly', price: 'From $220',
                aircraft: 'Cirrus SF50', seats: '4 seats',
                desc: 'Escape to Claris — unspoiled and breathtaking.',
                image: '/great-barrier.jpg',
              },
              {
                icon: '🌊', dest: 'Chatham Islands', code: 'NZCI',
                freq: 'Twice weekly', price: 'From $650',
                aircraft: 'HondaJet Elite', seats: '5 seats',
                desc: 'Remote and remarkable — the edge of the world.',
                image: '/chatham.jpg',
              },
              {
                icon: '🏔️', dest: 'Lake Tekapo', code: 'NZTL',
                freq: 'Weekly — Mondays', price: 'From $350',
                aircraft: 'HondaJet Elite', seats: '5 seats',
                desc: 'Soar over the Southern Alps to stargazer country.',
                image: '/tekapo.jpg',
              },
            ].map((route) => (
              <Link
                href={`/search?orig=NZNE&dest=${route.code}`}
                key={route.dest}
                className="relative rounded-2xl overflow-hidden group cursor-pointer h-64 block">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${route.image})` }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/80 transition-all duration-300" />
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{route.icon}</span>
                    <span className="bg-sky-500/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                      {route.price}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{route.dest}</h3>
                    <p className="text-gray-300 text-xs mb-3">{route.desc}</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>✈ {route.aircraft}</span>
                      <span>{route.freq}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Route Map */}
          <div className="mt-16">
            <p className="text-sky-400 text-sm font-semibold tracking-[0.3em] uppercase text-center mb-3">
              Flight Network
            </p>

            <RouteMap />
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sky-600 py-24 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to take off?
        </h2>
        <p className="text-sky-100 text-lg mb-10 max-w-xl mx-auto">
          Search available flights and book your seat in minutes.
        </p>
        <Link href="/search"
          className="bg-white text-sky-700 font-bold px-12 py-4 rounded-full text-lg hover:bg-sky-50 transition-all duration-300 hover:scale-105 inline-block">
          Search Flights Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10 px-6 text-center">
        <p className="text-white font-bold text-xl mb-1">✈ DairyFlat Air</p>
        <p className="text-gray-600 text-sm">Dairy Flat Airport (NZNE) · North of Albany · New Zealand</p>
        <p className="text-gray-700 text-xs mt-4">© 2026 DairyFlat Air. All rights reserved.</p>
      </footer>

    </main>
  );
}