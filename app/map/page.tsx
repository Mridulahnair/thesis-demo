"use client";

import dynamic from 'next/dynamic';

const MapPageContent = dynamic(() => import('./client-page').then(mod => ({ default: mod.MapPageContent })), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-500 text-lg">Loading map...</p>
      </div>
    </main>
  ),
});

export default function MapPage() {
  return <MapPageContent />;
}