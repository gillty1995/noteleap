"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeatureSection";
import LearnMoreSection from "@/components/LearnMoreSection";
import AboutSection from "@/components/AboutSection";
import SignupSection from "@/components/SignupSection";
import SignInModal from "@/components/SignInModal";
import SignUpModal from "@/components/SignUpModal";
import Footer from "@/components/Footer";

import "./globals.css";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const params = useSearchParams();
  const errorParam = params?.get("error");
  const callbackUrlParam = params?.get("callbackUrl");

  const shouldShowSignIn = Boolean(errorParam || callbackUrlParam);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    setShowSignIn(Boolean(params?.get("error") || params?.get("callbackUrl")));
  }, [params]);

  const openSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };
  const openSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };
  const closeAll = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const handleLearnMore = (i: number) => {
    setActiveIndex(i);
    // scroll to the LearnMoreSection
    document
      .getElementById("learn-more")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar onSignInClick={openSignIn} />
      <SignInModal
        isOpen={showSignIn}
        onSignUp={openSignUp}
        onClose={() => setShowSignIn(false)}
      />
      <SignUpModal
        isOpen={showSignUp}
        onSignIn={openSignIn}
        onClose={closeAll}
      />
      <main className="pt-16">
        <Hero />
        <FeaturesSection onLearnMore={handleLearnMore} />
        <LearnMoreSection
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />
        <AboutSection />
        <SignupSection onSignUpClick={openSignUp} />
      </main>
      <Footer />
    </>
  );
}
