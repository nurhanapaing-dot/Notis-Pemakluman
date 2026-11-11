import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { RoadNotice, NoticeStatus } from './types/notice';
import { INITIAL_NOTICE, SAMPLE_SAVED_NOTICES } from './data/pdRoads';
import { PosterCanvas } from './components/PosterCanvas';
import { NoticeForm } from './components/NoticeForm';
import { JkrApprovalPanel } from './components/JkrApprovalPanel';
import { ShareModal } from './components/ShareModal';
import { SavedNoticesModal } from './components/SavedNoticesModal';
import { MapPickerModal } from './components/MapPickerModal';
import { JkrLogo } from './components/JkrLogo';
import {
  Download,
  Share2,
  Printer,
  Save,
  FolderOpen,
  Map,
  Shield,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Sun,
  LayoutTemplate,
  Layers,
  Info,
} from 'lucide-react';

const STORAGE_KEY = 'jkr_pd_road_notices_v1';
const CURRENT_ID_KEY = 'jkr_pd_current_notice_id_v1';

export default function App() {
  const [notices, setNotices] = useState<RoadNotice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved notices:', e);
    }
    return SAMPLE_SAVED_NOTICES;
  });

  const [currentId, setCurrentId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(CURRENT_ID_KEY);
      if (savedId) return savedId;
    } catch {
      // fallback
    }
    return INITIAL_NOTICE.id;
  });

  // Active Notice
  const currentNotice = notices.find((n) => n.id === currentId) || notices[0] || INITIAL_NOTICE;

  // Active tab on mobile / left side: 'form' | 'approval'
  const [activeTab, setActiveTab] = useState<'form' | 'approval'>('form');

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const posterRef = useRef<HTMLDivElement | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_ID_KEY, currentId);
    } catch (e) {
      console.error('Failed to save currentId:', e);
    }
  }, [currentId]);

  const updateCurrentNotice = (updated: RoadNotice) => {
    setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleUpdateStatus = (
    newStatus: NoticeStatus,
    remarks?: string,
    officer?: string,
    title?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const updated: RoadNotice = {
      ...currentNotice,
      status: newStatus,
      ulasanJkr: remarks ?? currentNotice.ulasanJkr,
      pegawaiJkr: officer ?? currentNotice.pegawaiJkr,
      jawatanPegawai: title ?? currentNotice.jawatanPegawai,
      tarikhKelulusan: newStatus === 'LULUS' ? today : currentNotice.tarikhKelulusan,
      updatedAt: new Date().toISOString(),
    };
    updateCurrentNotice(updated);

    if (newStatus === 'LULUS') {
      showToast('Notis DILULUSKAN! Cop rasmi JKR telah ditambah ke poster.');
    } else if (newStatus === 'DITOLAK') {
      showToast('Notis ditolak untuk pindaan oleh pihak konsesi.');
    } else {
      showToast('Status notis dikemaskini.');
    }
  };

  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);

    try {
      // Allow fonts and QR code images to settle
      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(posterRef.current, {
        scale: 3, // High-DPI output for crisp printing
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const cleanRoad = (currentNotice.noLaluan || 'JALAN').replace(/[^a-zA-Z0-9]/g, '_');
      const cleanDate = (currentNotice.tarikhMula || '2026').replace(/-/g, '');
      const filename = `NOTIS_KERJA_JKR_PD_${cleanRoad}_${cleanDate}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Poster berjaya dimuat turun dalam kualiti tinggi (PNG)!');
    } catch (err) {
      console.error('Error generating poster image:', err);
      alert('Ralat semasa menjana imej poster. Sila cuba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleCreateNew = () => {
    const newId = `notice-pd-${Date.now()}`;
    const newNotice: RoadNotice = {
      ...INITIAL_NOTICE,
      id: newId,
      refNo: `JKR/PD/JLN/TMP/2026/${Math.floor(100 + Math.random() * 900)}`,
      tajukKerja: 'PELAKSANAAN KERJA-KERJA PENYELENGGARAAN JALAN DI DAERAH PORT DICKSON, NEGERI SEMBILAN',
      status: 'DRAF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotices((prev) => [newNotice, ...prev]);
    setCurrentId(newId);
    showToast('Notis draf baru dicipta.');
  };

  const handleDuplicate = (n: RoadNotice) => {
    const newId = `notice-pd-${Date.now()}`;
    const duplicated: RoadNotice = {
      ...n,
      id: newId,
      refNo: `JKR/PD/JLN/TMP/2026/${Math.floor(100 + Math.random() * 900)}`,
      status: 'DRAF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotices((prev) => [duplicated, ...prev]);
    setCurrentId(newId);
    showToast('Salinan notis berjaya dibuat.');
  };

  const handleDelete = (id: string) => {
    if (notices.length <= 1) {
      alert('Sekurang-kurangnya satu notis perlu disimpan.');
      return;
    }
    const remaining = notices.filter((n) => n.id !== id);
    setNotices(remaining);
    if (currentId === id) {
      setCurrentId(remaining[0].id);
    }
    showToast('Notis telah dipadam.');
  };

  const handleSaveCoordinatesFromMap = (lat: number, lng: number, landmark?: string) => {
    updateCurrentNotice({
      ...currentNotice,
      lat,
      lng,
      landmark: landmark ? landmark : currentNotice.landmark,
      updatedAt: new Date().toISOString(),
    });
    showToast('Koordinat GPS dikemaskini.');
  };

  const getStatusBadge = () => {
    switch (currentNotice.status) {
      case 'LULUS':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Status: Disahkan & Diluluskan JKR</span>
          </div>
        );
      case 'DITOLAK':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>Status: Ditolak / Perlu Pindaan</span>
          </div>
        );
      case 'MENUNGGU_PENGESAHAN':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span>Status: Dalam Semakan JKR PD</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>Status: Draf Konsesi</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Official Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Agency Info */}
          <div className="flex items-center gap-3">
            <JkrLogo district="PORT DICKSON" size="sm" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Sistem Notis Kerja Jalan
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow-2xs">
                  JKR Port Dickson
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Penjanaan Notis TMP, Peta GPS & Kod QR Rasmi Negeri Sembilan
              </p>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}

            <button
              type="button"
              onClick={() => setIsSavedModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200 shadow-2xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Draf ({notices.length})</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Draf notis telah disimpan ke storan peranti.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200 shadow-2xs"
              title="Simpan perubahan ke storan tempatan"
            >
              <Save className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Simpan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================
              LEFT COLUMN: FORM & APPROVAL WORKFLOW
              ========================================================= */}
          <div className="lg:col-span-6 space-y-6 no-print">
            {/* Mode / Tabs Switcher */}
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'form'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Maklumat Kerja (Konsesi)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('approval')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'approval'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>2. Pengesahan & Kelulusan (JKR)</span>
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 font-semibold shadow-2xs transition"
              >
                <Map className="w-3.5 h-3.5 text-amber-600" />
                <span>Penentu Lokasi Peta GPS</span>
              </button>

              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 font-bold shadow-2xs transition"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Format Teks WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Cetak A4</span>
              </button>
            </div>

            {/* Active Tab View */}
            {activeTab === 'form' ? (
              <div className="space-y-6">
                <NoticeForm
                  notice={currentNotice}
                  onChange={updateCurrentNotice}
                  onReset={() => updateCurrentNotice(INITIAL_NOTICE)}
                />

                {/* Mini JKR Approval Card Reminder */}
                <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 block mb-0.5">
                      Peringatan Syarikat Konsesi:
                    </span>
                    <p className="text-amber-900 leading-relaxed">
                      Sila pastikan Pelan Pengurusan Trafik (TMP) telah disemak bersama Jurutera Jalan JKR Daerah Port Dickson sebelum poster rasmi diedarkan ke media sosial atau aplikasi pemesejan awam.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <JkrApprovalPanel
                  notice={currentNotice}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            )}
          </div>

          {/* =========================================================
              RIGHT COLUMN: LIVE POSTER OUTPUT & CONTROLS
              ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Poster Control Bar */}
            <div className="w-full max-w-[500px] flex items-center justify-between mb-3 no-print gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">Pratonton Poster:</span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                  Format Piawai JKR Port Dickson
                </span>
              </div>

              {/* Download PNG Button */}
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isDownloading}
                className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md transition text-xs flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Menjana PNG...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Muat Turun PNG</span>
                  </>
                )}
              </button>
            </div>

            {/* Poster Canvas Display */}
            <div className="w-full flex justify-center">
              <PosterCanvas notice={currentNotice} posterRef={posterRef} />
            </div>

            {/* Sub-poster Action Bar */}
            <div className="w-full max-w-[490px] mt-4 flex items-center justify-between no-print text-xs text-slate-500 px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Kod QR & Peta dikemaskini secara langsung</span>
              </span>

              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Kongsi ke WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              Jabatan Kerja Raya Daerah Port Dickson
            </span>
            <span>·</span>
            <span>Negeri Sembilan Darul Khusus</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Hak Cipta Terpelihara JKR Port Dickson © 2026 · Mengikut Garis Panduan ATJ 2C/85
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShareModal
        notice={currentNotice}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <SavedNoticesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        notices={notices}
        currentNoticeId={currentId}
        onSelectNotice={(n) => setCurrentId(n.id)}
        onCreateNew={handleCreateNew}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      <MapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        lat={currentNotice.lat}
        lng={currentNotice.lng}
        onSaveCoordinates={handleSaveCoordinatesFromMap}
      />
    </div>
  );
}
