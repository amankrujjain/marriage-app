'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  DEFAULT_PROFILE_PHOTO_FIT,
  type ProfilePhotoFit,
} from '@marriage/shared';
import { clampPhotoFit, photoFitImgStyle, resolvePhotoFit } from '../../utils/photoFit';

type PhotoAdjusterProps = {
  photoUrl: string;
  initialFit?: ProfilePhotoFit;
  onSave: (fit: ProfilePhotoFit) => void;
  onClose: () => void;
};

export function PhotoAdjuster({
  photoUrl,
  initialFit,
  onSave,
  onClose,
}: PhotoAdjusterProps) {
  const [fit, setFit] = useState<ProfilePhotoFit>(() => resolvePhotoFit(initialFit));
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: ProfilePhotoFit;
  } | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: fit,
      };
    },
    [fit],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const zoom = drag.origin.zoom;
    // Dragging the photo down/right should reveal more of the top/left (lower focal %).
    setFit(
      clampPhotoFit({
        x: drag.origin.x - (dx / rect.width) * (100 / zoom),
        y: drag.origin.y - (dy / rect.height) * (100 / zoom),
        zoom,
      }),
    );
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }, []);

  return (
    <div className="photo-adjuster" role="dialog" aria-modal="true" aria-labelledby="photo-adjuster-title">
      <button type="button" className="photo-adjuster-backdrop" aria-label="Close" onClick={onClose} />
      <div className="photo-adjuster-panel">
        <header className="photo-adjuster-head">
          <div>
            <h2 id="photo-adjuster-title">Adjust photo</h2>
            <p>Drag to move. Zoom out if the top of the head is clipped — the frame matches the A4 photo slot.</p>
          </div>
          <button type="button" className="photo-adjuster-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div
          ref={frameRef}
          className="photo-adjuster-frame"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" draggable={false} style={photoFitImgStyle(fit)} />
          <span className="photo-adjuster-hint">Drag to move</span>
        </div>

        <label className="photo-adjuster-zoom">
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.02}
            value={fit.zoom}
            onChange={(event) =>
              setFit((prev) =>
                clampPhotoFit({ ...prev, zoom: Number(event.target.value) }),
              )
            }
          />
          <span className="photo-adjuster-zoom-val">{fit.zoom.toFixed(2)}×</span>
        </label>

        <footer className="photo-adjuster-actions">
          <button
            type="button"
            className="editor-btn-ghost"
            onClick={() => setFit({ ...DEFAULT_PROFILE_PHOTO_FIT })}
          >
            Reset
          </button>
          <div className="photo-adjuster-actions-right">
            <button type="button" className="editor-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="editor-btn-outline"
              onClick={() => onSave(clampPhotoFit(fit))}
            >
              Save position
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
