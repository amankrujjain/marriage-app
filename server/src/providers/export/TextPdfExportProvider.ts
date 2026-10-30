import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ExportFormat, type BiodataContent } from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import type { ExportArtifact } from './ExportProvider';
import {
  buildBiodataPlainSections,
  type DocumentExtraSection,
} from './buildBiodataPlainSections';

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 48;

/** Helvetica / WinAnsi cannot encode Devanagari and other non-Latin scripts. */
function isWinAnsiEncodable(text: string): boolean {
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i);
    if (cp === undefined) return false;
    // WinAnsi is a single-byte Latin set; anything above U+00FF needs another font.
    if (cp > 0xff) return false;
    i += cp > 0xffff ? 2 : 1;
  }
  return true;
}

function collectText(input: {
  content: BiodataContent;
  title?: string;
  extraSections?: DocumentExtraSection[];
}): string[] {
  const parts = [input.title?.trim() || 'Marriage biodata'];
  for (const section of buildBiodataPlainSections(
    input.content,
    input.extraSections,
  )) {
    parts.push(section.title, ...section.lines);
  }
  return parts;
}

/** Selectable-text A4 PDF from biodata fields (not a screenshot). */
export async function createTextPdf(input: {
  content: BiodataContent;
  title?: string;
  watermark?: boolean;
  extraSections?: DocumentExtraSection[];
}): Promise<ExportArtifact> {
  const texts = collectText(input);
  if (!texts.every(isWinAnsiEncodable)) {
    throw new BadRequestError(
      'Text PDF does not support this script; use image PDF export',
      'UNSUPPORTED_SCRIPT',
    );
  }

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

  for (const section of buildBiodataPlainSections(
    input.content,
    input.extraSections,
  )) {
    y -= 6;
    draw(section.title, 13, true);
    for (const row of section.lines) {
      draw(row, 11);
    }
  }

  if (input.watermark) {
    const markColor = rgb(0.45, 0.35, 0.35);
    for (const p of pdf.getPages()) {
      p.drawText('marriagebio.in', {
        x: A4_W - MARGIN - 90,
        y: 24,
        size: 10,
        font,
        color: markColor,
      });
    }
  }

  const bytes = await pdf.save();
  return {
    buffer: Buffer.from(bytes),
    mimeType: 'application/pdf',
    extension: 'pdf',
    format: ExportFormat.PDF,
  };
}
