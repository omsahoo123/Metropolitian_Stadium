/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from "vitest";
import { calculateGateStatus, getGateStatusColor, sanitizeInput, isStrongPassword, calculateCountdown, classifyIncidentSeverity } from "./utils";

describe("Stadium Operations Helper Utilities", () => {
  describe("calculateGateStatus", () => {
    it("should classify 90% capacity as critical", () => {
      expect(calculateGateStatus(90)).toBe("critical");
      expect(calculateGateStatus(85)).toBe("critical");
    });

    it("should classify 75% capacity as congested", () => {
      expect(calculateGateStatus(75)).toBe("congested");
      expect(calculateGateStatus(70)).toBe("congested");
    });

    it("should classify 50% capacity as moderate", () => {
      expect(calculateGateStatus(50)).toBe("moderate");
      expect(calculateGateStatus(40)).toBe("moderate");
    });

    it("should classify 25% capacity as clear", () => {
      expect(calculateGateStatus(25)).toBe("clear");
      expect(calculateGateStatus(0)).toBe("clear");
    });

    it("should handle boundary and extreme values correctly", () => {
      expect(calculateGateStatus(39)).toBe("clear");
      expect(calculateGateStatus(69)).toBe("moderate");
      expect(calculateGateStatus(84)).toBe("congested");
      expect(calculateGateStatus(-10)).toBe("clear");
      expect(calculateGateStatus(1000)).toBe("critical");
    });
  });

  describe("getGateStatusColor", () => {
    it("should return the correct color classes", () => {
      expect(getGateStatusColor("critical")).toContain("rose");
      expect(getGateStatusColor("congested")).toContain("amber");
      expect(getGateStatusColor("moderate")).toContain("blue");
      expect(getGateStatusColor("clear")).toContain("emerald");
    });

    it("should return default green color for fallback or invalid status", () => {
      // Cast invalid string to test default fallback
      expect(getGateStatusColor("unknown" as any)).toContain("emerald");
    });
  });

  describe("sanitizeInput", () => {
    it("should escape HTML special characters", () => {
      const dirty = "<script>alert('hack')</script> & and /";
      const clean = sanitizeInput(dirty);
      expect(clean).not.toContain("<script>");
      expect(clean).toContain("&lt;script&gt;");
      expect(clean).toContain("&amp;");
      expect(clean).toContain("&#x2F;");
    });

    it("should handle empty values", () => {
      expect(sanitizeInput("")).toBe("");
    });

    it("should handle double and single quotes", () => {
      expect(sanitizeInput(`"hello" 'world'`)).toBe("&quot;hello&quot; &#x27;world&#x27;");
    });

    it("should handle consecutive special characters", () => {
      expect(sanitizeInput("<<<>>>&&&///")).toBe("&lt;&lt;&lt;&gt;&gt;&gt;&amp;&amp;&amp;&#x2F;&#x2F;&#x2F;");
    });
  });

  describe("isStrongPassword", () => {
    it("should validate strong passwords", () => {
      expect(isStrongPassword("FifaWorldCup2026!")).toBe(true);
      expect(isStrongPassword("SecureP@ss123")).toBe(true);
      expect(isStrongPassword("Abc12345")).toBe(true); // exactly 8 characters with upper, lower, number
    });

    it("should reject weak passwords", () => {
      expect(isStrongPassword("123456")).toBe(false);
      expect(isStrongPassword("fifa2026")).toBe(false);
      expect(isStrongPassword("FIFAWORLD")).toBe(false);
      expect(isStrongPassword("Abc1234")).toBe(false); // 7 characters, too short
      expect(isStrongPassword("abcdefgh1")).toBe(false); // missing uppercase
      expect(isStrongPassword("ABCDEFGH1")).toBe(false); // missing lowercase
      expect(isStrongPassword("Abcdefghi")).toBe(false); // missing number
      expect(isStrongPassword("")).toBe(false); // empty
    });
  });

  describe("calculateCountdown", () => {
    it("should return Match Day Live for past or equal dates", () => {
      const target = "2026-06-12T18:00:00";
      const now = new Date("2026-06-12T19:00:00");
      expect(calculateCountdown(target, now)).toBe("Match Day Live");
    });

    it("should show days and hours remaining for far dates", () => {
      const target = "2026-06-12T18:00:00";
      const now = new Date("2026-06-10T12:00:00"); // 2d 6h remaining
      expect(calculateCountdown(target, now)).toBe("2d 6h remaining");
    });

    it("should show hours remaining if less than a day", () => {
      const target = "2026-06-12T18:00:00";
      const now = new Date("2026-06-12T12:00:00"); // 6 hours remaining
      expect(calculateCountdown(target, now)).toBe("6h remaining");
    });

    it("should handle default parameter for currentOffsetDate", () => {
      // Create a target date far in the future so that it always has remaining days/hours
      const farFuture = new Date();
      farFuture.setDate(farFuture.getDate() + 5);
      const res = calculateCountdown(farFuture.toISOString());
      expect(res).toContain("remaining");
    });

    it("should handle exactly equal dates", () => {
      const target = "2026-06-12T18:00:00";
      const now = new Date("2026-06-12T18:00:00");
      expect(calculateCountdown(target, now)).toBe("Match Day Live");
    });
  });

  describe("classifyIncidentSeverity", () => {
    it("should classify medical or injury as Critical", () => {
      expect(classifyIncidentSeverity("A fan suffered a minor head injury in the stands")).toBe("Critical");
      expect(classifyIncidentSeverity("Medical assistance requested at section 104")).toBe("Critical");
    });

    it("should classify network or offline failure as High", () => {
      expect(classifyIncidentSeverity("Gate ticket scanner systems went offline")).toBe("High");
      expect(classifyIncidentSeverity("Wi-Fi network connection failure inside VIP lounge")).toBe("High");
    });

    it("should classify ticket turnstile congestion as Medium", () => {
      expect(classifyIncidentSeverity("Heavy congestion near turnstiles at Gate A")).toBe("Medium");
      expect(classifyIncidentSeverity("Long queues at Gate D ticketing booth")).toBe("Medium");
    });

    it("should classify general other queries as Low", () => {
      expect(classifyIncidentSeverity("Someone dropped their cup on the floor")).toBe("Low");
      expect(classifyIncidentSeverity("")).toBe("Low");
    });

    it("should handle mixed-case and complex sentences", () => {
      expect(classifyIncidentSeverity("mEdIcAl EMERGENCY IN SECTION 123")).toBe("Critical");
      expect(classifyIncidentSeverity("tUrNsTiLe sYsTeM is offline")).toBe("High"); // offline matches High, but turnstile matches Medium. High takes precedence here as checked first.
      expect(classifyIncidentSeverity("Long qUeUeS at entry")).toBe("Medium");
    });

    it("should prioritize critical keywords over high and medium", () => {
      // Contains both 'medical' (Critical) and 'offline' (High) and 'queue' (Medium)
      const desc = "A medical emergency happened while the network scanner is offline in the long queue";
      expect(classifyIncidentSeverity(desc)).toBe("Critical");
    });

    it("should prioritize high keywords over medium", () => {
      // Contains both 'offline' (High) and 'turnstile' (Medium)
      const desc = "Ticket turnstiles are offline due to software crash";
      expect(classifyIncidentSeverity(desc)).toBe("High");
    });
  });
});
