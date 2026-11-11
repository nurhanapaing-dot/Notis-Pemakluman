import React, { useState } from 'react';
import { RoadNotice } from '../types/notice';
import { generateWhatsAppBroadcastText, getGoogleMapsUrl, getWazeUrl } from '../utils/formatters';
import {
  X,
  Copy,
  Check,
  Send,
  Navigation,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface ShareModalProps {
  notice: RoadNotice;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ notice, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const broadcastText = generateWhatsAppBroadcastText(notice);
  const googleMapsUrl = getGoogleMapsUrl(notice.lat, notice.lng);
  const wazeUrl = getWazeUrl(notice.lat, notice.lng);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(broadcastText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Gagal menyalin ke papan klip.');
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(broadcastText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base leading-tight">
                Hebahan Notis (WhatsApp & Media Sosial)
              </h3>
              <p className="text-xs text-slate-300">
                Format rasmi JKR Daerah Port Dickson untuk hebahan awam
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

        {/* Content */}
        <div className="p-4 md:p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Pratonton Mesej Teks:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-900" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Mesej</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Buka WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              readOnly
              rows={12}
              value={broadcastText}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none"
            />
          </div>

          {/* Quick Navigation Links to Test */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-950 block mb-2">
              Uji Pautan Koordinat Lokasi:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Maps</span>
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                <span>Waze Navigation</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
