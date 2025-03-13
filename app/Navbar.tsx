'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 right-0 p-4 z-50">
      <div className="flex gap-4 bg-secondary/30 backdrop-blur-lg rounded-lg p-2 shadow-lg">
        <Link
          href="/"
          className={cn(
            "px-3 py-1 rounded-md text-sm transition-colors",
            pathname === "/" 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-secondary"
          )}
        >
          Home
        </Link>
        <Link
          href="/meme"
          className={cn(
            "px-3 py-1 rounded-md text-sm transition-colors",
            pathname === "/meme" 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-secondary"
          )}
        >
          Meme
        </Link>
      </div>
    </nav>
  );
}