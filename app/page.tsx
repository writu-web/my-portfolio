export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-3xl mx-auto py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">Welcome to My Portfolio</h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Explore my work and get to know more about me.
        </p>
      </main>
    </div>
  );
}