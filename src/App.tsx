/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Users, 
  Languages, 
  ShieldAlert, 
  Send, 
  Sparkles, 
  MapPin, 
  Volume2, 
  Plus, 
  Activity, 
  Info, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Check, 
  Menu,
  FileText,
  User,
  Zap,
  CheckSquare,
  Square,
  HelpCircle,
  X
} from "lucide-react";
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
import { Message, Incident, Task, GateMetrics, MatchCountdown } from "./types";
import { INITIAL_MATCHES, INITIAL_GATES, INITIAL_INCIDENTS, INITIAL_TASKS } from "./data";
import { GateTelemetryPanel } from "./components/GateTelemetryPanel";
import { VolunteerTaskPanel } from "./components/VolunteerTaskPanel";
import { IncidentGuidePanel } from "./components/IncidentGuidePanel";
import { FanTicketCard } from "./components/FanTicketCard";
import { FanMapGuide } from "./components/FanMapGuide";
import { FanChatPanel } from "./components/FanChatPanel";

export default function App() {
  // Mode selection: staff (Stadium Command) vs fan (Fan Assistant)
  const [userMode, setUserMode] = useState<"staff" | "fan">("staff");

  // State
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [gates, setGates] = useState<GateMetrics[]>(INITIAL_GATES);
  const [matches] = useState<MatchCountdown[]>(INITIAL_MATCHES);
  
  // Active selection
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(INITIAL_INCIDENTS[0]);
  const [incidentLoading, setIncidentLoading] = useState(false);

  // Form states - Custom Incident Report
  const [newIncidentDesc, setNewIncidentDesc] = useState("");
  const [newIncidentLocation, setNewIncidentLocation] = useState("Gate B (North)");
  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false);

  // Form states - Volunteer dispatch parser
  const [dispatchPrompt, setDispatchPrompt] = useState("");
  const [dispatchLoading, setDispatchLoading] = useState(false);

  // Form states - Fan Chat
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! ¡Hola! Bonjour! I am your Intelligent Stadium Assistant for the FIFA World Cup 2026. How can I assist you with your matchday experience at Metropolitan Stadium today? Ask me about gate guides, clear bag rules, NJ Transit timings, or accessibility support!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Selected gate for mapping/help
  const [activeGateTab, setActiveGateTab] = useState<string>("Gate B (North - Parking)");

  // Notification Toast states
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  // Authentication states
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(false);
  const [staffToken, setStaffToken] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Check sessionStorage for active token on component mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("stadium_auth_token");
    if (savedToken) {
      setStaffToken(savedToken);
      setIsStaffAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("stadium_auth_token");
    setStaffToken(null);
    setIsStaffAuthenticated(false);
    setNotification({ message: "Operator session signed out successfully.", type: "info" });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError("Both username and PIN/password are required.");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Authentication failed.");
      }

      const data = await response.json();
      sessionStorage.setItem("stadium_auth_token", data.token);
      setStaffToken(data.token);
      setIsStaffAuthenticated(true);
      setLoginUsername("");
      setLoginPassword("");
      setNotification({ message: "Stadium command portal authorization granted!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Invalid operator username or access passcode.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Auto-clear notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Live simulation ticks to make telemetry feel real
  useEffect(() => {
    const interval = setInterval(() => {
      setGates(prevGates => 
        prevGates.map(gate => {
          // Add minor realistic variance
          const flowDiff = Math.floor((Math.random() - 0.5) * 30);
          const nextFlow = Math.max(50, Math.min(600, gate.flowRate + flowDiff));
          
          // Wait time increases with flow
          const nextWait = Math.max(2, Math.ceil(nextFlow / 18 + (Math.random() - 0.5) * 3));
          const nextCapacity = Math.max(10, Math.min(100, Math.ceil(nextFlow / 5)));
          
          let nextStatus: "clear" | "moderate" | "congested" | "critical" = "clear";
          if (nextCapacity > 85) nextStatus = "critical";
          else if (nextCapacity > 70) nextStatus = "congested";
          else if (nextCapacity > 40) nextStatus = "moderate";

          return {
            ...gate,
            flowRate: nextFlow,
            queueWait: nextWait,
            capacityPercent: nextCapacity,
            status: nextStatus
          };
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Quick Action Chat Suggestions
  const handleChatSuggestion = (text: string) => {
    setChatInput(text);
    handleSendChat(text);
  };

  // Submit Fan Chat
  const handleSendChat = async (overrideText?: string) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!overrideText) setChatInput("");
    setChatLoading(true);

    try {
      const chatHistory = [...chatMessages, userMsg].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          userType: "fan"
        })
      });

      if (!response.ok) throw new Error("Failed to contact Gemini server.");
      const data = await response.json();

      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: "Sorry, I am experiencing a brief communication issue with Stadium Command. Please try again in a few moments.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Generate AI Incident Response Guide
  const handleGenerateAIIncidentGuide = async (incident: Incident) => {
    if (incidentLoading) return;
    setIncidentLoading(true);

    try {
      const response = await fetch("/api/gemini/incident-guide", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${staffToken}`
        },
        body: JSON.stringify({
          incidentDescription: incident.description,
          location: incident.location,
          currentImpact: incident.impact || "Heavy crowd backlog, delay in flow rate."
        })
      });

      if (!response.ok) throw new Error("Error generating guidelines.");
      const data = await response.json();

      const updatedIncidents = incidents.map(inc => {
        if (inc.id === incident.id) {
          return {
            ...inc,
            severity: data.severity,
            immediateActions: data.immediateActions,
            stakeholderAlerts: data.stakeholderAlerts,
            dispatchMessage: data.dispatchMessage,
            announcementScript: data.announcementScript,
            preventionTip: data.preventionTip,
            status: "assessing" as const
          };
        }
        return inc;
      });

      setIncidents(updatedIncidents);
      
      // Update selected incident details
      const matched = updatedIncidents.find(inc => inc.id === incident.id);
      if (matched) {
        setSelectedIncident(matched);
        setNotification({ message: "Successfully analyzed incident and generated active operational guide!", type: "success" });
      }

    } catch (err) {
      console.error(err);
      setNotification({ message: "Failed to analyze incident with Gemini AI. Please check settings or try again.", type: "error" });
    } finally {
      setIncidentLoading(false);
    }
  };

  // Submit a custom incident
  const handleReportIncident = (e: FormEvent) => {
    e.preventDefault();
    if (!newIncidentDesc.trim()) return;

    const newInc: Incident = {
      id: "inc-" + Math.random().toString(36).substr(2, 9),
      description: newIncidentDesc,
      location: newIncidentLocation,
      status: "reported",
      reportedTime: "Just now",
      isCustom: true
    };

    setIncidents(prev => [newInc, ...prev]);
    setSelectedIncident(newInc);
    setNewIncidentDesc("");
    setShowNewIncidentForm(false);

    // Auto-generate AI response for reported incidents to feel magical!
    handleGenerateAIIncidentGuide(newInc);
  };

  // Parse natural language dispatch to create a new task card
  const handleAIDispatchParse = async (e: FormEvent) => {
    e.preventDefault();
    if (!dispatchPrompt.trim() || dispatchLoading) return;

    setDispatchLoading(true);
    try {
      const response = await fetch("/api/gemini/volunteer-dispatch", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${staffToken}`
        },
        body: JSON.stringify({ dispatchPrompt })
      });

      if (!response.ok) throw new Error("Error parsing dispatch request.");
      const data = await response.json();

      const newTask: Task = {
        id: "task-" + Math.random().toString(36).substr(2, 9),
        taskTitle: data.taskTitle,
        assignedZone: data.assignedZone,
        priority: data.priority as "High" | "Medium" | "Low",
        suggestedVolunteers: data.suggestedVolunteers,
        skillsRequired: data.skillsRequired,
        taskDescription: data.taskDescription,
        subtasks: data.subtasks,
        status: "open",
        assignedCount: 0,
        isCustom: true
      };

      setTasks(prev => [newTask, ...prev]);
      setDispatchPrompt("");
      setNotification({ message: "Successfully parsed dispatch prompt and compiled volunteer task card!", type: "success" });
    } catch (err) {
      console.error(err);
      setNotification({ message: "Failed to parse dispatch request with Gemini. Try using simpler terms.", type: "error" });
    } finally {
      setDispatchLoading(false);
    }
  };

  // Interact with Volunteer tasks
  const handleIncrementVolunteer = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const nextCount = task.assignedCount + 1;
        return {
          ...task,
          assignedCount: nextCount,
          status: nextCount >= task.suggestedVolunteers ? "in-progress" : task.status
        };
      }
      return task;
    }));
  };

  const handleToggleSubtask = (taskId: string, subtaskIndex: number) => {
    // For local interactive state feedback, we can mock completeness
    // Just a visual state alert or action is fine!
  };

  const handleResolveIncident = (incId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incId) {
        return { ...inc, status: "resolved" };
      }
      return inc;
    }));
    if (selectedIncident?.id === incId) {
      setSelectedIncident(prev => prev ? { ...prev, status: "resolved" } : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 font-sans antialiased relative overflow-x-hidden pb-12">
      {/* Toast Notification Banner */}
      {notification && (
        <div 
          id="toast-notification"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-lg transition-all duration-300 animate-pulse ${
            notification.type === "error" 
              ? "bg-rose-950/90 border-rose-500/30 text-rose-200" 
              : notification.type === "success" 
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-200"
                : "bg-blue-950/90 border-blue-500/30 text-blue-200"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          ) : notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <Info className="h-5 w-5 text-blue-400 shrink-0" />
          )}
          <span className="text-xs font-medium">{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white ml-2 shrink-0 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-800 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-red-600 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      {/* Premium Tournament Header */}
      <header id="header-bar" className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand Logo & Tournament Identity */}
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-tr from-blue-500 to-indigo-600 text-white rounded-xl p-2.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight font-display text-white flex items-center gap-2">
                Metropolitan Stadium NY/NJ <span className="text-blue-400">Command</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                FIFA World Cup 2026 • Real-Time AI Operations
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-inner">
              <button
                id="mode-staff-btn"
                onClick={() => setUserMode("staff")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  userMode === "staff"
                    ? "bg-white/15 text-white border border-white/10 shadow-md font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Activity className="h-4 w-4 text-blue-400" />
                <span>Staff Operations</span>
              </button>
              <button
                id="mode-fan-btn"
                onClick={() => setUserMode("fan")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  userMode === "fan"
                    ? "bg-white/15 text-white border border-white/10 shadow-md font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Compass className="h-4 w-4 text-blue-400" />
                <span>Fan Assist Hub</span>
              </button>
            </div>

            {userMode === "staff" && isStaffAuthenticated && (
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 hover:border-rose-500/30 rounded-xl text-xs font-semibold transition"
              >
                <X className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {userMode === "staff" ? (
          !isStaffAuthenticated ? (
            /* ==========================================
               STAFF OPERATIONS SECURITY AUTHORIZATION LOCK
               ========================================== */
            <div id="security-login-container" className="max-w-md mx-auto mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-800 rounded-full blur-[80px] opacity-15 pointer-events-none"></div>
              
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              
              <h2 className="text-xl font-bold text-white font-display">Command Center Lock</h2>
              <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
                Authorization required to access Metropolitan Stadium Operations Hub & real-time telemetry datasets.
              </p>

              {loginError && (
                <div id="login-error-alert" className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs text-left flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" aria-hidden="true" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                    Operator ID
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <input
                      id="login-username"
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="e.g., stadium_admin"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-black/60 transition focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                    Security Passcode (PIN)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter 4-digit PIN or password"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-black/60 transition focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  id="submit-login-btn"
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock Portal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Assist Credentials Helper */}
              <div className="mt-6 pt-5 border-t border-white/5 text-left">
                <span className="text-[10px] text-blue-400 font-mono font-bold block uppercase tracking-wider mb-2">
                  🔐 SANDBOX DEMO QUICK AUTH
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                  This simulated sandbox has credentials preconfigured. Click below for immediate, high-security authorized access.
                </p>
                <button
                  id="quick-demo-auth-btn"
                  onClick={() => {
                    setLoginUsername("stadium_admin");
                    setLoginPassword("2026");
                    // Trigger dynamic auth fetch immediately
                    setTimeout(() => {
                      const loginBtn = document.getElementById("submit-login-btn");
                      if (loginBtn) loginBtn.click();
                    }, 100);
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-[10px] font-semibold rounded-lg border border-white/5 transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5 text-yellow-400" aria-hidden="true" />
                  <span>Click to Auto-Fill & Unlock (Admin/2026)</span>
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================
               STAFF OPERATIONS CONTROL HUB
               ========================================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1 (4/12): Telemetry & Real-Time Gates */}
            <div className="lg:col-span-4">
              <GateTelemetryPanel gates={gates} />
            </div>

            {/* COLUMN 2 (4/12): Incident Management Logs */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white font-display flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-400" />
                    Active Incident Log
                  </h3>
                  <button
                    onClick={() => setShowNewIncidentForm(!showNewIncidentForm)}
                    className="text-xs bg-white/10 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 border border-white/10 transition"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Report</span>
                  </button>
                </div>

                {/* Form to report an incident */}
                {showNewIncidentForm && (
                  <form onSubmit={handleReportIncident} className="bg-black/30 border border-white/10 p-4 rounded-xl flex flex-col gap-3">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">Log New Stadium Incident</h4>
                    
                    <div>
                      <label htmlFor="new-incident-location" className="block text-[10px] font-mono text-slate-400 mb-1">STADIUM LOCATION</label>
                      <select 
                        id="new-incident-location"
                        value={newIncidentLocation} 
                        onChange={(e) => setNewIncidentLocation(e.target.value)}
                        className="w-full text-xs p-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-emerald-500"
                      >
                        <option className="bg-[#050B18]" value="Gate A (East)">Gate A (East Plaza / Train Link)</option>
                        <option className="bg-[#050B18]" value="Gate B (North)">Gate B (North Gates / Parking)</option>
                        <option className="bg-[#050B18]" value="Gate C (West)">Gate C (VIP Entrance)</option>
                        <option className="bg-[#050B18]" value="Gate D (South)">Gate D (South Lot Buses)</option>
                        <option className="bg-[#050B18]" value="West Stand Concourse">West Stand Concourse Level 1</option>
                        <option className="bg-[#050B18]" value="East Stand Upper Bowl">East Stand Upper Level</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="new-incident-desc" className="block text-[10px] font-mono text-slate-400 mb-1">INCIDENT DESCRIPTION</label>
                      <textarea
                        id="new-incident-desc"
                        required
                        value={newIncidentDesc}
                        onChange={(e) => setNewIncidentDesc(e.target.value)}
                        rows={3}
                        placeholder="Detail the scenario (e.g. Turnstiles at Gate C jam, fans building up...)"
                        className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-emerald-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 text-xs">
                      <button 
                        type="button" 
                        onClick={() => setShowNewIncidentForm(false)}
                        className="px-3 py-1.5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg flex items-center gap-1 shadow-lg shadow-emerald-600/20"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI Dispatch</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Incidents Feed */}
                <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
                  {incidents.map((inc) => (
                    <div 
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className={`p-3 border rounded-xl cursor-pointer transition text-left ${
                        selectedIncident?.id === inc.id
                          ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
                          : "border-white/5 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-white flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {inc.location}
                        </span>
                        <span className={`text-[9px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full border ${
                          inc.status === "resolved" ? "bg-white/10 text-slate-400 border-white/10" :
                          inc.status === "contained" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          inc.status === "assessing" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {inc.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-300 line-clamp-2 mb-2">{inc.description}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{inc.reportedTime}</span>
                        {inc.severity && (
                          <span className={`font-semibold px-1.5 py-0.5 rounded border ${
                            inc.severity === "Critical" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                            inc.severity === "High" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            {inc.severity} Severity
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 3 (4/12): Dynamic AI Response Guide */}
            <div className="lg:col-span-4">
              <IncidentGuidePanel
                selectedIncident={selectedIncident}
                incidentLoading={incidentLoading}
                onGenerateAIIncidentGuide={handleGenerateAIIncidentGuide}
                onResolveIncident={handleResolveIncident}
              />
            </div>

            {/* FULL WIDTH IN STAFF ROW: Volunteer Task Dispatch Board */}
            <VolunteerTaskPanel
              tasks={tasks}
              dispatchPrompt={dispatchPrompt}
              dispatchLoading={dispatchLoading}
              onDispatchPromptChange={setDispatchPrompt}
              onAIDispatchParse={handleAIDispatchParse}
              onIncrementVolunteer={handleIncrementVolunteer}
            />

          </div>
          )
        ) : (
          /* ==========================================
             FAN ASSIST & MULTILINGUAL SUPPORT
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* COLUMN 1 (5/12): Fan Tickets & Stadium Info */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Interactive Match Day Ticket card */}
              <FanTicketCard match={matches[0]} />

              {/* Stadium Seat Map / Gate Entry Guidelines */}
              <FanMapGuide
                activeGateTab={activeGateTab}
                onActiveGateTabChange={setActiveGateTab}
              />

            </div>

            {/* COLUMN 2 (7/12): Fan Intelligent Chat Assist Container */}
            <div className="lg:col-span-7 flex flex-col">
              
              <FanChatPanel
                chatMessages={chatMessages}
                chatLoading={chatLoading}
                chatInput={chatInput}
                onChatInputChange={setChatInput}
                onSendChat={handleSendChat}
                onChatSuggestion={handleChatSuggestion}
              />

            </div>

          </div>
        )}
      </main>

      {/* Humble Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400 font-mono">
          Metropolitan Stadium Operations Command Center • FIFA World Cup 2026™ Simulated Sandbox • Developed with Google Gemini 3.5 AI
        </p>
      </footer>
    </div>
  );
}
