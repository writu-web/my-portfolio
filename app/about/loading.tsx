export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-3xl mx-auto py-32 px-16 bg-white dark:bg-black w-full">
        <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-4/6" />
        </div>
      </main>
    </div>
  );
}
