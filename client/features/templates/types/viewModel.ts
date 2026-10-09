export interface BiodataFieldRow {
  key: string;
  label: string;
  value: string;
}

export interface BiodataSectionView {
  id: string;
  title: string;
  rows: BiodataFieldRow[];
}

export interface BiodataViewModel {
  fullName: string;
  photoUrl?: string;
  sections: BiodataSectionView[];
}
