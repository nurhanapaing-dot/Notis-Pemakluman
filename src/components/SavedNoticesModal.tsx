import React from 'react';
import { RoadNotice } from '../types/notice';
import { formatTarikh } from '../utils/formatters';
import {
  X,
  Plus,
  FolderOpen,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Calendar,
  MapPin,
} from 'lucide-react';

interface SavedNoticesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: RoadNotice[];
  currentNoticeId: string;
  onSelectNotice: (notice: RoadNotice) => void;
  onCreateNew: () => void;
  onDuplicate: (notice: RoadNotice) => void;
  onDelete: (id: string) => void;
}

export const SavedNoticesModal: React.FC<SavedNoticesModalProps> = ({
  isOpen,
  onClose,
  notices,
  currentNoticeId,
  onSelectNotice,
  onCreateNew,
  onDuplicate,
  onDelete,
}) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: RoadNotice['status']) => {
    switch (status) {
      case 'LULUS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Lulus
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            Ditolak
          </span>
        );
      case 'MENUNGGU_PENGESAHAN':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-600" />
            Semakan JKR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Draf
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base leading-tight">
                Rekod & Draf Notis Kerja Jalan
              </h3>
              <p className="text-xs text-slate-300">
                Senarai notis aktif dan arkib kerja JKR Daerah Port Dickson
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

        {/* Action bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-600">
            Jumlah: <strong className="text-slate-900">{notices.length}</strong> Notis
          </span>
          <button
            type="button"
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Bina Notis Baru</span>
          </button>
        </div>

        {/* Notice List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notices.map((n) => {
            const isCurrent = n.id === currentNoticeId;
            return (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {n.noLaluan}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">·</span>
                    <span className="text-xs font-medium text-slate-700 truncate max-w-[260px]">
                      {n.namaLaluan}
                    </span>
                    {getStatusBadge(n.status)}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                        Sedang Dibuka
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-900 line-clamp-1">
                    {n.tajukKerja}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {n.landmark || 'Tiada Landmark'} (Sek: {n.seksyen})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatTarikh(n.tarikhMula)} - {formatTarikh(n.tarikhSiap)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectNotice(n);
                      onClose();
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isCurrent ? 'Aktif' : 'Buka'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicate(n)}
                    title="Salin / Duplikasi Notis"
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {notices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Padam notis "${n.noLaluan} - ${n.namaLaluan}"?`)) {
                          onDelete(n.id);
                        }
                      }}
                      title="Padam Notis"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
