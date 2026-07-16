/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Clock, Activity } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { GateMetrics } from "../types";

interface GateTelemetryPanelProps {
  gates: GateMetrics[];
}

export function GateTelemetryPanel({ gates }: GateTelemetryPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Telemetry Chart Box */}
      <div id="wait-times-chart" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <h3 className="font-semibold text-white font-display">Gate Wait Times (Mins)</h3>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-semibold animate-pulse">
            ● LIVE UPDATES
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gates} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis 
                dataKey="name" 
                tickFormatter={(value) => value.split(" ")[1] || value} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(8px)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Bar dataKey="queueWait" radius={[4, 4, 0, 0]}>
                {gates.map((entry, index) => {
                  let color = "#3b82f6"; // blue
                  if (entry.status === "critical") color = "#f43f5e"; // rose
                  if (entry.status === "congested") color = "#f59e0b"; // amber
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gate Status List */}
      <div id="gate-telemetry-list" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white font-display flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Gate Ingress Telemetry
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {gates.map((gate) => (
            <div key={gate.name} className="p-3 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-white text-sm">{gate.name}</span>
                <span className={`text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full border ${
                  gate.status === "critical" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                  gate.status === "congested" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  gate.status === "moderate" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {gate.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-400 mb-2">
                <div>
                  <p className="text-[10px] text-slate-500">WAIT TIME</p>
                  <p className="font-semibold text-slate-200">{gate.queueWait} mins</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">FLOW RATE</p>
                  <p className="font-semibold text-slate-200">{gate.flowRate} fans/m</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">STAFF</p>
                  <p className="font-semibold text-slate-200">{gate.staffAssigned} on duty</p>
                </div>
              </div>

              {/* Capacity Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Capacity Utilization</span>
                  <span>{gate.capacityPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      gate.capacityPercent > 85 ? "bg-rose-500" :
                      gate.capacityPercent > 70 ? "bg-amber-500" : "bg-emerald-500"
                    }`} 
                    style={{ width: `${gate.capacityPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
