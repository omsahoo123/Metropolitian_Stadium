import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy load and initialize Gemini Client to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it to your environment settings to enable Gemini AI capabilities.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Model selection
const GEMINI_MODEL = "gemini-3.5-flash";

// 1. Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Chat Assistant Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userType = "fan" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = userType === "staff" 
      ? `You are the FIFA World Cup 2026 Intelligent Stadium Operations Assistant (Staff Mode).
You assist stadium operators, organizers, venue staff, and volunteers in managing crowd flow, safety, transit, and accessibility.
Provide precise, action-oriented, professional, and safety-first guides based on FIFA operational guidelines. 
Always remain calm, analytical, and highly structured in your advice. 
If an emergency is described, prioritize calling medical/security services first, and then give crowd control instructions.
Host Stadium details: 
- Stadium: Metropolitan Stadium, NY/NJ (MetLife Stadium)
- Gates: Gate A (East - Train station shuttle, high volume), Gate B (North - Parking, general public), Gate C (West - VIP, press, hospitality), Gate D (South - Coach bus drop-off, international fan clubs).
- Transit: NJ Transit Train (Gate A link), Coach USA bus, Zone E rideshare (South lot).
- Accessibility: Sensory room at Sec 112, wheelchair escort dispatch at Gate A & B, elevator banks at East/West Plazas.`
      : `You are the FIFA World Cup 2026 Fan Support & Volunteer Guide (Fan Mode).
You help international and local fans navigate their matchday experience at the stadium. 
Provide clear, friendly, and enthusiastic assistance! Answer queries about gate locations, food & beverages, clear bag policies, match schedules, public transport, and accessibility services.
Respond in the language the fan is using. Be concise, easy to read (use bullet points), and helpful.
Stadium details:
- Stadium: Metropolitan Stadium, NY/NJ (MetLife Stadium)
- Gates: Gate A (East - near Train link), Gate B (North - Parking & Rideshare), Gate C (West - VIP/Hospitality), Gate D (South - Bus plaza).
- Permitted items: Clear bags (max 12"x6"x12"), small clutches (max 4.5"x6.5"), 1 factory-sealed water bottle (max 20oz, cap removed at entry).
- Prohibited items: Backpacks, umbrellas, noisemakers (vuvuzelas), professional cameras.
- Fun zones: Fan Festival at East Plaza, food trucks at North Gate.`;

    // Format messages for @google/genai chat history format or standard contents format
    // In @google/genai, contents is the message history. 
    // We can map { role, content } into { role, parts: [{ text }] }
    // Note: 'user' roles are 'user', but 'assistant' or 'model' roles should be mapped to 'model'
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

// 3. AI Incident Action Guide Generator (Structured Output)
app.post("/api/gemini/incident-guide", async (req, res) => {
  try {
    const { incidentDescription, location, currentImpact } = req.body;

    if (!incidentDescription) {
      return res.status(400).json({ error: "Incident description is required." });
    }

    const ai = getGeminiClient();

    const prompt = `Analyze the following stadium incident during a FIFA 2026 World Cup match and generate an active operational guide.
Incident: ${incidentDescription}
Location: ${location || "Unknown Section/Gate"}
Current Impact: ${currentImpact || "Not specified"}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: `You are the Lead Stadium Operations Director for FIFA 2026. 
Analyze the reported incident and provide a structured operational guide in JSON format.
You must return a JSON response matching the requested schema.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              description: "Severity level: 'Critical' (Life threat/evacuation), 'High' (Injury/Gate clog/Fight), 'Medium' (Escalator down, long queues), 'Low' (Minor spill, minor inquiries)"
            },
            immediateActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Step-by-step immediate containment actions for staff on site (3-5 items)"
            },
            stakeholderAlerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Which groups or entities to notify immediately (e.g. 'Paramedics', 'Security Sector 3', 'Transit Command', 'Venue PR')"
            },
            dispatchMessage: {
              type: Type.STRING,
              description: "A concise 1-sentence radio dispatch broadcast to local volunteers or staff nearby."
            },
            announcementScript: {
              type: Type.STRING,
              description: "A calming Public Address (PA) script if crowd communication is needed. Empty if public announcement is not recommended."
            },
            preventionTip: {
              type: Type.STRING,
              description: "One strategic tip to prevent recurrence or manage the queue bottleneck long-term."
            }
          },
          required: ["severity", "immediateActions", "stakeholderAlerts", "dispatchMessage", "announcementScript", "preventionTip"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/incident-guide:", error);
    res.status(500).json({ error: error.message || "Failed to generate incident guide." });
  }
});

// 4. Smart Volunteer Dispatch and Task Parser
app.post("/api/gemini/volunteer-dispatch", async (req, res) => {
  try {
    const { dispatchPrompt } = req.body;

    if (!dispatchPrompt) {
      return res.status(400).json({ error: "Dispatch prompt is required." });
    }

    const ai = getGeminiClient();

    const prompt = `Parse the following coordinator request for volunteers and convert it into a structured task dispatch.
Request: "${dispatchPrompt}"`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: `You are the Volunteer Coordinator AI for FIFA 2026. 
Parse the natural language request and turn it into a structured JSON volunteer task card. 
Extract key requirements, assign a clean title, determine priority, specify needed skills, suggest quantity, and outline the subtasks.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            taskTitle: {
              type: Type.STRING,
              description: "A short, descriptive and urgent task title (e.g., 'Gate B Spanish Translators Needed')"
            },
            assignedZone: {
              type: Type.STRING,
              description: "Specific location or Gate name parsed from the request (e.g. 'Gate B', 'Section 104', 'VIP Entrance')"
            },
            priority: {
              type: Type.STRING,
              description: "Priority category: 'High', 'Medium', or 'Low'"
            },
            suggestedVolunteers: {
              type: Type.INTEGER,
              description: "Estimated number of volunteers required based on request context"
            },
            skillsRequired: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key skills needed (e.g. 'Bilingual (Spanish)', 'Crowd Guidance', 'De-escalation', 'Mobility Assist')"
            },
            taskDescription: {
              type: Type.STRING,
              description: "A detailed summary of the operational requirement and context"
            },
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Granular actionable tasks for the volunteers to check off (3-4 items)"
            }
          },
          required: ["taskTitle", "assignedZone", "priority", "suggestedVolunteers", "skillsRequired", "taskDescription", "subtasks"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/volunteer-dispatch:", error);
    res.status(500).json({ error: error.message || "Failed to generate volunteer task dispatch." });
  }
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
