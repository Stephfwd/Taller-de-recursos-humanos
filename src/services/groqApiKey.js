const PLACEHOLDER_PATTERNS = [
  "pon_tu_clave",
  "tu_clave",
  "your_api_key",
  "api_key_here",
  "gsk_xxx",
  "pega_aqui",
];

export const getGroqKeyIssue = (apiKey) => {
  if (!apiKey || typeof apiKey !== "string") return "missing";
  const trimmed = apiKey.trim();
  if (!trimmed) return "missing";
  if (trimmed.includes("...")) return "truncated";
  const lower = trimmed.toLowerCase();
  if (PLACEHOLDER_PATTERNS.some((p) => lower.includes(p))) return "placeholder";
  if (!trimmed.startsWith("gsk_")) return "format";
  if (trimmed.length < 40) return "too_short";
  return null;
};

export const isGroqApiKeyConfigured = (apiKey) => getGroqKeyIssue(apiKey) === null;
