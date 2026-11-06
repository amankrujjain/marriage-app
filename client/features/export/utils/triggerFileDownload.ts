/**
 * Start a file download from a (possibly cross-origin) URL.
 * Relies on Content-Disposition: attachment from the signed R2 URL.
 */
export function triggerFileDownload(url: string, fileName: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'download';
  a.rel = 'noopener';
  a.target = '_blank';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
