"use client";

import { MotionConfig } from "framer-motion";

// Semua animasi framer-motion ikut setelan "kurangi gerak" di perangkat buyer.
export default function GerakProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
