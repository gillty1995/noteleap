"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import NoteLeapLogo from "../../public/images/noteleaplogo.png";

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSignUp = () => {
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-[calc(100vh-4rem)] bg-gradient-to-br from-green-100 via-white to-white scroll-mt-[4rem] overflow-hidden"
    >
      <div className="container mx-auto h-full flex items-center justify-center gap-8 px-6 md:px-12 relative">
        {/* Logo with circular reflection */}
        <motion.div
          className="flex-shrink-0 -mt-16 md:-mt-24 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Main logo */}
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden bg-gray-200 shadow-2xl">
            <Image
              src={NoteLeapLogo}
              alt="NoteLeap Logo"
              width={384}
              height={384}
              className="object-cover"
            />
          </div>

          {/* Circular water-like reflection */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4">
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden">
              <motion.div
                className="w-full h-[20px] transform scale-y-[-1] blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Image
                  src={NoteLeapLogo}
                  alt="NoteLeap Logo Reflection"
                  width={384}
                  height={384}
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            </div>
          </div>
        </motion.div>

        {/* Text + CTAs */}
        <div className="max-w-lg">
          <motion.h1
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-4xl md:text-8xl sharetech mb-4 text-black text-left"
          >
            Leap from idea to idea
          </motion.h1>

          <motion.p
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg mb-6 text-black"
          >
            Capture and tag your ideas in an instant. With a single keystroke,
            breeze through your notes and recall exactly what you need.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex space-x-4"
          >
            <button
              className="px-6 py-3 bg-green-200/40 backdrop-blur-sm text-green-800 font-semibold rounded-full hover:bg-green-200/60 transition cursor-pointer shadow-md hover:shadow-xl"
              onClick={scrollToSignUp}
            >
              Get Started
            </button>
            <button
              className="px-6 py-3 bg-green-200/20 backdrop-blur-sm text-green-800 font-semibold rounded-full hover:bg-green-200/40 transition cursor-pointer shadow-md hover:shadow-xl"
              onClick={scrollToFeatures}
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bouncing down-arrow */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </section>
  );
}
