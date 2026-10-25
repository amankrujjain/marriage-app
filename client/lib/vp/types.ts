export type VpSample = Record<string, unknown>;

export type VpTemplate = {
  slug: string;
  name: string;
  tier: string;
  cat: string;
  faith?: string[];
  community?: string;
  blurb: string;
  theme: { bg: string; accent: string; gold: string; ink: string };
  layout?: string;
  photo?: string;
  tags?: string[];
};

export type VpApi = {
  TEMPLATES: VpTemplate[];
  sampleShort: VpSample;
  sampleLong: VpSample;
  sampleMale: VpSample;
  sampleFor?: (slug: string, kind?: string) => VpSample;
  ensureSprite: () => void;
  thumb: (
    host: HTMLElement,
    data: VpSample,
    slug: string,
    opts?: { credit?: boolean; lang?: string },
  ) => HTMLElement;
  update: (
    host: HTMLElement,
    data: VpSample,
    slug: string,
    opts?: { credit?: boolean; lang?: string },
  ) => { bd: HTMLElement; fit: { d: number; over: boolean; state: string } };
  fit: (bd: HTMLElement) => { d: number; over: boolean; state: string };
  tpl: (slug: string) => VpTemplate;
  make: (
    data: VpSample,
    slug: string,
    opts?: { credit?: boolean; lang?: string },
  ) => HTMLElement;
  waCard: (
    data: VpSample,
    slug: string,
    opts?: { credit?: boolean; lang?: string },
  ) => HTMLElement;
};

declare global {
  interface Window {
    VP: VpApi;
  }
}

export {};
