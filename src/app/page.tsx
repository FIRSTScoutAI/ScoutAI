import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import pkg from "../../package.json";
import { createClient as createAdminClient, type SupabaseClient } from "@supabase/supabase-js";
import { Check, GaugeCircle } from "lucide-react";
import { HeroAnimations } from "./hero-animations";
import { Navbar } from "@/components/navbar";
import { LiveStats } from "./live-stats";
import { DashboardPreview } from "./dashboard-preview";
import { AIBriefingPreview } from "./ai-briefing-preview";
import Image from "next/image";
// import { Testimonials } from "./testimonials";
import { createClient } from "@/lib/supabase/server";
import { MotionSection } from "@/components/motion-section";
import { SiteFooter } from "@/components/site-footer";
import type { Database as SupabaseDatabase } from "@/types/supabase";

type Step = {
  label: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    label: "Step 01",
    title: "Capture",
    description:
      "Your scouts fill out a quick match note on their phones after each round. Takes about a minute.",
  },
  {
    label: "Step 02",
    title: "Contextualize",
    description:
      "We pull in your event's TBA and Statbotics data and stitch it together with what your scouts saw.",
  },
  {
    label: "Step 03",
    title: "Execute",
    description:
      "Before your next match, your drive team gets a brief with alliance suggestions and strategy notes. No more scrambling.",
  },
];

async function getStats() {
  noStore();

  async function countFrom(client: SupabaseClient<SupabaseDatabase>) {
    const [orgsRes, entriesRes, matchesRes, scoutsRes] = await Promise.all([
      client.from("organizations").select("id", { count: "exact", head: true }),
      client.from("scouting_entries").select("id", { count: "exact", head: true }),
      client.from("matches").select("id", { count: "exact", head: true }),
      client.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    if (orgsRes.error || entriesRes.error || matchesRes.error || scoutsRes.error) {
      return null;
    }

    return {
      teams: orgsRes.count ?? 0,
      entries: entriesRes.count ?? 0,
      matches: matchesRes.count ?? 0,
      scouts: scoutsRes.count ?? 0,
    };
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const admin = createAdminClient<SupabaseDatabase>(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const globalStats = await countFrom(admin);
      if (globalStats) {
        return globalStats;
      }
    }

    const supabase = await createClient();
    const scopedStats = await countFrom(supabase);
    if (scopedStats) {
      return scopedStats;
    }

    return { teams: 0, entries: 0, matches: 0, scouts: 0 };
  } catch {
    return { teams: 0, entries: 0, matches: 0, scouts: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="landing-noise min-h-screen overflow-x-clip bg-[#03070a] text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-teal-400/7 blur-[160px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-28 lg:py-32">
          <HeroAnimations version={pkg.version} />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#03070a] to-transparent" />
      </section>

      {/* <LiveStats
        teams={stats.teams}
        entries={stats.entries}
        matches={stats.matches}
        scouts={stats.scouts}
      /> */}

      <MotionSection id="problem" className="relative py-24">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="section-label">why though</p>
            <h2 className="font-outfit mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Give your scouts somewhere to start.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-400 md:text-lg">
              Most teams cobble something together every season. PitPilot is ready out of the box so your scouts can just... scout!
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1115]/85 backdrop-blur-xl shadow-[0_0_40px_-18px_rgba(67,217,162,0.35)]">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">Tool</th>
                  <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">What it does</th>
                  <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">What it misses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="transition-colors duration-300 hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-semibold text-white">TBA / Statbotics</td>
                  <td className="px-6 py-4 text-slate-300">Publishes schedule, results, EPA stats, rankings.</td>
                  <td className="px-6 py-4 text-slate-500">Doesn&apos;t turn any of that into a match plan.</td>
                </tr>
                <tr className="transition-colors duration-300 hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-semibold text-white">Forms / sheets workflows</td>
                  <td className="px-6 py-4 text-slate-300">Collects your team&apos;s match observations.</td>
                  <td className="px-6 py-4 text-slate-500">Someone still has to make sense of it all under time pressure.</td>
                </tr>
                <tr className="transition-colors duration-300 hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-semibold text-white">PitPilot</td>
                  <td className="px-6 py-4 text-slate-300">Combines both with even more features!</td>
                  <td className="px-6 py-4 text-slate-500">Still needs your scouts to actually watch the matches :)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="how-it-works" className="relative py-24">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="font-outfit text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              It&apos;s pretty straightforward
            </h2>
          </div>

          <div className="relative mt-14 space-y-5 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
            <div className="pointer-events-none absolute left-5 top-8 hidden h-[calc(100%-80px)] w-px bg-gradient-to-b from-teal-400/60 to-transparent md:hidden" />
            {STEPS.map((step, index) => (
              <article
                key={step.label}
                className="relative rounded-2xl border border-white/10 bg-[#0f1115]/80 p-6 backdrop-blur-md shadow-[0_0_28px_-18px_rgba(67,217,162,0.35)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-teal-300/35 hover:shadow-[0_0_36px_-16px_rgba(67,217,162,0.58)]"
              >
                <div className="mb-4 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/15 px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200">
                  {step.label}
                </div>
                <h3 className="font-outfit text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.description}</p>
                <div className="pointer-events-none absolute right-4 top-4 font-mono text-xs text-slate-600">
                  0{index + 1}
                </div>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <DashboardPreview />
      <AIBriefingPreview />

      {/* <Testimonials /> */}

      <MotionSection id="pricing" className="relative py-24">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="section-label">Pricing</p>
            <h2 className="font-outfit mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Free forever, pretty much
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 md:text-base">
              While being a supporter won&apos;t give you any big benefits, as all our features are free forever, you get to help cover the hosting cost to make sure it&apos;ll remain free forever :)
            </p>
          </div>

          <div className="mt-14 grid items-stretch justify-items-center gap-4 md:grid-cols-2">
            <div className="flex h-full w-full max-w-[360px] flex-col rounded-2xl border border-white/10 bg-[#0f1115]/80 p-8 backdrop-blur-md transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-teal-300/30 hover:shadow-[0_0_34px_-18px_rgba(67,217,162,0.34)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Free</p>
              <p className="font-outfit mt-4 text-5xl font-bold">$0</p>
              <p className="mt-1 text-sm text-slate-500">and always will be</p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="flex-1 space-y-3 text-sm text-slate-300">
                <PricingItem included>Unlimited scouting entries</PricingItem>
                <PricingItem included>TBA + Statbotics sync</PricingItem>
                <PricingItem included>Pre-match briefs + pick optimizer</PricingItem>
                <PricingItem included>Assignment workflows</PricingItem>
                <PricingItem included>Unlimited prompts with usage limits</PricingItem>
              </ul>
              <Link
                href="/signup"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-teal-300/45 hover:bg-teal-300/10"
              >
                Start Free
              </Link>
            </div>

            <div className="relative flex h-full w-full max-w-[360px] flex-col rounded-2xl border border-teal-300/35 bg-gradient-to-b from-teal-300/15 to-transparent p-8 shadow-[0_0_40px_-20px_rgba(67,217,162,0.55)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-teal-200/60 hover:shadow-[0_0_44px_-18px_rgba(67,217,162,0.78)]">
              <div className="absolute -top-3 left-6 rounded-full border border-teal-200/70 bg-teal-300 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-[#042116] shadow-[0_8px_18px_-10px_rgba(67,217,162,0.8)]">
                Support us
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-teal-200">Supporter</p>
              <p className="font-outfit mt-4 text-5xl font-bold">$5.99</p>
              <p className="mt-1 text-sm text-slate-300">per team / month</p>
              <div className="my-6 h-px bg-teal-200/25" />
              <ul className="flex-1 space-y-3 text-sm text-slate-100">
                <PricingItem included>Everything in Free</PricingItem>
                <PricingItem included>Higher AI usage limits</PricingItem>
                <PricingItem included>Priority model capacity</PricingItem>
                <PricingItem included>Helps us keep the lights on</PricingItem>
              </ul>
              <Link
                href="/signup"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-[#042116] shadow-[0_0_28px_-12px_rgba(67,217,162,0.8)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-110 hover:shadow-[0_0_34px_-10px_rgba(67,217,162,0.88)]"
              >
                Upgrade to Supporter
              </Link>
            </div>
          </div>
        </div>
      </MotionSection>

      <SiteFooter />
    </div>
  );
}

function PricingItem({
  included,
  children,
}: {
  included?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      {included ? (
        <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-300/20 text-teal-200">
          <Check className="h-3 w-3" />
        </span>
      ) : (
        <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-700/30 text-slate-500">
          <GaugeCircle className="h-3 w-3" />
        </span>
      )}
      <span>{children}</span>
    </li>
  );
}
