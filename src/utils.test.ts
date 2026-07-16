/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from "vitest";
import { calculateGateStatus, getGateStatusColor, sanitizeInput, isStrongPassword } from "./utils";

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
  });

  describe("getGateStatusColor", () => {
    it("should return the correct color classes", () => {
      expect(getGateStatusColor("critical")).toContain("rose");
      expect(getGateStatusColor("congested")).toContain("amber");
      expect(getGateStatusColor("moderate")).toContain("blue");
      expect(getGateStatusColor("clear")).toContain("emerald");
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
  });

  describe("isStrongPassword", () => {
    it("should validate strong passwords", () => {
      expect(isStrongPassword("FifaWorldCup2026!")).toBe(true);
      expect(isStrongPassword("SecureP@ss123")).toBe(true);
    });

    it("should reject weak passwords", () => {
      expect(isStrongPassword("123456")).toBe(false);
      expect(isStrongPassword("fifa2026")).toBe(false);
      expect(isStrongPassword("FIFAWORLD")).toBe(false);
    });
  });
});
