import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";

interface AccountTopBarProps {
  userName: string;
  points: number;
}

export function AccountTopBar({ userName, points }: AccountTopBarProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link
        href="/shop"
        className="font-inter text-[10px] font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1.5 uppercase tracking-widest transition-colors shrink-0"
      >
        <ArrowLeft size={12} />
        Back to Store
      </Link>

      <div className="inline-flex items-center gap-2 sm:gap-3 bg-black rounded-2xl pl-2 pr-3 sm:pr-5 py-1.5 sm:py-2 shadow-sm max-w-full">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center shrink-0 text-gray-900 font-inter font-bold text-base sm:text-lg">
          {initial}
        </div>
        <div className="hidden sm:flex flex-col min-w-0">
          <span className="font-inter text-white font-bold text-sm uppercase tracking-wide leading-none truncate max-w-[140px]">
            {userName}
          </span>
          <span className="font-inter text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
            Member
          </span>
        </div>

        <div className="hidden sm:block w-px h-8 bg-white/10 mx-1" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Coins size={16} className="text-indigo-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-inter text-white font-bold text-xs sm:text-sm leading-none">
              {Number(points).toFixed(2)}
            </span>
            <span className="font-inter text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1 whitespace-nowrap">
              PB Points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
