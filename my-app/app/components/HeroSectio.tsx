import React from "react";
import { NavbarDemo } from "./Navbar";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-neutral-900">
      {/* 1. Navbar: Absolute Position at the TOP (Not Center) */}
      <div className="absolute top-0 left-0 w-full z-50 flex justify-center pt-8">
        <NavbarDemo />
      </div>

      {/* 2. Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-70" // Lower opacity for more visible text
          priority
        />
        {/* Lighter Gradient Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-black/30" />
      </div>

      <div className="relative z-20 flex h-full items-center justify-end px-6 md:px-20 max-w-7xl mx-auto"></div>
    </section>
  );
};

export default HeroSection;
