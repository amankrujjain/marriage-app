import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ExportFormat, type BiodataContent } from '@marriage/shared';
import type { ExportArtifact } from './ExportProvider';
import { buildBiodataPlainSections } from './buildBiodataPlainSections';

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 48;

/** Selectable-text A4 PDF from biodata fields (not a screenshot). */
export async function createTextPdf(input: {
  content: BiodataContent;
  title?: string;
  watermark?: boolean;
}): Promise<ExportArtifact> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([A4_W, A4_H]);
  let y = A4_H - MARGIN;

  const draw = (text: string, size: number, useBold = false) => {
    const f = useBold ? bold : font;
    const height = size + 6;
    if (y - height < MARGIN) {
      page = pdf.addPage([A4_W, A4_H]);
      y = A4_H - MARGIN;
    }
    page.drawText(text.slice(0, 110), {
      x: MARGIN,
      y: y - size,
      size,
      font: f,
      color: rgb(0.15, 0.08, 0.1),
    });
    y -= height;
  };

  draw(input.title?.trim() || 'Marriage biodata', 18, true);
  y -= 8;

  for (const section of buildBiodataPlainSections(input.content)) {
    y -= 6;
    draw(section.title, 13, true);
    for (const row of section.lines) {
      draw(row, 11);
    }
  }

  if (input.watermark) {
    page.drawText('marriagebio.in', {
      x: A4_W - MARGIN - 90,
      y: 24,
      size: 10,
      font,
      color: rgb(0.45, 0.35, 0.35),
    });
  }

  const bytes = await pdf.save();
  return {
    buffer: Buffer.from(bytes),
    mimeType: 'application/pdf',
    extension: 'pdf',
    format: ExportFormat.PDF,
  };
}
