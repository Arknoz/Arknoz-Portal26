export function sanitizeReturnTo(value?: string) {
  if (!value) return "/";

  const candidate = value.trim();

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    candidate.includes("\r") ||
    candidate.includes("\n")
  ) {
    return "/";
  }

  return candidate;
}