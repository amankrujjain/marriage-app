export type BlogTablePresetId =
  | 'plain'
  | 'striped'
  | 'maroon'
  | 'bordered'
  | 'compact';

export type BlogTablePreset = {
  id: BlogTablePresetId;
  label: string;
  className: string;
};

export const BLOG_TABLE_PRESETS: BlogTablePreset[] = [
  { id: 'plain', label: 'Plain', className: 'blog-table blog-table--plain' },
  { id: 'striped', label: 'Striped', className: 'blog-table blog-table--striped' },
  {
    id: 'maroon',
    label: 'Maroon header',
    className: 'blog-table blog-table--maroon',
  },
  {
    id: 'bordered',
    label: 'Bordered',
    className: 'blog-table blog-table--bordered',
  },
  {
    id: 'compact',
    label: 'Compact',
    className: 'blog-table blog-table--compact',
  },
];

export function buildSampleTableHtml(className: string): string {
  return `<table class="${className}">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Row 1</td>
      <td>—</td>
      <td>—</td>
    </tr>
    <tr>
      <td>Row 2</td>
      <td>—</td>
      <td>—</td>
    </tr>
    <tr>
      <td>Row 3</td>
      <td>—</td>
      <td>—</td>
    </tr>
  </tbody>
</table><p></p>`;
}
