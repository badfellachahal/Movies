'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/lib/tmdb';
import { MovieRow } from './movie-row';
import { MovieCard } from './movie-card';

interface Genre {
  id: number;
  name: string;
}

interface InitialRow {
  title: string;
  movies: Movie[];
}

interface GenreFilterProps {
  genres: Genre[];
  initialRows: InitialRow[];
  type: 'movie' | 'tv';
}

export function GenreFilter({ genres, initialRows, type }: GenreFilterProps) {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pillsRef = useRef<HTMLDivElement>(null);

  const scrollPills = (dir: 'left' | 'right') => {
    if (!pillsRef.current) return;
    pillsRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  const handleGenreSelect = async (genreId: number | null) => {
    setActiveGenre(genreId);
    setCurrentPage(1);
    setTotalPages(1);
    if (genreId === null) {
      setFilteredMovies([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/genre?genreId=${genreId}&type=${type}&page=1`);
      const data = await res.json();
      setFilteredMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch {
      setFilteredMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!activeGenre || isLoadingMore) return;
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/genre?genreId=${activeGenre}&type=${type}&page=${nextPage}`);
      const data = await res.json();
      setFilteredMovies(prev => [...prev, ...(data.results || [])]);
      setCurrentPage(nextPage);
      setTotalPages(data.total_pages || totalPages);
    } catch {
      // ignore
    } finally {
      setIsLoadingMore(false);
    }
  };

  const activeGenreName = genres.find(g => g.id === activeGenre)?.name;
  const hasMore = activeGenre !== null && currentPage < Math.min(totalPages, 10);

  return (
    <div>
      <div className="relative px-4 md:px-12 mb-4 md:mb-6">
        <button
          onClick={() => scrollPills('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-muted transition-colors md:left-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={pillsRef}
          className="flex gap-2 overflow-x-auto py-1 mx-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => handleGenreSelect(null)}
            className={cn(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
              activeGenre === null
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
            )}
          >
            All
          </button>
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className={cn(
                'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                activeGenre === genre.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                  : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollPills('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-muted transition-colors md:right-8"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {activeGenre !== null ? (
        <div className="min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredMovies.length > 0 ? (
            <>
              <div className="px-4 md:px-8 mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  {activeGenreName}
                  <span className="text-white/40 text-sm font-normal ml-2">{filteredMovies.length} titles</span>
                </h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3 px-4 md:px-8">
                {filteredMovies.map((movie, i) => (
                  <MovieCard key={`${movie.id}-${i}`} movie={{ ...movie, media_type: movie.media_type || type }} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8 pb-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-full text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              No results found for this genre.
            </div>
          )}
        </div>
      ) : (
        initialRows.map(row => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            mediaType={type}
          />
        ))
      )}
    </div>
  );
}
