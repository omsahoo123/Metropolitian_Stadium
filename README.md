# FIFA World Cup 2026™ Stadium Operations & Fan Command Center

This is a modern, GenAI-enabled full-stack Command Center solution built to elevate stadium operations and the overall fan experience during the **FIFA World Cup 2026** at the Metropolitan Stadium (NY/NJ).

---

## 🏟️ Chosen Vertical & Scenario
We have designed a unified **Stadium Operations & Fan Command Hub**. This solution caters to two critical user personas under a single dashboard:
1. **Venue Staff & Incident Directors (Staff Operations Mode)**: Real-time decision-support system, live crowd telemetry, and smart volunteer coordination.
2. **International & Local Supporters (Fan Experience Hub)**: Multilingual interactive assistant providing immediate help with ticketing, clearances, transit, and accessibility policies.

---

## 🧠 Approach & Generative AI Logic
Our solution leverages **Google Gemini 3.5 Flash** server-side to ensure maximum security, speed, and reliability. There are three key GenAI integrations, each operating via fully custom server-side proxy routes:

### 1. Conversational Fan Support Assistant (`/api/gemini/chat`)
- **How it works**: Fans can ask questions in any language (English, Spanish, French, etc.) regarding ingress rules. The server injects a custom, detailed stadium context system prompt (covering gate configurations, prohibited items, train routes) to guarantee grounded, accurate, and professional responses.

### 2. Intelligent Incident Command Guide (`/api/gemini/incident-guide`)
- **How it works**: When venue staff report or select an incident (e.g. queue scanner crash, escalator malfunction, medical need), the app makes a request to the server. Gemini analyzes the description and returns a **structured JSON response** with:
  - **Severity level** (Critical, High, Medium, Low)
  - **Immediate on-site step-by-step actions** for volunteers
  - **Stakeholder notification matrix**
  - **Concise Radio Dispatch** text
  - **Calming PA Announcement script**
  - **Prevention tip** for future games

### 3. Smart Volunteer Dispatch and Task Parser (`/api/gemini/volunteer-dispatch`)
- **How it works**: When a coordinator types a brief request like *"We need 3 bilingual volunteers at Gate D because of sudden bus arrivals from Mexico"*, Gemini reads the prompt and outputs a complete, formatted **Volunteer Task Card**:
  - Automatically assesses priority level
  - Determines the specific zone
  - Creates a punchy title and full details
  - Generates a granular checklist (subtasks) of actions
  - Recommends the optimal volunteer headcount

---

## 🛠️ How the Solution Works
### The Ingress & Crowd Telemetry Sandbox
- **Simulated live gate updates**: Every 8 seconds, flow rates, wait times, and capacity percentages are simulated to mimic real game-day inflows.
- **Dynamic Recharts Data Visualizer**: Stadium staff view a high-contrast chart of wait times. If queue size increases, the bar turns yellow (congested) or red (critical).
- **Interactive Gate Selector**: Displays transport routes and guidelines for different ticket entries.

### Tech Stack
- **Frontend**: React 19, Tailwind CSS v4, Lucide React (Icons), Recharts (Interactive charts).
- **Backend**: Express (Node.js), TypeScript.
- **AI Engine**: `@google/genai` TypeScript SDK utilizing the `gemini-3.5-flash` model.

---

## 📋 Assumptions Made
1. **Host Venue Venue Policies**: Formulated around Metropolitan Stadium (NJ/NJ) regulations, including clear bag policies (maximum 12"x6"x12"), transport connections (NJ Transit rail link, South Coach Lot loops), and designated quiet/sensory rooms (Section 112).
2. **Offline Ticket Availability**: The Fan Assistant assumes fans might lose mobile signal near security gates and instructs them to screenshot barcodes or print copies prior to arrival.
3. **Staff Training**: Assumes that volunteers on-site carry mobile-responsive devices where they can see active dispatches, join tasks, and follow AI instructions.
