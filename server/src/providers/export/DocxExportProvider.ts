import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from 'docx';
import { ExportFormat, type BiodataContent } from '@marriage/shared';
import type { ExportArtifact } from './ExportProvider';
import {
  buildBiodataPlainSections,
  type DocumentExtraSection,
} from './buildBiodataPlainSections';

/** DOCX biodata from structured fields. */
export async function createDocx(input: {
  content: BiodataContent;
  title?: string;
  watermark?: boolean;
  extraSections?: DocumentExtraSection[];
}): Promise<ExportArtifact> {
  const children: Paragraph[] = [
    new Paragraph({
      text: input.title?.trim() || 'Marriage biodata',
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  for (const section of buildBiodataPlainSections(
    input.content,
    input.extraSections,
  )) {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240 },
      }),
    );
    for (const row of section.lines) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: row, size: 22 })],
        }),
      );
    }
  }

  if (input.watermark) {
    children.push(
      new Paragraph({
        spacing: { before: 400 },
        children: [
          new TextRun({ text: 'marriagebio.in', italics: true, size: 18, color: '666666' }),
        ],
      }),
    );
  }

  const doc = new Document({
    sections: [{ children }],
  });
  const buffer = await Packer.toBuffer(doc);

  return {
    buffer: Buffer.from(buffer),
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
    format: ExportFormat.DOCX,
  };
}
