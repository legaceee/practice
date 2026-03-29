export const parsePayload = (val: unknown) => {
  if (typeof val === "string" || typeof val === "number") {
    return true;
  }
};

export const isRecord = (val: any): val is Record<string, unknown> => {
  return typeof val === "object" && val !== null && !Array.isArray(val);
};
const RESTRICTED_KEYWORDS = new Set(["constructor", "__proto__", "prototype"]);
const MAX_ORDER = 100_000;
export const hasRestricted = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.some((val) => hasRestricted(val));
  }
  if (!isRecord(value)) {
    return false;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (RESTRICTED_KEYWORDS.has(key)) {
      return true;
    }
    if (hasRestricted(nested)) {
      return true;
    }
  }
  return false;
};
