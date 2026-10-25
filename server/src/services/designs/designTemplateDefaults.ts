import fs from 'fs';
import path from 'path';

export type DesignTemplateDefault = {
  slug: string;
  name: string;
  tier: 'Free' | 'Premium';
  cat: 'Traditional' | 'Royal' | 'Floral' | 'Modern';
  faith: string[];
  blurb: string;
  active: boolean;
};

function loadDefaults(): DesignTemplateDefault[] {
  const candidates = [
    path.resolve(process.cwd(), 'src/data/designTemplateDefaults.json'),
    path.resolve(process.cwd(), 'dist/data/designTemplateDefaults.json'),
    path.resolve(__dirname, '../../data/designTemplateDefaults.json'),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8')) as DesignTemplateDefault[];
    }
  }
  throw new Error('designTemplateDefaults.json not found');
}

export const DESIGN_TEMPLATE_DEFAULTS = loadDefaults();
