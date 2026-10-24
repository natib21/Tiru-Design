import React from 'react';

export interface AuthLeftPanelProps {
  className?: string;
}

export const AuthLeftPanel: React.FC<AuthLeftPanelProps> = ({ className = '' }) => {
  return (
    <div className={`hidden lg:flex flex-1 flex-col justify-between py-6 pr-8 ${className}`}>
      <div className="space-y-6">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#006399]">
          <span className="h-2 w-2 rounded-full bg-[#D97706]" aria-hidden="true" />
          ETHIOPIA&apos;S PREMIER CREATIVE WORKSPACE
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-5xl">
          Design authentically in <span className="text-[#006399]">Amharic</span> &amp; English.
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-base text-[#3F4851]">
          Join over 45,000 creators, print houses, and entrepreneurs crafting bespoke Meskel flyers,
          Enkutatash greetings, certificates, and social stories.
        </p>

        {/* Artboard Preview Mockup */}
        <div className="overflow-hidden rounded-xl border border-[#BEC7D3] bg-white shadow-md">
          {/* Mock Window Bar */}
          <div className="flex items-center justify-between border-b border-[#BEC7D3]/60 bg-[#F7F9FB] px-4 py-2.5 text-xs text-[#3F4851]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
              <span className="ml-2 font-mono text-[11px] text-[#3F4851]">
                enkutatash_2018_invitation_gold.artboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                CMYK 300 DPI
              </span>
              <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#006399]">
                Ge&apos;ez Native
              </span>
            </div>
          </div>

          {/* Artboard Content */}
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(#FACC15_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                  Format: A5 Print-Ready
                </span>
                <p className="mt-2 text-xl font-bold tracking-tight text-amber-200">
                  እንኳን አደረሳችሁ — 2018 Special Edition
                </p>
                <p className="text-sm font-medium text-amber-100/90">
                  Happy Enkutatash New Year • September 11
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-200/80">Ethiopian Cultural Suite</span>
                <span className="rounded bg-white/20 px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm">
                  Abyssinica SIL • 42pt
                </span>
              </div>
            </div>
          </div>

          {/* Artboard Footer */}
          <div className="flex items-center justify-between border-t border-[#BEC7D3]/60 bg-[#F7F9FB] px-4 py-2 text-[11px] text-[#3F4851]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Auto-synced to Cloud
              </span>
              <span>Zoom: 100%</span>
            </div>
            <span className="font-medium text-[#006399]">Tibeb Vector Library Active</span>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-lg border border-[#BEC7D3] bg-white px-3 py-1.5 text-[#3F4851] shadow-xs">
            🔤 35+ Ge&apos;ez Fonts
          </span>
          <span className="rounded-lg border border-[#BEC7D3] bg-white px-3 py-1.5 text-[#3F4851] shadow-xs">
            📖 Localized Packs
          </span>
          <span className="rounded-lg border border-[#BEC7D3] bg-white px-3 py-1.5 text-[#3F4851] shadow-xs">
            🛡️ Commercial License
          </span>
        </div>
      </div>

      {/* Social Proof Footer */}
      <div className="mt-8 flex items-center gap-3 border-t border-[#BEC7D3]/40 pt-4 text-xs text-[#3F4851]">
        <div className="flex -space-x-1.5 overflow-hidden">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#006399] text-[10px] font-bold text-white ring-2 ring-white">
            AD
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D97706] text-[10px] font-bold text-white ring-2 ring-white">
            HW
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white">
            DD
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
            DC
          </span>
        </div>
        <p>
          Joined by design teams across <strong className="font-semibold text-[#0f172a]">Addis Ababa, Hawassa, Dire Dawa &amp; Washington DC</strong>.
        </p>
      </div>
    </div>
  );
};

export default AuthLeftPanel;
