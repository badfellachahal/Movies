import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 
          className="text-8xl md:text-9xl font-bold text-primary mb-4"
          style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
        >
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/movies">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4" />
              Browse Movies
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
