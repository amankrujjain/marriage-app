export function buildWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildBiodataShareText(params: {
  name: string;
  downloadUrl: string;
}): string {
  return [
    `Marriage biodata — ${params.name}`,
    '',
    'Created with MarriageBio',
    params.downloadUrl,
  ].join('\n');
}
