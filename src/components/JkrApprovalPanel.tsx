import React, { useState } from 'react';
import { RoadNotice, NoticeStatus } from '../types/notice';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  UserCheck,
  MessageSquare,
  FileCheck2,
  Check,
} from 'lucide-react';

interface JkrApprovalPanelProps {
  notice: RoadNotice;
  onUpdateStatus: (status: NoticeStatus, remarks?: string, officer?: string, title?: string) => void;
}

export const JkrApprovalPanel: React.FC<JkrApprovalPanelProps> = ({
  notice,
  onUpdateStatus,
}) => {
  const [remarks, setRemarks] = useState(notice.ulasanJkr || '');
  const [officerName, setOfficerName] = useState(notice.pegawaiJkr || 'Ir. Ahmad Zulkifli bin Mansor');
  const [officerTitle, setOfficerTitle] = useState(notice.jawatanPegawai || 'Jurutera Daerah, JKR Port Dickson');
  const [showRemarksInput, setShowRemarksInput] = useState(false);

  const handleApprove = () => {
    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#3B82F6'],
    });

    onUpdateStatus(
      'LULUS',
      remarks || 'Pelan Pengurusan Trafik (TMP) disahkan dan diluluskan untuk pelaksanaan.',
      officerName,
      officerTitle
    );
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      alert('Sila nyatakan ulasan atau punca penolakan bagi rujukan pihak konsesi.');
      setShowRemarksInput(true);
      return;
    }
    onUpdateStatus('DITOLAK', remarks, officerName, officerTitle);
  };

  const handleSendForReview = () => {
    onUpdateStatus('MENUNGGU_PENGESAHAN', remarks, officerName, officerTitle);
  };

  const handleResetToDraft = () => {
    onUpdateStatus('DRAF', '', officerName, officerTitle);
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/90 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Tindakan Pengesahan & Kelulusan (JKR)
            </h2>
            <p className="text-xs text-slate-500">
              Bahagian Jalan, Jabatan Kerja Raya Daerah Port Dickson
            </p>
          </div>
        </div>

        {/* Current status tag */}
        <div>
          {notice.status === 'LULUS' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              LULUS & RASMI
            </span>
          )}
          {notice.status === 'DITOLAK' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              DITOLAK / PINDAAN
            </span>
          )}
          {notice.status === 'MENUNGGU_PENGESAHAN' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              DALAM SEMAKAN JKR
            </span>
          )}
          {notice.status === 'DRAF' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              DRAF KONSESI
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Pegawai Pengesah JKR bertanggungjawab memastikan Pelan Pengurusan Trafik (TMP) dan maklumat zon kerja mematuhi piawaian Arahan Teknik (Jalan) JKR sebelum poster dihebahkan kepada orang awam.
      </p>

      {/* Officer Sign-off details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Pegawai Pengesah JKR:</span>
            </span>
          </label>
          <input
            type="text"
            list="officerNamesList"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="cth: Ir. Ahmad Zulkifli"
          />
          <datalist id="officerNamesList">
            <option value="Ir. Ahmad Zulkifli bin Mansor" />
            <option value="Ir. Ts. Mohd Hafiz bin Abdullah" />
          </datalist>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Pilihan Jawatan Pegawai:
          </label>

          {/* Butang Pilihan Pantas: Jurutera Daerah vs Jurutera Jalan */}
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <button
              type="button"
              onClick={() => {
                setOfficerTitle('Jurutera Daerah, JKR Port Dickson');
                if (!officerName || officerName.includes('Mohd Hafiz')) {
                  setOfficerName('Ir. Ahmad Zulkifli bin Mansor');
                }
              }}
              className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1 text-center ${
                officerTitle.includes('Jurutera Daerah')
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-1 ring-amber-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <span>Jurutera Daerah</span>
              {officerTitle.includes('Jurutera Daerah') && (
                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOfficerTitle('Jurutera Jalan, JKR Port Dickson');
                if (!officerName || officerName.includes('Ahmad Zulkifli')) {
                  setOfficerName('Ir. Ts. Mohd Hafiz bin Abdullah');
                }
              }}
              className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1 text-center ${
                officerTitle.includes('Jurutera Jalan')
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-1 ring-amber-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <span>Jurutera Jalan</span>
              {officerTitle.includes('Jurutera Jalan') && (
                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              )}
            </button>
          </div>

          <input
            type="text"
            list="officerTitlesList"
            value={officerTitle}
            onChange={(e) => setOfficerTitle(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="cth: Jurutera Daerah atau Jurutera Jalan"
          />
          <datalist id="officerTitlesList">
            <option value="Jurutera Daerah, JKR Port Dickson" />
            <option value="Jurutera Jalan, JKR Port Dickson" />
            <option value="Jurutera Daerah" />
            <option value="Jurutera Jalan" />
          </datalist>
        </div>
      </div>

      {/* Remarks / Review Notes */}
      <div>
        <label className="font-semibold text-xs text-slate-700 block mb-1 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <span>Ulasan / Syarat Kelulusan JKR (Jika ada):</span>
        </label>
        <textarea
          rows={2}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          placeholder="Contoh: TMP diluluskan. Sila pastikan papan tanda amaran dipasang sekurang-kurangnya 500 meter dari tapak kerja."
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleApprove}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Luluskan Notis (Rasmi)</span>
        </button>

        <button
          type="button"
          onClick={handleReject}
          className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm"
        >
          <XCircle className="w-4 h-4" />
          <span>Tolak / Mohon Pindaan</span>
        </button>
      </div>

      {/* Secondary workflow helpers */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <button
          type="button"
          onClick={handleSendForReview}
          className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Tukar ke Status Semakan</span>
        </button>
        <button
          type="button"
          onClick={handleResetToDraft}
          className="text-slate-500 hover:text-slate-800 font-medium"
        >
          Kembali ke Draf Asal
        </button>
      </div>
    </div>
  );
};
