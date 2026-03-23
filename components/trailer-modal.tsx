'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export function TrailerModal({ videoKey, title, onClose }: TrailerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-5xl mx-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-white font-semibold text-lg truncate pr-4">{title} — Trailer</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
            aria-label="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
