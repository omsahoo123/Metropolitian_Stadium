/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, AlertCircle, CheckCircle2, ShieldAlert, Users, Volume2, Info } from "lucide-react";
import { Incident } from "../types";

interface IncidentGuidePanelProps {
  selectedIncident: Incident | null;
  incidentLoading: boolean;
  onGenerateAIIncidentGuide: (incident: Incident) => void;
  onResolveIncident: (incId: string) => void;
}

export function IncidentGuidePanel({
  selectedIncident,
  incidentLoading,
  onGenerateAIIncidentGuide,
  onResolveIncident,
}: IncidentGuidePanelProps) {
  return (
    <div id="incident-containment-details" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg text-left">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h3 className="font-semibold text-white font-display flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          AI Smart Incident Containment Guide
        </h3>
        {selectedIncident && (
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
            selectedIncident.status === "resolved" 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}>
            {selectedIncident.status}
          </span>
        )}
      </div>

      {selectedIncident ? (
        <div className="flex flex-col gap-4">
          {/* Header Description */}
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">STADIUM EVENT REPORT</p>
            <p className="text-xs text-white leading-relaxed font-sans">{selectedIncident.description}</p>
          </div>

          {selectedIncident.severity ? (
            <div className="flex flex-col gap-4 border-t border-white/5 pt-3.5">
              {/* Severity Evaluation */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">SECURITY ASSESSMENT</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 w-fit ${
                    selectedIncident.severity === "Critical" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    selectedIncident.severity === "High" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                    selectedIncident.severity === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                    <span>{selectedIncident.severity} Severity Threat</span>
                  </span>
                </div>
              </div>

              {/* Immediate Response Protocol */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">IMMEDIATE PROTOCOLS</span>
                <ul className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-0.5 leading-relaxed font-sans">
                  {selectedIncident.immediateActions?.map((action, idx) => (
                    <li key={idx} className="marker:text-blue-400 marker:font-bold">
                      <span className="ml-1.5 text-slate-300">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alert Stakeholders */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">ALERT STAKEHOLDERS</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.stakeholderAlerts?.map((st) => (
                    <span key={st} className="text-[9px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono border border-white/5">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dispatch Text */}
              {selectedIncident.dispatchMessage && (
                <div className="bg-emerald-950/40 text-emerald-100 p-3 rounded-xl border border-emerald-500/20 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
                    <Volume2 className="h-3 w-3" />
                    Radio Dispatch Template
                  </div>
                  <p className="italic">"{selectedIncident.dispatchMessage}"</p>
                </div>
              )}

              {/* PA Announcement Script */}
              {selectedIncident.announcementScript && (
                <div className="bg-blue-950/40 text-blue-100 p-3 rounded-xl border border-blue-500/20 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[9px] text-blue-400 font-bold mb-1 uppercase tracking-wider font-mono">
                    <Volume2 className="h-3 w-3" />
                    Public Address Announcement Script
                  </div>
                  <p className="italic">"{selectedIncident.announcementScript}"</p>
                </div>
              )}

              {/* Prevention strategy */}
              {selectedIncident.preventionTip && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                  <span className="font-bold flex items-center gap-1 text-amber-400 text-[11px] uppercase tracking-wider font-mono mb-1">
                    <Info className="h-3.5 w-3.5" />
                    Long-Term Operations Tip
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-300">{selectedIncident.preventionTip}</p>
                </div>
              )}

              {/* Resolve controls */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                {selectedIncident.status !== "resolved" && (
                  <button
                    onClick={() => onResolveIncident(selectedIncident.id)}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Mark Incident Resolved</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center flex flex-col items-center justify-center gap-3">
              <AlertCircle className="h-10 w-10 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-white">Operational protocol not evaluated</p>
                <p className="text-xs text-slate-400 px-4 mt-1">This reported event requires instant Gemini AI classification and dispatch guidelines.</p>
              </div>
              <button
                onClick={() => onGenerateAIIncidentGuide(selectedIncident)}
                disabled={incidentLoading}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-50 shadow-sm transition cursor-pointer"
              >
                {incidentLoading ? (
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Evaluate with Gemini AI</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 text-xs font-sans">
          Select an active incident to assess operational containment steps.
        </div>
      )}
    </div>
  );
}
