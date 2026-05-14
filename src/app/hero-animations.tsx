"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroAnimations({ version }: { version: string }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <div className="text-right">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          className="font-outfit text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-white">Pit</span><span className="text-teal-400">Pilot</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
          className="mt-5 text-base leading-relaxed text-slate-400"
        >
          A mobile, offline friendly, real-time<br />
          strategic scouting platform for FRC teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
          className="mt-8 flex items-center justify-end gap-4"
        >
          <span className="font-mono text-xs text-slate-500">v{version}</span>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-300 to-cyan-300 px-5 py-2 text-sm font-semibold text-[#042116] shadow-[0_0_28px_-12px_rgba(67,217,162,0.8)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-110"
          >
            Start free
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
        className="relative mx-auto w-full"
      >
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src="/banner.png"
            alt="PitPilot dashboard"
            width={965}
            height={650}
            className="w-full"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-40% to-[#03070a]" />
        </div>
      </motion.div>
    </div>
  );
}
