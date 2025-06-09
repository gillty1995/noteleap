"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import learnMoreBg from "../../public/images/learnmore-bg.png";

// Expanded feature descriptions with more in-depth points
const details = [
  {
    title: "Keyboard Navigation",
    description:
      "Navigate your entire note library without touching the mouse—perfect for speed and focus.",
    points: [
      "Assign numbers or letters to each note for instant access",
      "Press any assigned key to jump directly to that note",
      "Custom key bindings per session for personalized workflows",
      "Works offline—no network latency",
      "Minimal UI to eliminate distractions",
    ],
  },
  {
    title: "Tag Filtering",
    description:
      "Filter and combine tags in real time to zero in on exactly the notes you need.",
    points: [
      "Multiselect tags like react, recipes, or interview prep",
      "Live search-as-you-type across sessions and notes",
      "Combine filters with keyboard nav for surgical precision",
      "Color-coded tags for visual grouping",
      "Save common filter sets for one-click recall",
    ],
  },
  {
    title: "Session Groups",
    description:
      "Organize related notes into sessions—ideal for project planning or interview prep.",
    points: [
      "Create named sessions to group contextually similar notes",
      "Collapse or expand sessions for context control",
      "Navigate sessions with arrow keys or quick search",
      "Reorder sessions via drag-and-drop",
      "Archive completed sessions to keep your workspace clean",
    ],
  },
];

interface LearnMoreProps {
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export default function LearnMoreSection({
  activeIndex,
  onIndexChange,
}: LearnMoreProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasMounted = useRef(false);

  // Scroll into view when activeIndex changes (skip on first mount)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeIndex]);

  return (
    <section
      id="learn-more"
      ref={sectionRef}
      className="relative h-screen scroll-mt-[4rem] bg-learnMoreBg overflow-hidden flex items-center justify-center px-6"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={learnMoreBg}
          alt="Features background"
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto flex items-center justify-center h-full gap-12">
        {/* Left nav with enlarged selected title */}
        <nav className="w-[400px] flex flex-col justify-center space-y-8 ml-60">
          {details.map((d, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`transition-all ${
                i === activeIndex
                  ? "text-2xl md:text-5xl sharetech text-white"
                  : "text-lg md:text-2xl sharetech text-gray-200 hover:text-white hover:text-shadow-2xl"
              }`}
            >
              {d.title}
            </button>
          ))}
        </nav>

        {/* Card deck centered with stacking and size hierarchy */}
        <div className="relative flex-1 flex items-center justify-center mr-50">
          {details.map((d, i) => {
            const offset = i - activeIndex;
            const absOffset = Math.abs(offset);
            const scaleValue = 1 - absOffset * 0.1; // 1.0, 0.9, 0.8
            const opacityValue = 1 - absOffset * 0.3; // 1.0, 0.7, 0.4
            const x = offset * 60;
            const zIndex = details.length - absOffset; // Adjusted for better stacking

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{
                  opacity: opacityValue,
                  scale: scaleValue,
                  x,
                  filter: absOffset === 0 ? "none" : `blur(${4 * absOffset}px)`, // No blur for active card
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                style={{ zIndex }}
                className="absolute w-96 p-8 bg-white/90 border border-white/50 rounded-3xl shadow-xl cursor-pointer"
                onClick={() => onIndexChange(i)}
              >
                <h3 className="text-4xl sharetech mb-4 text-black ">
                  {d.title}
                </h3>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  {d.description}
                </p>
                <ul className="list-disc list-inside text-left text-gray-800 space-y-3">
                  {d.points.map((pt, idx) => (
                    <li key={idx} className="text-lg">
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
