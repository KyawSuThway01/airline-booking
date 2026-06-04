'use client';
import { useEffect } from 'react';

const airports = [
    { code: 'NZNE', name: 'Dairy Flat', lat: -36.4333, lng: 174.6500 },
    { code: 'YSSY', name: 'Sydney', lat: -33.9461, lng: 151.1772 },
    { code: 'NZRO', name: 'Rotorua', lat: -38.1092, lng: 176.3172 },
    { code: 'NZGB', name: 'Great Barrier Island', lat: -36.2333, lng: 175.4667 },
    { code: 'NZCI', name: 'Chatham Islands', lat: -43.8100, lng: -176.5700 },
    { code: 'NZTL', name: 'Lake Tekapo', lat: -44.0053, lng: 170.4444 },
];

const routes = [
    { from: 'NZNE', to: 'YSSY', color: '#38bdf8' },
    { from: 'NZNE', to: 'NZRO', color: '#fb923c' },
    { from: 'NZNE', to: 'NZGB', color: '#34d399' },
    { from: 'NZNE', to: 'NZCI', color: '#a78bfa' },
    { from: 'NZNE', to: 'NZTL', color: '#f472b6' },
];

export default function RouteMap() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Dynamically import leaflet to avoid SSR issues
        import('leaflet').then((L) => {
            // Fix default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const existingMap = (window as any)._leafletMap;
            if (existingMap) {
                existingMap.remove();
                (window as any)._leafletMap = null;
            }

            const container = document.getElementById('route-map');
            if (!container) return;

            const map = L.map('route-map', {
                center: [-38, 170],
                zoom: 4,
                zoomControl: true,
                scrollWheelZoom: false,
            });

            (window as any)._leafletMap = map;

            // Dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO',
                subdomains: 'abcd',
                maxZoom: 19,
            }).addTo(map);

            // Draw routes
            routes.forEach((route) => {
                const from = airports.find(a => a.code === route.from)!;
                const to = airports.find(a => a.code === route.to)!;

                L.polyline(
                    [[from.lat, from.lng], [to.lat, to.lng]],
                    { color: route.color, weight: 2, opacity: 0.8, dashArray: '6, 6' }
                ).addTo(map);
            });

            // Draw airport markers
            airports.forEach((airport) => {
                const isHub = airport.code === 'NZNE';

                const icon = L.divIcon({
                    html: `
            <div style="
              width: ${isHub ? '14px' : '10px'};
              height: ${isHub ? '14px' : '10px'};
              background: ${isHub ? '#38bdf8' : '#ffffff'};
              border: 2px solid ${isHub ? '#0ea5e9' : '#94a3b8'};
              border-radius: 50%;
              box-shadow: 0 0 ${isHub ? '8px' : '4px'} ${isHub ? '#38bdf8' : '#ffffff'};
            "></div>
          `,
                    className: '',
                    iconSize: [isHub ? 14 : 10, isHub ? 14 : 10],
                    iconAnchor: [isHub ? 7 : 5, isHub ? 7 : 5],
                });

                L.marker([airport.lat, airport.lng], { icon })
                    .addTo(map)
                    .bindPopup(`
            <div style="background:#1e293b;color:white;padding:8px 12px;border-radius:8px;font-family:sans-serif;">
              <strong style="color:#38bdf8">${airport.code}</strong><br/>
              ${airport.name}
            </div>
          `, { className: 'custom-popup' });

                // Add label
                L.tooltip({
                    permanent: true,
                    direction: airport.code === 'NZCI' ? 'left' : 'right',
                    className: 'map-label',
                    offset: [10, 0],
                })
                    .setContent(`<span style="color:#94a3b8;font-size:11px;font-weight:bold;background:transparent;border:none;box-shadow:none;">${airport.code}</span>`)
                    .setLatLng([airport.lat, airport.lng])
                    .addTo(map);
            });
        });

        return () => {
            const existingMap = (window as any)._leafletMap;
            if (existingMap) {
                existingMap.remove();
                (window as any)._leafletMap = null;
            }
        };
    }, []);

    return (
        <div className="relative">
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />
            <style>{`
        .leaflet-container { background: #0f172a !important; }
        .leaflet-popup-content-wrapper { background: #1e293b !important; border: 1px solid rgba(255,255,255,0.1); }
        .leaflet-popup-tip { background: #1e293b !important; }
        .map-label { background: transparent !important; border: none !important; box-shadow: none !important; }
        .leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; }
      `}</style>
            <div
                id="route-map"
                className="w-full rounded-2xl overflow-hidden"
                style={{ height: '450px', zIndex: 1 }}
            />
        </div>
    );
}