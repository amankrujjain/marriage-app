'use client';

import {
  DEFAULT_BIODATA_BLESSING,
  DEFAULT_BIODATA_HEADER,
  DEFAULT_BIODATA_TAGLINE,
  DEFAULT_BIODATA_TITLE,
} from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchPresentation } from '../../store/biodataSlice';

export function EditorPresentationCard() {
  const dispatch = useAppDispatch();
  const headerLine = useAppSelector((state) => state.biodata.content.headerLine);
  const documentTitle = useAppSelector((state) => state.biodata.content.documentTitle);
  const tagline = useAppSelector((state) => state.biodata.content.tagline);
  const blessing = useAppSelector((state) => state.biodata.content.blessing);

  return (
    <details className="panel" open>
      <summary>
        <svg
          className="i"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M4 7h16M4 12h10M4 17h14" />
        </svg>
        Page text
      </summary>
      <div className="pb">
        <p className="note" style={{ margin: '0 0 4px' }}>
          Edit the words printed on the design. The layout and ornaments stay the same.
        </p>
        <div className="frow">
          <label htmlFor="vp-header">Header line</label>
          <input
            className="input"
            id="vp-header"
            value={headerLine ?? DEFAULT_BIODATA_HEADER}
            onChange={(e) => dispatch(patchPresentation({ headerLine: e.target.value }))}
          />
        </div>
        <div className="frow">
          <label htmlFor="vp-title">Title</label>
          <input
            className="input"
            id="vp-title"
            value={documentTitle ?? DEFAULT_BIODATA_TITLE}
            onChange={(e) => dispatch(patchPresentation({ documentTitle: e.target.value }))}
          />
        </div>
        <div className="frow">
          <label htmlFor="vp-tagline">Tagline</label>
          <input
            className="input"
            id="vp-tagline"
            value={tagline ?? DEFAULT_BIODATA_TAGLINE}
            onChange={(e) => dispatch(patchPresentation({ tagline: e.target.value }))}
          />
        </div>
        <div className="frow">
          <label htmlFor="vp-blessing">Footer line</label>
          <input
            className="input"
            id="vp-blessing"
            value={blessing ?? DEFAULT_BIODATA_BLESSING}
            onChange={(e) => dispatch(patchPresentation({ blessing: e.target.value }))}
          />
        </div>
      </div>
    </details>
  );
}
