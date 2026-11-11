import React, { useState } from 'react';
import { PD_ROADS_PRESETS } from '../data/pdRoads';
import { PDRoadPreset } from '../types/notice';
import { X, MapPin, Navigation, ExternalLink, Check } from 'lucide-react';

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  onSaveCoordinates: (lat: number, lng: number, landmark?: string) => void;
}

export const MapPickerModal: React.FC<MapPickerModalProps> = ({
  isOpen,
  onClose,
  lat,
  lng,
  onSaveCoordinates,
}) => {
  const [currentLat, setCurrentLat] = useState(lat);
  const [currentLng, setCurrentLng] = useState(lng);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: PDRoadPreset) => {
    setCurrentLat(preset.lat);
    setCurrentLng(preset.lng);
    setSelectedPreset(preset.landmark);
  };

  const handleConfirm = () => {
    onSaveCoordinates(currentLat, currentLng, selectedPreset || undefined);
    onClose();
  };

  // OpenStreetMap embed iframe
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.02}%2C${currentLat - 0.02}%2C${currentLng + 0.02}%2C${currentLat + 0.02}&layer=mapnik&marker=${currentLat}%2C${currentLng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base leading-tight">
                Peta & Penentu Koordinat GPS Port Dickson
              </h3>
              <p className="text-xs text-slate-300">
                Semak kedudukan zon kerja jalan dan sempadan daerah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="p-3 bg-amber-50 border-b border-amber-200">
          <span className="text-xs font-bold text-amber-950 block mb-1.5">
            Pilih Lokasi Kawasan Port Dickson:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {PD_ROADS_PRESETS.map((preset) => (
              <button
                key={`${preset.noLaluan}-${preset.namaLaluan}`}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                  currentLat === preset.lat && currentLng === preset.lng
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-100'
                }`}
              >
                <span className="font-bold">{preset.noLaluan}</span> · {preset.namaLaluan}
              </button>
            ))}
          </div>
        </div>

        {/* Embedded Map */}
        <div className="relative w-full h-72 md:h-80 bg-slate-200">
          <iframe
            title="OpenStreetMap Port Dickson"
            src={osmEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
          />

          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm border border-black/10 text-xs font-mono font-bold text-slate-900">
            {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
          </div>
        </div>

        {/* Coordinate Input fields */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border-t border-slate-200 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Latitud GPS:</label>
            <input
              type="number"
              step="any"
              value={currentLat}
              onChange={(e) => setCurrentLat(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Longitud GPS:</label>
            <input
              type="number"
              step="any"
              value={currentLng}
              onChange={(e) => setCurrentLng(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <a
            href={`https://www.google.com/maps?q=${currentLat},${currentLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
          >
            <span>Buka di Google Maps Penuh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Koordinat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
