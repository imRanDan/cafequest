"use client"; //keep this for components to work

import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
