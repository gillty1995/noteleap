"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import featureBg from "../../public/images/feature-bg.jpg";

interface FeaturesSectionProps {
  onLearnMore: (index: number) => void;
}

const features = [
  {
    title: "Keyboard Navigation",
    desc: "Press 1, 2, a, b… to jump straight to any note with zero friction.",
  },
  {
    title: "Tag Filtering",
    desc: "Filter notes by tags like tech, recipes, or interview prep on the fly.",
  },
  {
    title: "Session Groups",
    desc: "Keep related notes together in sessions for focused review.",
  },
];

export default function FeaturesSection({ onLearnMore }: FeaturesSectionProps) {
  return (
    <section
      id="features"
      className="relative h-screen scroll-mt-[4rem] overflow-hidden"
    >
      {/* Blurred background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={featureBg}
          alt="Features background"
          fill
          className="object-cover blur-2xl opacity-30"
        />
      </div>

      {/* Content wrapper: full height flex */}
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-7xl text-gray-800 sharetech">
            Powerful Features
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Every tool you need to capture, organize, and recall your ideas —
            fast.
          </p>
        </div>

        {/* Slider: centered, with separators */}
        <div className="relative w-full flex items-center justify-center space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-none">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={
                `snap-center snap-always flex-shrink-0 w-[80vw] md:w-96 p-8 bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl ` +
                `border-r border-white/30 last:border-r-0`
              }
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <h3 className="text-4xl sharetech mb-3 text-black">{f.title}</h3>
              <p className="text-gray-800 mb-6">{f.desc}</p>
              <button
                className="px-5 py-2 bg-green-200/40 backdrop-blur-sm text-green-800 font-semibold shadow-md hover:shadow-lg cursor-pointer rounded-full hover:bg-green-200/60 transition"
                onClick={() => onLearnMore(i)}
              >
                Learn More
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
