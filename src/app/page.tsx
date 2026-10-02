export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground mb-6">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        ACM BIT Mesra Rebuild · System Bootstrapped
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
        Build. Compete. Create.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground text-sm sm:text-base">
        ACM Student&apos;s Chapter, Birla Institute of Technology, Mesra. Empowering computing, algorithmic mastery, and collaborative engineering.
      </p>
    </main>
  );
}
