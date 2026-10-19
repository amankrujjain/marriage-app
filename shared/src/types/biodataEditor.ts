/** Editor accordion field persisted with each saved biodata. */
export interface BiodataEditorField {
  id: string;
  label: string;
  value: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  wide?: boolean;
  /** Dot path into biodata content, e.g. personal.fullName */
  sync?: string;
}

/** Editor accordion section persisted with each saved biodata. */
export interface BiodataEditorSection {
  id: string;
  title: string;
  blurb: string;
  fields: BiodataEditorField[];
  custom?: boolean;
}
