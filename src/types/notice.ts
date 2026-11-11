export type NoticeStatus = 'DRAF' | 'MENUNGGU_PENGESAHAN' | 'LULUS' | 'DITOLAK';

export type PosterLayout = 'portrait' | 'square';

export type PosterTheme = 'standard' | 'night' | 'urgent';

export interface RoadNotice {
  id: string;
  refNo: string;
  tajukKerja: string;
  jenisKerja: string;
  jenisPenutupan: string;
  noLaluan: string;
  namaLaluan: string;
  seksyen: string;
  landmark: string;
  lat: number;
  lng: number;
  tarikhMula: string;
  tarikhSiap: string;
  masa: string;
  namaKonsesi: string;
  telKonsesi: string;
  status: NoticeStatus;
  ulasanJkr: string;
  pegawaiJkr: string;
  jawatanPegawai: string;
  tarikhKelulusan: string;
  posterLayout: PosterLayout;
  themeVariant: PosterTheme;
  createdAt: string;
  updatedAt: string;
}

export interface PDRoadPreset {
  noLaluan: string;
  namaLaluan: string;
  seksyen: string;
  landmark: string;
  lat: number;
  lng: number;
  kategori: 'Persekutuan' | 'Negeri';
  panjangKm?: number;
}
