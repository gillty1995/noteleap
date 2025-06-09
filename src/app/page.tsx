"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeatureSection";
import LearnMoreSection from "@/components/LearnMoreSection";
import AboutSection from "@/components/AboutSection";
import SignupSection from "@/components/SignupSection";
import Footer from "@/components/Footer";

import "./globals.css";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLearnMore = (i: number) => {
    setActiveIndex(i);
    // scroll to the LearnMoreSection
    document
      .getElementById("learn-more")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <FeaturesSection onLearnMore={handleLearnMore} />
        <LearnMoreSection
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />
        <AboutSection />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
