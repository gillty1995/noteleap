"use client";

import { useState } from "react";

import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

import Image from "next/image";
import logo from "../../public/images/textlogo.png";

export default function Navbar({
  onSignInClick,
}: {
  onSignInClick: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-10 shadow-md">
      <div className="max-w-8xl mx-auto flex items-center justify-between p-4 pr-10 pl-10">
        {/* 1. Logo on the left */}
        <a href="/" className="flex items-center">
          <Image
            src={logo}
            alt="NoteLeap Logo"
            width={120}
            height={20}
            className="rounded-full object-cover"
          />
        </a>

        {/* 2. Group links + button on the right */}
        <div className="flex items-center space-x-6">
          <ul className="hidden md:flex space-x-6 text-black">
            {["features", "about", "signup"].map((section) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className="hover:text-green-700 transition-colors"
                >
                  {section[0].toUpperCase() + section.slice(1)}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={onSignInClick}
            className={`
                px-6 py-2 
                bg-gradient-to-r from-green-100/70 to-green-200/70 
                text-green-800 font-semibold 
                rounded-full 
                shadow-lg
                hover:from-green-100/90 hover:to-green-200/90 
                transition
                cursor-pointer
                `}
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
