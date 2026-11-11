import React, { useState } from 'react';
import { RoadNotice, PDRoadPreset, PosterLayout, PosterTheme } from '../types/notice';
import { PD_ROADS_PRESETS, WORK_TYPES, TMP_TYPES, CONCESSIONAIRES } from '../data/pdRoads';
import {
  MapPin,
  Calendar,
  Clock,
  Building2,
  Phone,
  FileEdit,
  Sparkles,
  RotateCcw,
  Navigation,
  Compass,
  Sliders,
  Check,
} from 'lucide-react';

interface NoticeFormProps {
  notice: RoadNotice;
  onChange: (updated: RoadNotice) => void;
  onReset: () => void;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({ notice, onChange, onReset }) => {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);

  const updateField = <K extends keyof RoadNotice>(key: K, value: RoadNotice[K]) => {
    onChange({
      ...notice,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const applyRoadPreset = (preset: PDRoadPreset) => {
    onChange({
      ...notice,
      noLaluan: preset.noLaluan,
      namaLaluan: preset.namaLaluan,
      seksyen: preset.seksyen,
      landmark: preset.landmark,
      lat: preset.lat,
      lng: preset.lng,
      tajukKerja: `PELAKSANAAN KERJA-KERJA ${notice.jenisKerja} DI LALUAN ${preset.noLaluan} ${preset.namaLaluan} DAERAH PORT DICKSON, NEGERI SEMBILAN`,
      updatedAt: new Date().toISOString(),
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Pelayar anda tidak menyokong geolokasi.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        setGeoSuccess(true);
        updateField('lat', Number(pos.coords.latitude.toFixed(6)));
        updateField('lng', Number(pos.coords.longitude.toFixed(6)));
        setTimeout(() => setGeoSuccess(false), 2500);
      },
      (err) => {
        setGeoLoading(false);
        alert('Gagal mendapatkan lokasi GPS semasa: ' + err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const setDaysDuration = (days: number) => {
    const startDate = notice.tarikhMula ? new Date(notice.tarikhMula) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days);
    updateField('tarikhSiap', endDate.toISOString().split('T')[0]);
  };

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Persekutuan' | 'Negeri'>('ALL');
  const [roadSearch, setRoadSearch] = useState('');

  const filteredRoads = PD_ROADS_PRESETS.filter((r) => {
    const matchesCategory =
      categoryFilter === 'ALL' || r.kategori === categoryFilter;
    const q = roadSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      r.noLaluan.toLowerCase().includes(q) ||
      r.namaLaluan.toLowerCase().includes(q) ||
      r.landmark.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/90 space-y-6">
      {/* Header and Quick Presets */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Maklumat Kerja (Penyediaan Draf)
              </h2>
              <p className="text-xs text-slate-500">
                Pihak Konsesi / Kontraktor Daerah Port Dickson
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition"
            title="Isi semula borang contoh"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Set Semula</span>
          </button>
        </div>

        {/* Official Road Route Presets (JKR PD Update 07.01.2026) */}
        <div className="mt-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Senarai Jalan JKR PD (Kemaskini 07.01.2026)
              </span>
              <span className="text-[11px] text-slate-500 block">
                Pilih mana-mana laluan untuk auto-isi nombor laluan, nama, seksyen dan koordinat
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="inline-flex bg-white rounded-lg p-0.5 border border-slate-200 text-xs shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCategoryFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-bold transition text-[11px] ${
                  categoryFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua (37)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('Persekutuan')}
                className={`px-2.5 py-1 rounded-md font-bold transition text-[11px] ${
                  categoryFilter === 'Persekutuan'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Persekutuan FRM (8)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('Negeri')}
                className={`px-2.5 py-1 rounded-md font-bold transition text-[11px] ${
                  categoryFilter === 'Negeri'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Negeri (29)
              </button>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="mb-2">
            <input
              type="text"
              value={roadSearch}
              onChange={(e) => setRoadSearch(e.target.value)}
              placeholder="Cari nombor laluan atau nama jalan (cth: FT0005, N4, Sua Betong, Chuah)..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Scrollable Road Buttons Grid */}
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {filteredRoads.map((preset) => {
              const isSelected =
                notice.noLaluan.replace(/^FT0*/, 'FT') === preset.noLaluan.replace(/^FT0*/, 'FT') ||
                notice.noLaluan === preset.noLaluan;

              return (
                <button
                  key={`${preset.noLaluan}-${preset.namaLaluan}`}
                  type="button"
                  onClick={() => applyRoadPreset(preset)}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition font-medium flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs ring-1 ring-amber-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                  title={`${preset.noLaluan} - ${preset.namaLaluan} (Panjang: ${preset.panjangKm} km, Seksyen: ${preset.seksyen})`}
                >
                  <span className="font-black font-mono px-1 py-0.5 bg-black/10 rounded text-[10px]">
                    {preset.noLaluan}
                  </span>
                  <span className="truncate max-w-[200px] sm:max-w-[240px]">
                    {preset.namaLaluan}
                  </span>
                  {preset.panjangKm && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {preset.panjangKm}km
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
        {/* Tajuk Penuh */}
        <div>
          <label className="font-bold text-slate-800 block mb-1 flex items-center justify-between">
            <span>Tajuk Penuh Pelaksanaan Kerja:</span>
            <span className="text-[11px] font-normal text-slate-600">Huruf besar rasmi JKR</span>
          </label>
          <textarea
            rows={3}
            value={notice.tajukKerja}
            onChange={(e) => updateField('tajukKerja', e.target.value.toUpperCase())}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition leading-relaxed"
            placeholder="CONTOH: PELAKSANAAN KERJA-KERJA MENGECHAT SEMULA GARISAN JALAN..."
            required
          />
        </div>

        {/* Jenis Kerja & Jenis Penutupan TMP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Jenis Kerja:</label>
            <input
              type="text"
              list="workTypesList"
              value={notice.jenisKerja}
              onChange={(e) => updateField('jenisKerja', e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: MENYELENGGARA JALAN"
            />
            <datalist id="workTypesList">
              {WORK_TYPES.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Jenis Penutupan / Pelan Trafik (TMP):
            </label>

            {/* Pilihan Utama: Penutupan Satu Lorong | Penutupan Sepenuhnya Jalan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => updateField('jenisPenutupan', 'PENUTUPAN SATU LORONG')}
                className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-between ${
                  notice.jenisPenutupan === 'PENUTUPAN SATU LORONG'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-1 ring-amber-400'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <span>Penutupan Satu Lorong</span>
                {notice.jenisPenutupan === 'PENUTUPAN SATU LORONG' && (
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => updateField('jenisPenutupan', 'PENUTUPAN SEPENUHNYA JALAN')}
                className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-between ${
                  notice.jenisPenutupan === 'PENUTUPAN SEPENUHNYA JALAN'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-1 ring-amber-400'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <span>Penutupan Sepenuhnya Jalan</span>
                {notice.jenisPenutupan === 'PENUTUPAN SEPENUHNYA JALAN' && (
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                )}
              </button>
            </div>

            <input
              type="text"
              list="tmpTypesList"
              value={notice.jenisPenutupan}
              onChange={(e) => updateField('jenisPenutupan', e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: PENUTUPAN SATU LORONG atau PENUTUPAN SEPENUHNYA JALAN"
            />
            <datalist id="tmpTypesList">
              {TMP_TYPES.map((tmp) => (
                <option key={tmp} value={tmp} />
              ))}
            </datalist>
          </div>
        </div>

        {/* No Laluan & Nama Laluan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div>
            <label className="font-bold text-slate-800 block mb-1">No. Laluan:</label>
            <input
              type="text"
              value={notice.noLaluan}
              onChange={(e) => updateField('noLaluan', e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: FT219 atau N008"
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-bold text-slate-800 block mb-1">Nama Laluan / Jalan:</label>
            <input
              type="text"
              value={notice.namaLaluan}
              onChange={(e) => updateField('namaLaluan', e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: JALAN SUA BETONG-SUNGGALA"
            />
          </div>
        </div>

        {/* Seksyen & Landmark */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Seksyen (KM):</label>
            <input
              type="text"
              value={notice.seksyen}
              onChange={(e) => updateField('seksyen', e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: 0.00 - 2.00 atau KM 14"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800 block mb-1">Landmark / Rujukan:</label>
            <input
              type="text"
              value={notice.landmark}
              onChange={(e) => updateField('landmark', e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: BULATAN SUNGGALA"
            />
          </div>
        </div>

        {/* GPS Coordinates Box with Geolocation Button */}
        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Koordinat GPS Lokasi Kerja (Untuk Kod QR & Navigasi):</span>
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={geoLoading}
              className="text-[11px] bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 shadow-2xs"
            >
              {geoLoading ? (
                <span>Mencari GPS...</span>
              ) : geoSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Lokasi Diperoleh!</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Guna GPS Semasa</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Latitud (Utara):
              </label>
              <input
                type="number"
                step="any"
                value={notice.lat}
                onChange={(e) => updateField('lat', parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Longitud (Timur):
              </label>
              <input
                type="number"
                step="any"
                value={notice.lng}
                onChange={(e) => updateField('lng', parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Tarikh Mula, Tarikh Siap, dan Tempoh Hari */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Tempoh Pelaksanaan Kerja:</span>
            </label>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-600">Tempoh:</span>
              <button
                type="button"
                onClick={() => setDaysDuration(7)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                +7 Hari
              </button>
              <button
                type="button"
                onClick={() => setDaysDuration(14)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                +14 Hari
              </button>
              <button
                type="button"
                onClick={() => setDaysDuration(30)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                +1 Bulan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Tarikh Mula:</label>
              <input
                type="date"
                value={notice.tarikhMula}
                onChange={(e) => updateField('tarikhMula', e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Tarikh Siap:</label>
              <input
                type="date"
                value={notice.tarikhSiap}
                onChange={(e) => updateField('tarikhSiap', e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Waktu Pelaksanaan */}
        <div>
          <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Waktu Operasi / Jam Kerja:</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2">
              <input
                type="text"
                value={notice.masa}
                onChange={(e) => updateField('masa', e.target.value.toUpperCase())}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="cth: 9.00 AM - 6.00 PM"
              />
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => updateField('masa', '9.00 AM - 6.00 PM (SIANG)')}
                className="flex-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1 rounded border border-slate-200"
              >
                Siang
              </button>
              <button
                type="button"
                onClick={() => updateField('masa', '9.00 PM - 5.00 AM (KERJA MALAM)')}
                className="flex-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1 rounded border border-slate-200"
              >
                Malam
              </button>
            </div>
          </div>
        </div>

        {/* Nama Konsesi & No. Telefon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Nama Syarikat Konsesi / Kontraktor:</span>
            </label>
            <input
              type="text"
              list="concessionairesList"
              value={notice.namaKonsesi}
              onChange={(e) => updateField('namaKonsesi', e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: SELIA SELENGGARA SELATAN"
            />
            <datalist id="concessionairesList">
              {CONCESSIONAIRES.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-600" />
              <span>No. Telefon Kecemasan / Hotline 24 Jam:</span>
            </label>
            <input
              type="text"
              value={notice.telKonsesi}
              onChange={(e) => updateField('telKonsesi', e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="cth: 011-6357 5547"
            />
          </div>
        </div>

        {/* Format Layout Poster */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-800 block">Tetapan Rupa Bentuk:</span>
            <span className="text-[11px] text-slate-500">Pilih saiz nisbah paparan poster</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Nisbah Format Poster:</span>
            </label>
            <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => updateField('posterLayout', 'portrait')}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  notice.posterLayout === 'portrait'
                    ? 'bg-white text-slate-950 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standard (Flyer)
              </button>
              <button
                type="button"
                onClick={() => updateField('posterLayout', 'square')}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  notice.posterLayout === 'square'
                    ? 'bg-white text-slate-950 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Segiempat (1:1 Media Sosial)
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
