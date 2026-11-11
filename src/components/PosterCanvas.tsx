import React, { useEffect, useState } from 'react';
import { RoadNotice } from '../types/notice';
import { formatTarikh, generateQrDataUrl, getGoogleMapsUrl } from '../utils/formatters';
import { LocationMapPreview } from './LocationMapPreview';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface PosterCanvasProps {
  notice: RoadNotice;
  posterRef: React.RefObject<HTMLDivElement | null>;
}

export const PosterCanvas: React.FC<PosterCanvasProps> = ({ notice, posterRef }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const googleMapsUrl = getGoogleMapsUrl(notice.lat, notice.lng);

  useEffect(() => {
    let isMounted = true;
    generateQrDataUrl(googleMapsUrl).then((url) => {
      if (isMounted) {
        setQrCodeUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [googleMapsUrl]);

  const tarikhMulaFormatted = formatTarikh(notice.tarikhMula);
  const tarikhSiapFormatted = formatTarikh(notice.tarikhSiap);
  const tarikhGabung = `${tarikhMulaFormatted} - ${tarikhSiapFormatted}`;

  const isSquare = notice.posterLayout === 'square';

  return (
    <div
      ref={posterRef}
      id="posterArea"
      className={`poster-font w-full ${
        isSquare ? 'max-w-[540px] aspect-square' : 'max-w-[500px] min-h-[720px]'
      } bg-[#fcf8ed] text-black shadow-2xl relative overflow-hidden flex flex-col justify-between select-none print:shadow-none border border-slate-300 rounded-lg`}
      style={{
        boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top Status Watermark if Approved */}
      {notice.status === 'LULUS' && (
        <div className="absolute top-2 right-3 z-30">
          <span className="bg-emerald-700 text-white text-[7.5px] px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-0.5 shadow-md border border-white/40">
            <CheckCircle2 className="w-2.5 h-2.5 inline" /> RASMI / DILULUSKAN
          </span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: TOP HEADER - Construction Skyline & JKR Port Dickson Emblem
          ========================================================================= */}
      <div className="relative w-full bg-[#fcf8ed]">
        <img
          src="/assets/aistudio/jkr_poster_header_bg.png"
          alt="JKR Port Dickson Construction Skyline Header"
          className="w-full h-auto object-contain block mx-auto"
          crossOrigin="anonymous"
        />
      </div>

      {/* =========================================================================
          SECTION 2: ORANGE NOTICE BANNERS
          ========================================================================= */}
      <div>
        {/* Banner 1: NOTIS PEMBERITAHUAN */}
        <div className="bg-[#e68018] text-black py-1 px-4 text-center font-black text-xs sm:text-[13px] tracking-wider uppercase border-t border-b border-amber-600/30">
          NOTIS PEMBERITAHUAN
        </div>

        {/* Banner 2: Project Title (White Bold on Deep Orange) */}
        <div className="bg-[#d47817] text-white px-4 py-2 text-center font-black text-[10.5px] sm:text-[11.5px] uppercase leading-snug shadow-xs">
          <span>{notice.tajukKerja || 'PELAKSANAAN KERJA-KERJA JALAN'}</span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: FLOATING "JENIS KERJA" PILL (ON CREAM BACKGROUND)
          ========================================================================= */}
      <div className="bg-[#fcf8ed] py-2 text-center">
        <span className="inline-block bg-[#e47d15] text-white font-black text-[10.5px] sm:text-[11.5px] px-7 py-1 rounded-full uppercase tracking-wide shadow-sm border border-amber-400/40">
          JENIS KERJA: <span>{notice.jenisKerja || 'MENYELENGGARA JALAN'}</span>
        </span>
      </div>

      {/* =========================================================================
          SECTION 4: MAIN YELLOW CARD BODY (Curved rounded-t-[36px])
          ========================================================================= */}
      <div className="bg-[#fbc02d] rounded-t-[32px] sm:rounded-t-[38px] px-4 pt-3.5 pb-2 flex-1 flex flex-col justify-between border-t-2 border-amber-500/40 shadow-xs relative">
        {/* Row A: 3D Megaphone & Public Notice Text */}
        <div className="flex items-start gap-2.5">
          <div className="w-12 h-12 sm:w-13 sm:h-13 shrink-0 -mt-1 drop-shadow-xs">
            <img
              src="/assets/aistudio/megaphone_clean.png"
              alt="Pengumuman Awam"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <p className="text-[10px] sm:text-[11px] font-black leading-snug uppercase text-slate-950 flex-1 pt-0.5">
            PIHAK JABATAN KERJA RAYA PORT DICKSON MEMAKLUMKAN BAHAWA{' '}
            <span className="underline decoration-2 font-black">
              {notice.jenisPenutupan || 'PENUTUPAN SATU LORONG'}
            </span>{' '}
            BESERTA TMP BAGI KERJA SEPERTI TAJUK DI ATAS PADA:
          </p>
        </div>

        {/* Row B: Details Grid with Yellow Road Warning Diamond */}
        <div className="mt-2 flex items-start gap-3">
          {/* Yellow Diamond Road Sign */}
          <div className="w-10 h-10 border-2 border-black bg-amber-400 rotate-45 flex items-center justify-center shrink-0 shadow-md mt-1 mx-1">
            <span className="-rotate-45 font-black text-2xl leading-none text-black">!</span>
          </div>

          {/* Details Table with Exact Colon Alignment */}
          <div className="flex-1 text-[10.5px] sm:text-[11.5px] font-black space-y-0.5 uppercase text-slate-950 leading-tight">
            <div className="grid grid-cols-[80px_10px_1fr]">
              <span>DAERAH</span>
              <span>:</span>
              <span>PORT DICKSON</span>
            </div>
            <div className="grid grid-cols-[80px_10px_1fr]">
              <span>LOKASI</span>
              <span>:</span>
              <span className="text-slate-950">
                {notice.namaLaluan} {notice.noLaluan ? `(${notice.noLaluan})` : ''}
              </span>
            </div>
            <div className="grid grid-cols-[80px_10px_1fr]">
              <span>SEKSYEN</span>
              <span>:</span>
              <span>{notice.seksyen || '0.00 - 2.00'}</span>
            </div>
            <div className="grid grid-cols-[80px_10px_1fr]">
              <span>LANDMARK</span>
              <span>:</span>
              <span>{notice.landmark || 'SEKITAR LALUAN KERJA'}</span>
            </div>
            <div className="grid grid-cols-[80px_10px_1fr]">
              <span>TARIKH</span>
              <span>:</span>
              <span className="text-slate-950 font-black">
                {tarikhGabung}
              </span>
            </div>
            <div className="grid grid-cols-[80px_10px_1fr]">
              <span>MASA</span>
              <span>:</span>
              <span>{notice.masa || '9.00 AM - 6.00 PM'}</span>
            </div>
          </div>
        </div>

        {/* Row C: Black Double Chevrons & Official 3D #iamJKR Mascot Badge */}
        <div className="mt-2 flex items-center justify-between relative min-h-[46px]">
          <div className="text-black font-black text-lg sm:text-xl tracking-[-1px] select-none opacity-90 flex-1">
            &gt;&gt;&nbsp;&gt;&gt;&nbsp;&gt;&gt;&nbsp;&gt;&gt;&nbsp;&gt;&gt;&nbsp;&gt;&gt;&nbsp;&gt;&gt;
          </div>

          {/* Official Circular 3D Engineer Mascot Badge */}
          <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 -my-3.5 relative z-10 drop-shadow-md">
            <img
              src="/assets/aistudio/iamjkr_mascot_circle.png"
              alt="#iamJKR Maskot"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Row D: Lower Two-Column Section (Map & QR Code on Left | Road Signboard on Right) */}
        <div className="mt-1 grid grid-cols-2 gap-3 items-stretch">
          {/* LEFT: Map + 3D Map Pin + QR Code */}
          <div className="flex flex-col items-center justify-between">
            {/* Map Frame with 3D Folded Map Graphic */}
            <div className="w-full relative">
              <div className="absolute -top-3.5 -left-2 z-10 w-10 h-10 drop-shadow-sm pointer-events-none">
                <img
                  src="/assets/aistudio/map_pin_3d.png"
                  alt="Pin Lokasi Peta"
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="rounded-2xl border-4 border-black overflow-hidden shadow-md bg-white">
                <LocationMapPreview
                  lat={notice.lat}
                  lng={notice.lng}
                  landmark={notice.landmark}
                  noLaluan={notice.noLaluan}
                />
              </div>
            </div>

            {/* QR Code Container with "LOKASI KERJA" Header */}
            <div className="mt-2 text-center flex flex-col items-center">
              <div className="p-1 bg-white border-2 border-black rounded-lg shadow-sm">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Kod QR Lokasi Kerja"
                    className="w-20 h-20 sm:w-22 sm:h-22 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-[8px] font-bold">
                    Menjana QR...
                  </div>
                )}
              </div>
              <span className="text-[9px] font-black uppercase mt-1 tracking-tight text-slate-950">
                LOKASI KERJA (IMBAS SAYA)
              </span>
            </div>
          </div>

          {/* RIGHT: Road Signpost Notice Board on Grey Pole */}
          <div className="relative flex flex-col justify-between">
            {/* Vertical Signpost Pole Behind the Sign */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3.5 bg-slate-400 rounded-full shadow-inner -z-0"></div>

            {/* Heavy Yellow Road Signboard */}
            <div className="border-4 border-black bg-[#ffdb4d] rounded-[24px] p-3 flex flex-col justify-between text-center shadow-md relative z-1 min-h-[220px]">
              <div>
                <p className="text-[8px] sm:text-[8.5px] font-black leading-tight uppercase text-slate-950">
                  PENGGUNA DIMINTA MERANCANG PERJALANAN DAN MEMATUHI ARAHAN LALULINTAS YANG TELAH DISEDIAKAN DI LOKASI KERJA.
                </p>
                <div className="my-1.5 border-t border-black/40"></div>
                <p className="text-[7.5px] sm:text-[8px] font-extrabold leading-tight uppercase text-slate-800">
                  SEBARANG PERTANYAAN ATAU ADUAN MELIBATKAN ISU-ISU DI LOKASI KERJA BOLEH BERHUBUNG TERUS DENGAN PIHAK:
                </p>
              </div>

              {/* JKR Official Stamp if approved */}
              {notice.status === 'LULUS' && (
                <div className="my-1 border-2 border-emerald-700 bg-emerald-50 text-emerald-900 rounded p-1 text-[7.5px] font-black uppercase text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>DILULUSKAN OLEH JKR PD</span>
                  </div>
                  <div className="text-[6.5px] font-mono mt-0.5 text-emerald-800">
                    {notice.tarikhKelulusan || formatTarikh(new Date().toISOString().split('T')[0])}
                  </div>
                </div>
              )}

              {/* Concession Hotline & Selia Group Logo */}
              <div className="mt-1 bg-amber-400 border border-black p-2 rounded-xl text-center shadow-xs">
                <span className="block font-black text-[9.5px] sm:text-[10px] text-black uppercase leading-tight">
                  {notice.namaKonsesi || 'SELIA SELENGGARA SELATAN'}
                </span>
                <span className="text-[8px] block font-black text-slate-900 mt-0.5">
                  DI TALIAN:
                </span>
                <span className="block font-black text-[13px] text-blue-950 tracking-wide mt-0.5">
                  {notice.telKonsesi || '60 11-6357 5547'}
                </span>

                {/* Selia Group Official Logo */}
                <div className="mt-1 flex justify-end">
                  <img
                    src="/assets/aistudio/selia_group_logo.png"
                    alt="SELIA group"
                    className="h-4 sm:h-5 w-auto object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row E: Footer on Yellow Base */}
        <div className="pt-3 mt-1 flex justify-between items-center text-[10px] font-black">
          {/* Facebook JKR Port Dickson */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
              f
            </div>
            <span className="text-black font-black text-[10px] sm:text-[11px]">
              JKR Port Dickson
            </span>
          </div>

          {/* Official Malaysia Madani & MYJalan Logo Badge */}
          <div className="h-7 sm:h-8">
            <img
              src="/assets/aistudio/footer_madani_myjalan.png"
              alt="Malaysia Madani & MYJalan"
              className="h-full w-auto object-contain"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
