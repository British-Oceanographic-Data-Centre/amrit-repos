export const toArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
export const toStringArray = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
