/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent } from "react";
import { Sparkles, Users, Square, Plus } from "lucide-react";
import { Task } from "../types";

interface VolunteerTaskPanelProps {
  tasks: Task[];
  dispatchPrompt: string;
  dispatchLoading: boolean;
  onDispatchPromptChange: (val: string) => void;
  onAIDispatchParse: (e: FormEvent) => void;
  onIncrementVolunteer: (taskId: string) => void;
}

export function VolunteerTaskPanel({
  tasks,
  dispatchPrompt,
  dispatchLoading,
  onDispatchPromptChange,
  onAIDispatchParse,
  onIncrementVolunteer,
}: VolunteerTaskPanelProps) {
  return (
    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
      {/* Dispatch Form (4/12) */}
      <div className="md:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-4 text-left">
        <div>
          <h3 className="font-semibold text-white font-display flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-blue-400" />
            AI Smart Volunteer Dispatch
          </h3>
          <p className="text-xs text-slate-400">Draft full volunteer work cards from natural language prompts</p>
        </div>

        <form onSubmit={onAIDispatchParse} className="flex flex-col gap-3">
          <div>
            <label htmlFor="dispatch-prompt" className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider font-mono">
              Dispatch Instruction Prompt
            </label>
            <div className="relative">
              <textarea
                id="dispatch-prompt"
                required
                value={dispatchPrompt}
                onChange={(e) => onDispatchPromptChange(e.target.value)}
                rows={4}
                placeholder="e.g. Turnstile congestions at West Gate C VIP entry. Need 3 volunteers to guide them and look for hospitality passes."
                className="w-full text-xs p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-emerald-500 focus:bg-black/60 transition"
              />
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-white/5 p-2 rounded border border-white/5">
            <span className="font-bold">AI Autocomplete outputs:</span> Priority index, recommended staff sizes, skill flags, and checkbox checklists.
          </div>

          <button
            type="submit"
            disabled={dispatchLoading || !dispatchPrompt.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm transition"
          >
            {dispatchLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>AI Analyze & Dispatch Task</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Active Tasks Feed (8/12) */}
      <div id="volunteer-tasks-feed" className="md:col-span-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white font-display flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-blue-400" />
            Active Volunteer Duty Tasks
          </h3>
          <span className="text-xs text-slate-400">{tasks.length} Active Assignments</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border border-white/5 rounded-xl text-left bg-white/5 hover:bg-white/10 transition flex flex-col justify-between">
              <div>
                {/* Task Header */}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div>
                    <span className="text-[10px] font-mono bg-white/10 text-slate-200 px-1.5 py-0.5 rounded font-bold mr-1.5 uppercase border border-white/5">
                      {task.assignedZone}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold border ${
                      task.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                      task.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-slate-400 font-mono">
                    {task.assignedCount}/{task.suggestedVolunteers} Staffed
                  </span>
                </div>

                {/* Title & description */}
                <h4 className="font-bold text-sm text-white font-display mb-1">{task.taskTitle}</h4>
                <p className="text-xs text-slate-300 mb-3 line-clamp-3">{task.taskDescription}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {task.skillsRequired.map((skill, index) => (
                    <span key={index} className="text-[9px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono border border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Checkbox Checklist */}
                <div className="border-t border-white/10 pt-2.5 mb-3 flex flex-col gap-1.5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CHECKLIST PROMPT</p>
                  {task.subtasks.map((sub, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-[11px] text-slate-300">
                      <Square className="h-3 w-3 shrink-0 text-slate-500 mt-0.5" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex gap-2 items-center justify-between border-t border-white/10 pt-3">
                <span className={`text-[10px] uppercase font-mono font-bold ${
                  task.status === "completed" ? "text-emerald-400" :
                  task.status === "in-progress" ? "text-blue-400" : "text-slate-400"
                }`}>
                  {task.status}
                </span>

                {task.status !== "completed" && task.assignedCount < task.suggestedVolunteers && (
                  <button
                    onClick={() => onIncrementVolunteer(task.id)}
                    className="flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-blue-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Assign Staff</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
