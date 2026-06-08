import { Suspense } from "react";
import type { Metadata } from "next";
import AboutData from "./AboutData";

export const metadata: Metadata = {
  title: "About | My Portfolio",
  description: "Learn about my experience and skills in UI development",
};

function DataSkeleton() {
  return (
    <div className="mt-8 space-y-4 animate-pulse">
      <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
      <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
      <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mt-4" />
      <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-700 rounded" />
    </div>
  );
}

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-3xl mx-auto py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">
          About Me
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          I am a passionate UI developer with 12 years of experience in HTML,
          CSS, JavaScript, TypeScript, React, and Next.js. I love creating
          beautiful and functional user interfaces.
        </p>
        <Suspense fallback={<DataSkeleton />}>
          <AboutData />
        </Suspense>
      </main>
    </div>
  );
}
