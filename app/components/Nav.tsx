"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/chatbot", label: "Chatbot" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="bg-gray-800 text-white p-4">
      <div className="max-w-3xl mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">
          Portfolio
        </Link>
        <div className="space-x-4">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "underline font-semibold" : "hover:underline"}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
