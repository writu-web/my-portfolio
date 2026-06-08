import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | My Portfolio",
  description: "Get in touch with me",
};

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-3xl mx-auto py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">
          Contact
        </h1>
        <ContactForm />
        <p className="mt-8 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Get in touch with me at email@example.com or through my social media.
        </p>
      </main>
    </div>
  );
}
