/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar } from "lucide-react";
import { MatchCountdown } from "../types";

interface FanTicketCardProps {
  match: MatchCountdown;
}

export function FanTicketCard({ match }: FanTicketCardProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-800/80 to-slate-950/80 backdrop-blur-md border border-white/10 text-white rounded-2xl p-5 shadow-lg text-left flex flex-col justify-between h-48 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10 font-black text-8xl transform translate-x-4 translate-y-4 font-display pointer-events-none">
        2026
      </div>

      <div className="flex justify-between items-start z-10">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono tracking-widest font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            OFFICIAL MATCHDAY
          </span>
          <h3 className="font-bold text-lg font-display text-white mt-1.5">
            {match.fixture}
          </h3>
        </div>
        <Calendar className="h-6 w-6 text-emerald-400" />
      </div>

      <div className="z-10 mt-4 border-t border-white/10 pt-4 flex justify-between items-center">
        <div>
          <p className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider">STADIUM VENUE</p>
          <p className="text-xs font-semibold text-white">{match.stadium}</p>
        </div>
        <div>
          <p className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider text-right">INGRESS GATE</p>
          <p className="text-xs font-bold text-right text-emerald-400 font-display">GATE B RECOMMENDED</p>
        </div>
      </div>
    </div>
  );
}
