export default function Loading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <span 
          className="text-2xl font-bold tracking-wider"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          <span className="text-foreground">TECH</span>
          <span className="text-primary">VYRO</span>
        </span>
      </div>
    </main>
  );
}
