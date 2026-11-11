import QRCode from 'qrcode';
import { RoadNotice } from '../types/notice';

export function formatTarikh(tarikhStr: string): string {
  if (!tarikhStr) return '';
  const parts = tarikhStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return tarikhStr;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function getWazeUrl(lat: number, lng: number): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    // Fallback to web qr api if needed
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;
  }
}

export function generateWhatsAppBroadcastText(notice: RoadNotice): string {
  const tarikhMula = formatTarikh(notice.tarikhMula);
  const tarikhSiap = formatTarikh(notice.tarikhSiap);
  const googleMapsUrl = getGoogleMapsUrl(notice.lat, notice.lng);
  const wazeUrl = getWazeUrl(notice.lat, notice.lng);

  return `🚧 *NOTIS PEMBERITAHUAN KERJA JALAN JKR DAERAH PORT DICKSON* 🚧
${notice.refNo ? `No. Rujukan: ${notice.refNo}\n` : ''}
Pihak Jabatan Kerja Raya (JKR) Daerah Port Dickson ingin memaklumkan bahawa *${notice.jenisPenutupan.toUpperCase()}* akan dilaksanakan bagi membolehkan kerja-kerja berikut dijalankan:

📋 *MAKLUMAT KERJA:*
━━━━━━━━━━━━━━━━━━━━
📌 *Tajuk Kerja:*
${notice.tajukKerja}

🔧 *Jenis Kerja:* ${notice.jenisKerja}
🚦 *Pelan Trafik (TMP):* ${notice.jenisPenutupan}
🛣️ *Laluan:* ${notice.namaLaluan} (${notice.noLaluan})
📏 *Seksyen:* ${notice.seksyen}
📍 *Landmark / Lokasi:* ${notice.landmark}
📅 *Tarikh Pelaksanaan:* ${tarikhMula} hingga ${tarikhSiap}
⏰ *Waktu Kerja:* ${notice.masa}

🌐 *PAUTAN NAVIGASI LOKASI KERJA:*
Google Maps: ${googleMapsUrl}
Waze: ${wazeUrl}

⚠️ *PERINGATAN KEPADA PENGGUNA JALAN RAYA:*
1. Pengguna jalan raya dinasihatkan supaya merancang perjalanan lebih awal dan mematuhi papan tanda amaran serta arahan petugas bendera (flagman) di lokasi.
2. Sila perlahankan kenderaan dan berhati-hati ketika melalui kawasan zon kerja.

📞 *PERTANYAAN & KECEMASAN:*
Pihak Konsesi: *${notice.namaKonsesi}*
Talian Hotline: *${notice.telKonsesi}*
Bilik Gerakan JKR Port Dickson: *06-647 1040*

Sekian untuk makluman bersama. Kesabaran dan kerjasama anda amat dihargai.

#JKRPortDickson #JalanRayaSelamat #iamJKR #MYJalan #MalaysiaMadani`;
}
