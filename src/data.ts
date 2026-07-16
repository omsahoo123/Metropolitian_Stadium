import { Incident, Task, GateMetrics, MatchCountdown } from "./types";

export const INITIAL_MATCHES: MatchCountdown[] = [
  {
    fixture: "USA vs. Colombia (Group A)",
    dateTime: "2026-06-12T18:00:00",
    stadium: "Metropolitan Stadium, NY/NJ",
  },
  {
    fixture: "Mexico vs. Germany (Group B)",
    dateTime: "2026-06-15T15:00:00",
    stadium: "Metropolitan Stadium, NY/NJ",
  },
  {
    fixture: "Argentina vs. England (Quarter-Final)",
    dateTime: "2026-07-04T20:00:00",
    stadium: "Metropolitan Stadium, NY/NJ",
  },
  {
    fixture: "World Cup Final 2026",
    dateTime: "2026-07-19T17:00:00",
    stadium: "Metropolitan Stadium, NY/NJ",
  }
];

export const INITIAL_GATES: GateMetrics[] = [
  {
    name: "Gate A (East - Transit Link)",
    flowRate: 340,
    queueWait: 14,
    capacityPercent: 68,
    status: "moderate",
    staffAssigned: 28,
  },
  {
    name: "Gate B (North - Parking)",
    flowRate: 480,
    queueWait: 28,
    capacityPercent: 92,
    status: "congested",
    staffAssigned: 35,
  },
  {
    name: "Gate C (West - VIP & Club)",
    flowRate: 110,
    queueWait: 4,
    capacityPercent: 30,
    status: "clear",
    staffAssigned: 15,
  },
  {
    name: "Gate D (South - Buses & Clubs)",
    flowRate: 410,
    queueWait: 19,
    capacityPercent: 78,
    status: "moderate",
    staffAssigned: 24,
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "inc-1",
    description: "Gate B ticket scanners experienced a 5-minute network failure, creating a backlog of approximately 400 fans outside the security perimeter.",
    location: "Gate B Entrance (North)",
    status: "assessing",
    reportedTime: "10 mins ago",
    severity: "High",
    impact: "Large crowd buildup in unshaded plazas; potential safety hazard.",
    immediateActions: [
      "Deploy manual ticket check overrides on off-grid tablets.",
      "Dispatch 5 crowd management supervisors to form distinct queues.",
      "Broadcast intercom advice to fans to prepare barcodes offline."
    ],
    stakeholderAlerts: [
      "IT Core Infrastructure",
      "Sector Security Lead",
      "Volunteer Coordinator"
    ],
    dispatchMessage: "IT glitch at Gate B ticketing. Volunteers nearby redirect fans to open scanners and distribute water.",
    announcementScript: "Attention supporters at Gate B. We are experiencing a brief ticketing system delay. Please have your mobile tickets or printouts ready. Technical staff are actively addressing the issue. Thank you for your patience.",
    preventionTip: "Stagger mobile push notifications to arriving transit users advising them to download tickets prior to reaching the gate."
  },
  {
    id: "inc-2",
    description: "Escalator #3 in the West Stand has stopped working. Fans are congested on the lower concourse, with some mobility-impaired supporters stuck.",
    location: "West Stand, Concourse Level 1",
    status: "reported",
    reportedTime: "25 mins ago",
    severity: "Medium",
    impact: "Crowding at escalator base; delay in access to upper tiers for elderly fans.",
    immediateActions: [
      "Cordon off escalator entry/exit points.",
      "Station volunteers to direct supporters to elevators in Core West.",
      "Call engineering maintenance team on radio Channel 4."
    ],
    stakeholderAlerts: [
      "Engineering & Facilities",
      "Accessibility Escort Dispatch"
    ],
    dispatchMessage: "Escalator down in West Stand. Station volunteers to guide elderly fans to elevator banks.",
    announcementScript: "",
    preventionTip: "Enforce escalator load-balancing procedures during heavy pre-match ingress waves."
  },
  {
    id: "inc-3",
    description: "Sensory overload incident reported: A young supporter is experiencing extreme distress near Section 114 concourse decibel level peak.",
    location: "Concourse near Section 114",
    status: "resolved",
    reportedTime: "1 hr ago",
    severity: "Low",
    impact: "Supporter and parent distressed; minor disruption in walkway.",
    immediateActions: [
      "Escort supporter to the designated Sensory Room at Section 112.",
      "Provide sensory-friendly noise-cancelling headphones.",
      "Offer quiet space and water."
    ],
    stakeholderAlerts: [
      "Medical Support Team",
      "Accessibility Lead"
    ],
    dispatchMessage: "Accessibility assist completed: Escorted fan from Section 114 to Sensory Room 112.",
    announcementScript: "",
    preventionTip: "Pre-allocate sensory kits (headphones, fidgets) at Guest Services booths in all zones."
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    taskTitle: "Gate B Queue Distribution",
    assignedZone: "Gate B (North)",
    priority: "High",
    suggestedVolunteers: 6,
    skillsRequired: ["Crowd Guidance", "Active Communication"],
    taskDescription: "Form distinct orderly queues outside Gate B to ease pressure on scanners and ticket check. Hand out match programs to keep fans occupied.",
    subtasks: [
      "Organize fans into 4 structured lanes using queue stanchions.",
      "Identify families with small children and fast-track them to family entry points.",
      "Keep the main emergency vehicle passage clear of arriving crowds."
    ],
    status: "in-progress",
    assignedCount: 4
  },
  {
    id: "task-2",
    taskTitle: "Sensory Room Escort Support",
    assignedZone: "Section 112 Sensory Room",
    priority: "Medium",
    suggestedVolunteers: 2,
    skillsRequired: ["Mobility Assist", "Empathetic Communication", "First Aid Base"],
    taskDescription: "Assist the lead clinical psychologist in greeting fans arriving at the Section 112 sensory room and registering sensory kits.",
    subtasks: [
      "Maintain absolute silence and calm within the Sensory Room boundaries.",
      "Help log the checking out of noise-cancelling headsets to families.",
      "Escort recovered fans back to their seats once they feel comfortable."
    ],
    status: "open",
    assignedCount: 0
  },
  {
    id: "task-3",
    taskTitle: "Spanish Translation for Bus Arrivals",
    assignedZone: "Gate D (South Lot)",
    priority: "High",
    suggestedVolunteers: 4,
    skillsRequired: ["Bilingual (Spanish)", "Information Desk Guidance"],
    taskDescription: "A fleet of supporter shuttle buses from South America is arriving. We need fluent Spanish speakers to direct fans towards stadium security gates and clear-bag inspections.",
    subtasks: [
      "Greet supporters arriving at the bus parking bays in Spanish.",
      "Distribute the bilingual clear-bag rules brochure.",
      "Direct them clearly towards Gate D for security processing."
    ],
    status: "open",
    assignedCount: 1
  }
];
