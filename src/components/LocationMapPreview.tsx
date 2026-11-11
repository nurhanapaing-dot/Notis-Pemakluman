import React, { useState } from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

interface LocationMapPreviewProps {
  lat: number;
  lng: number;
  landmark: string;
  noLaluan: string;
}

export const LocationMapPreview: React.FC<LocationMapPreviewProps> = ({
  lat,
  lng,
  landmark,
  noLaluan,
}) => {
  const [imgError, setImgError] = useState(false);

  // We construct a high-reliability OpenStreetMap / Wikimedia / Carto static map image URL
  // We can also provide a fall-back SVG vector map graphics tile if offline/blocked
  const zoom = 14;
  const staticMapUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${lng},${lat}&z=${zoom}&l=map&size=400,240&pt=${lng},${lat},pm2rdm`;

  return (
    <div className="w-full h-32 bg-slate-200 border-2 border-black rounded-lg overflow-hidden relative shadow group">
      {!imgError ? (
        <img
          src={staticMapUrl}
          alt={`Peta Lokasi ${noLaluan} ${landmark}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          crossOrigin="anonymous"
        />
      ) : (
        /* Vector Fallback if static map image fails to load */
        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-2 text-center relative bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-bounce mb-1">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-slate-900 uppercase">
            {noLaluan} {landmark ? `· ${landmark}` : ''}
          </span>
          <span className="text-[9px] font-mono font-bold text-slate-600 mt-0.5">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
        </div>
      )}

      {/* Badge Overlay */}
      <div className="absolute bottom-1.5 right-1.5 bg-black/85 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wide flex items-center gap-1 shadow">
        <Navigation className="w-2.5 h-2.5 text-amber-400" />
        <span>PETA KERJA GPS</span>
      </div>

      {/* Coordinate pill top left */}
      <div className="absolute top-1.5 left-1.5 bg-white/95 text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-black/30 shadow-xs">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>

      {/* Interactive test link button on hover */}
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Buka dalam Google Maps"
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold"
      >
        <span>Buka Google Maps</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
