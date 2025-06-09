"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-gray-200 py-10">
      <div className="container mx-auto flex flex-col md:flex-row items-start justify-between px-6 space-y-6 md:space-y-0">
        {/* Left: Copyright + Policy Links Stack */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <p className="text-sm">
            © {new Date().getFullYear()} NoteLeap. All rights reserved.
          </p>
          <Link href="/privacy" className="text-sm hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm hover:text-white transition">
            Terms of Service
          </Link>
        </div>

        {/* Right: External Site Icon */}
        <div className="flex items-center space-x-2 self-center md:self-end">
          <ExternalLink
            size={20}
            className="text-green-300 hover:text-green-100 transition"
          />
          <Link
            href="https://gillhermelin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-white transition"
          >
            gillhermelin.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
