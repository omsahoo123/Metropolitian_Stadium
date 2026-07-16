/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates the crowd congestion status level based on capacity percentage.
 */
export function calculateGateStatus(capacityPercent: number): "clear" | "moderate" | "congested" | "critical" {
  if (capacityPercent >= 85) return "critical";
  if (capacityPercent >= 70) return "congested";
  if (capacityPercent >= 40) return "moderate";
  return "clear";
}

/**
 * Returns Tailwind text color class names based on congestion status.
 */
export function getGateStatusColor(status: "clear" | "moderate" | "congested" | "critical"): string {
  switch (status) {
    case "critical":
      return "text-rose-400";
    case "congested":
      return "text-amber-400";
    case "moderate":
      return "text-blue-400";
    case "clear":
    default:
      return "text-emerald-400";
  }
}

/**
 * Sanitizes input string to prevent basic HTML injection (XSS protection).
 */
export function sanitizeInput(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates password criteria for security standards.
 * Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number.
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
}
