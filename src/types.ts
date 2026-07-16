export interface Message {
  id: string;
  role: "user" | "assistant" | "model";
  content: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  description: string;
  location: string;
  status: "reported" | "assessing" | "contained" | "resolved";
  reportedTime: string;
  severity?: "Critical" | "High" | "Medium" | "Low";
  impact?: string;
  immediateActions?: string[];
  stakeholderAlerts?: string[];
  dispatchMessage?: string;
  announcementScript?: string;
  preventionTip?: string;
  isCustom?: boolean;
}

export interface Task {
  id: string;
  taskTitle: string;
  assignedZone: string;
  priority: "High" | "Medium" | "Low";
  suggestedVolunteers: number;
  skillsRequired: string[];
  taskDescription: string;
  subtasks: string[];
  status: "open" | "in-progress" | "completed";
  assignedCount: number;
  isCustom?: boolean;
}

export interface GateMetrics {
  name: string; // e.g. "Gate A"
  flowRate: number; // fans/min
  queueWait: number; // minutes
  capacityPercent: number; // 0-100
  status: "clear" | "moderate" | "congested" | "critical";
  staffAssigned: number;
}

export interface MatchCountdown {
  fixture: string;
  dateTime: string;
  stadium: string;
}
