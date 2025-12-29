'use client';
import { Droplets } from 'lucide-react';
import { useState, useEffect } from 'react';

const IconWifi = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);


// --- KOMPONEN KARTU PREMIUM ---
const PlantCard = ({ title, value, index }: { title: string; value: number; index: number }) => {
  let videoSrc;
  let statusText;
  let themeColor;
  let glowColor;

  if (value < 30) {
    videoSrc = 'video/sad.mp4';
    statusText = 'Kering';
    themeColor = 'text-rose-600 bg-rose-50 border-rose-100';
    glowColor = 'shadow-rose-500/10';
  } else if (value > 70) {
    videoSrc = 'video/happy.mp4';
    statusText = 'Sangat Basah';
    themeColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
    glowColor = 'shadow-emerald-500/10';
  } else {
    videoSrc = 'video/normal.mp4';
    statusText = 'Ideal';
    themeColor = 'text-blue-600 bg-blue-50 border-blue-100';
    glowColor = 'shadow-blue-500/10';
  }

  return (
    <div className={`relative group bg-white rounded-[2rem] p-4 border border-slate-100 shadow-xl ${glowColor} transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl`}>
      {/* 1. Header Kartu */}
      <div className="flex justify-between items-start mb-4 px-2 pt-2">
        <div>
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Sensor 0{index}</h2>
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${themeColor}`}>{statusText}</div>
      </div>

      {/* 2. Visual Video (Rounded Besar) */}
      <div className="relative w-full aspect-[9/13] overflow-hidden rounded-3xl bg-slate-100 mb-6 group-hover:ring-4 ring-offset-2 ring-slate-50 transition-all">
        <video key={videoSrc} src={videoSrc} autoPlay loop muted playsInline className="w-full h-full object-cover transform transition-transform duration-[2s] group-hover:scale-110" />
        {/* Overlay Gradasi halus di atas video agar teks terbaca jika ditaruh di atas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* 3. Statistik Besar */}
      <div className="px-2 pb-2">
        <div className="flex items-end justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-5xl font-extrabold text-slate-800 tracking-tighter">
              {value}
              <span className="text-2xl text-slate-400 font-medium">%</span>
            </span>
          </div>
          <div className={`p-3 rounded-2xl ${themeColor.split(' ')[1]}`}>
            <Droplets className={`w-6 h-6 ${themeColor.split(' ')[0]}`} />
          </div>
        </div>

        {/* Progress Bar Premium */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${value < 30 ? 'bg-rose-500' : value > 70 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${value}%` }} />
        </div>
        <p className="text-right text-xs text-slate-400 mt-2 font-medium">Kelembapan Tanah</p>
      </div>
    </div>
  );
};

// --- HALAMAN UTAMA ---
export default function Home() {
  const [sensors, setSensors] = useState({ s1: 0, s2: 0, s3: 0 });
  const [lastUpdate, setLastUpdate] = useState<string>('-');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sensor');
      const data = await res.json();
      setSensors({ s1: data.s1, s2: data.s2, s3: data.s3 });
      setLastUpdate(new Date(data.lastUpdate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-100">
      {/* Background Decor (Grid Pattern) */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.4 }}></div>

      {/* Blur Blobs (Pemanis Background) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Smart Garden</h1>
            <p className="text-slate-500 text-lg">Monitor kelembapan tanah tanaman real-time.</p>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Sistem</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <IconWifi className="w-4 h-4" />
                <span>Terhubung • {lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PlantCard title="Tanaman Punya Diva" value={sensors.s1} index={1} />
          <PlantCard title="Tanaman Punya Iqbal" value={sensors.s2} index={2} />
          <PlantCard title="Tanaman Punya Salma" value={sensors.s3} index={3} />
        </div>
      </div>
    </main>
  );
}
