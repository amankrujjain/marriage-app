import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { ExportFormat, type BiodataContent } from '@marriage/shared';
import type { ExportArtifact } from './ExportProvider';
import {
  buildBiodataPlainSections,
  type DocumentExtraSection,
} from './buildBiodataPlainSections';

const MAROON = '681421';
const INK = '2A1517';
const MUTED = '6B4A4E';
const RULE = 'D9CFC0';
const PAGE_W = 9026; // DXA ≈ A4 content width with margins
const LABEL_W = 2800;
const VALUE_W = PAGE_W - LABEL_W;

const noBorder = {
  style: BorderStyle.NONE,
  size: 0,
  color: 'FFFFFF',
};

const rowBorder = {
  top: noBorder,
  bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE },
  left: noBorder,
  right: noBorder,
};

function parseLabeledLine(line: string): { label: string; value: string } {
  const idx = line.indexOf(':');
  if (idx <= 0) return { label: '', value: line };
  return {
    label: line.slice(0, idx).trim(),
    value: line.slice(idx + 1).trim(),
  };
}

function fieldRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: LABEL_W, type: WidthType.DXA },
        borders: rowBorder,
        children: [
          new Paragraph({
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: label,
                bold: true,
                size: 20,
                color: MUTED,
                font: 'Calibri',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: VALUE_W, type: WidthType.DXA },
        borders: rowBorder,
        children: [
          new Paragraph({
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: value,
                size: 22,
                color: INK,
                font: 'Calibri',
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/** DOCX biodata: titled sections with label / value rows. */
export async function createDocx(input: {
  content: BiodataContent;
  title?: string;
  watermark?: boolean;
  extraSections?: DocumentExtraSection[];
}): Promise<ExportArtifact> {
  const children: Array<Paragraph | Table> = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: input.title?.trim() || 'Marriage biodata',
          bold: true,
          size: 36,
          color: MAROON,
          font: 'Georgia',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: 'MarriageBio',
          size: 18,
          color: MUTED,
          font: 'Calibri',
        }),
      ],
    }),
  ];

  for (const section of buildBiodataPlainSections(
    input.content,
    input.extraSections,
  )) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120 },
        children: [
          new TextRun({
            text: section.title,
            bold: true,
            size: 26,
            color: MAROON,
            font: 'Georgia',
          }),
        ],
      }),
    );

    const rows = section.lines.map((row) => {
      const { label, value } = parseLabeledLine(row);
      return fieldRow(label || 'Detail', value || row);
    });

    if (rows.length > 0) {
      children.push(
        new Table({
          width: { size: PAGE_W, type: WidthType.DXA },
          columnWidths: [LABEL_W, VALUE_W],
          rows,
        }),
      );
    }
  }

  if (input.watermark) {
    children.push(
      new Paragraph({
        spacing: { before: 480 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'Created with marriagebio.in',
            italics: true,
            size: 18,
            color: '888888',
            font: 'Calibri',
          }),
        ],
      }),
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });
  const buffer = await Packer.toBuffer(doc);

  return {
    buffer: Buffer.from(buffer),
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
    format: ExportFormat.DOCX,
  };
}
