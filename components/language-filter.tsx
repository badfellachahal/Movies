'use client';

import { useState, useEffect } from 'react';
import { Globe, Loader2, ChevronDown, X } from 'lucide-react';
import { Movie } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { MovieCard } from './movie-card';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
];

interface LanguageFilterProps {
  type: 'movie' | 'tv';
}

export function LanguageFilter({ type }: LanguageFilterProps) {
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!activeLang) return;
    setLoading(true);
    fetch(`/api/genre?type=${type}&language=${activeLang}&page=1`)
      .then(r => r.json())
      .then(data => {
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
        setPage(1);
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [activeLang, type]);

  const loadMore = async () => {
    if (!activeLang || loadingMore) return;
    const next = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/genre?type=${type}&language=${activeLang}&page=${next}`);
      const data = await res.json();
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(next);
      setTotalPages(data.total_pages || totalPages);
    } finally {
      setLoadingMore(false);
    }
  };

  const activeLangInfo = LANGUAGES.find(l => l.code === activeLang);
  const hasMore = activeLang && page < Math.min(totalPages, 10);

  return (
    <div className="container mx-auto px-4 my-6">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h2 className="text-base md:text-lg font-semibold">Browse by Language</h2>

        {activeLang && (
          <button
            onClick={() => { setActiveLang(null); setMovies([]); }}
            className="ml-auto flex items-center gap-1 text-xs text-white/50 hover:text-white border border-white/20 px-2.5 py-1 rounded-full"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Language Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => setActiveLang(lang.code === activeLang ? null : lang.code)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
              activeLang === lang.code
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {activeLang && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{activeLangInfo?.flag}</span>
                <h3 className="font-medium text-white/80">{activeLangInfo?.name} Titles</h3>
                <span className="text-white/40 text-sm">{movies.length} results</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
                {movies.map((movie, i) => (
                  <MovieCard
                    key={`${movie.id}-${i}`}
                    movie={{ ...movie, media_type: movie.media_type || type }}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-full text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-white/40 py-12">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}
