import { isRecord } from "./isRecord";

const RESERVED_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const MAX_ORDER = 100_000;

export const hasReservedKeys = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some((val) => hasReservedKeys(val));
  }
  for (const [key, val] of Object.entries(value)) {
    if (RESERVED_KEYS.has(key)) {
      return true;
    }
    if (hasReservedKeys(val)) {
      return true;
    }
  }
  return false;
};
