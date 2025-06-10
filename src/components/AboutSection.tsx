"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import frogGif from "../../public/images/frog.gif";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 bg-gradient-to-br from-white/50 to-green-100 px-6 scroll-mt-[4rem]"
    >
      <div className="container mx-auto max-w-3xl text-center space-y-12">
        {/* Section heading */}
        <motion.h2
          className="text-4xl md:text-7xl sharetech text-green-800 text-shadow-2xs"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The Story Behind NoteLeap
          <div className="justify-center flex flex-col md:flex-row items-center md:items-start mt-8 mb-[-30]">
            {/* Frog GIF on left with lily-pad line */}
            <div className="relative flex-shrink-0">
              <Image
                src={frogGif}
                alt="Happy frog mascot"
                width={40}
                height={40}
                className="rounded-full z-99"
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-[-5] w-20 h-2 bg-green-400 rounded-full" />
            </div>
          </div>
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          NoteLeap was born from a passion for speed, precision, and ease of
          use. What started as a simple idea to navigate between notes with a
          single keystroke has grown into a seamless tool for anyone who needs
          instant access to their ideas. Whether you’re presenting,
          interviewing, or brainstorming.
        </motion.p>

        {/* Feature pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Speed",
              desc: "Fly through your notes without missing a beat. Perfect for live presentations and rapid-fire interviews.",
            },
            {
              title: "Precision",
              desc: "Assign keys and tags to organize thoughts exactly how you need them, eliminating the hunt for stray ideas.",
            },
            {
              title: "Simplicity",
              desc: "A clean interface and intuitive controls mean you focus on your content, not the tool.",
            },
          ].map((pill, idx) => (
            <motion.div
              key={pill.title}
              className="p-6 bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2 * idx,
                duration: 0.6,
                type: "spring",
                stiffness: 250,
              }}
            >
              <h3 className="text-2xl roboto text-green-700 mb-2">
                {pill.title}
              </h3>
              <p className="text-gray-700 text-shadow-xs">{pill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
