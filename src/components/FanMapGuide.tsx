/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, MapPin } from "lucide-react";

interface FanMapGuideProps {
  activeGateTab: string;
  onActiveGateTabChange: (tab: string) => void;
}

export function FanMapGuide({ activeGateTab, onActiveGateTabChange }: FanMapGuideProps) {
  return (
    <div id="venue-map-guide" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg text-left">
      <h3 className="font-semibold text-white font-display flex items-center gap-2 mb-4">
        <Compass className="h-5 w-5 text-blue-400" />
        Stadium Entry & Transport Map
      </h3>

      {/* Gate Map Selector Tabs */}
      <div className="flex border-b border-white/10 mb-4 overflow-x-auto gap-2">
        <button
          onClick={() => onActiveGateTabChange("Gate B (North - Parking)")}
          className={`pb-2 text-xs font-medium border-b-2 px-1 transition shrink-0 ${
            activeGateTab === "Gate B (North - Parking)" 
              ? "border-emerald-500 text-white font-bold" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Gate B (North)
        </button>
        <button
          onClick={() => onActiveGateTabChange("Gate A (East - Train)")}
          className={`pb-2 text-xs font-medium border-b-2 px-1 transition shrink-0 ${
            activeGateTab === "Gate A (East - Train)" 
              ? "border-emerald-500 text-white font-bold" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Gate A (East)
        </button>
        <button
          onClick={() => onActiveGateTabChange("Gate D (South - Buses)")}
          className={`pb-2 text-xs font-medium border-b-2 px-1 transition shrink-0 ${
            activeGateTab === "Gate D (South - Buses)" 
              ? "border-emerald-500 text-white font-bold" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Gate D (South)
        </button>
      </div>

      {activeGateTab === "Gate B (North - Parking)" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-300">
            Ideal entry gate for fans arriving by general parking lot passenger shuttles or rideshare vehicles.
          </p>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>Parking Shuttle Drops (Lot G & F)</span>
            </div>
            <p className="text-slate-400">Wait times are currently longer at Gate B. Security clear-bag protocol is enforced strictly here.</p>
            <ul className="list-disc list-inside mt-1 flex flex-col gap-1 text-[11px] text-slate-300 font-medium">
              <li>Walk towards the giant North plaza arch.</li>
              <li>Prepare clear-bags and mobile barcode tickets prior to queue entry.</li>
              <li>Accessibility Support desk is available inside Gate B.</li>
            </ul>
          </div>
        </div>
      )}

      {activeGateTab === "Gate A (East - Train)" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-300">
            Serves direct train commuters arriving on the NJ Transit train link from Secaucus Junction. High pre-match volume.
          </p>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>Meadowlands Rail Station</span>
            </div>
            <p className="text-slate-400">Very short walking distance (under 3 minutes) from station exit platform to security lanes.</p>
            <ul className="list-disc list-inside mt-1 flex flex-col gap-1 text-[11px] text-slate-300 font-medium">
              <li>Arrive early to avoid massive pre-match surge.</li>
              <li>Follow designated stanchioned walkways.</li>
              <li>Ramp access is available for wheelchairs.</li>
            </ul>
          </div>
        </div>
      )}

      {activeGateTab === "Gate D (South - Buses)" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-300">
            Serves organized coach tours, official supporter bus lines, and long-distance city shuttle buses.
          </p>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>South Coach Loop Plaza</span>
            </div>
            <p className="text-slate-400">Fast processing with dedicated clear-bag inspection lanes.</p>
            <ul className="list-disc list-inside mt-1 flex flex-col gap-1 text-[11px] text-slate-300 font-medium">
              <li>Check bus parking bay number for return.</li>
              <li>Support volunteers available with translation megaphones.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Permitted items visual quick notes */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-300">
          <span className="font-bold text-emerald-400 block text-[11px] mb-1">✓ PERMITTED BAGS</span>
          <p className="text-[10px] text-emerald-200">Clear plastic, vinyl, or PVC bags not exceeding 12" x 6" x 12". Small clutches.</p>
        </div>
        <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-300">
          <span className="font-bold text-rose-400 block text-[11px] mb-1">✗ PROHIBITED</span>
          <p className="text-[10px] text-rose-200">Backpacks, camera cases, luggage, standard umbrellas, large banners, noisemakers.</p>
        </div>
      </div>
    </div>
  );
}
