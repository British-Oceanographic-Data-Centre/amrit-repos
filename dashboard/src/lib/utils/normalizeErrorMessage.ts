type Msg = string | string[] | undefined;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function asStringArray(v: unknown): string[] | undefined {
  return Array.isArray(v) && v.every((x) => typeof x === 'string') ? (v as string[]) : undefined;
}

function pickMessage(o: unknown): string | null {
  if (!isRecord(o)) return null;

  const message = o.message as Msg;
  if (typeof message === 'string') return message;
  const messageArr = asStringArray(message);
  if (messageArr) return messageArr.join(', ');

  const errorStr = o.error as unknown;
  if (typeof errorStr === 'string') return errorStr;

  // nested response.message / response.error patterns
  const nested = o.response;
  if (nested && isRecord(nested)) {
    const nestedMsg = pickMessage(nested);
    if (nestedMsg) return nestedMsg;
  }

  return null;
}

function parseJsonIfLooksLike(s: string): unknown | null {
  const t = s.trim();
  const looksJson = (t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'));
  if (!looksJson) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

export function normalizeErrorMessage(err: unknown): string {
  // 1) Prefer structured response/message/error if present
  const fromTop = pickMessage(err);
  if (fromTop) return fromTop;

  // 2) If it's an Error with a JSON-like message, try to parse and extract message/error
  if (isRecord(err) && typeof err.message === 'string') {
    const parsed = parseJsonIfLooksLike(err.message);
    const fromParsed = pickMessage(parsed);
    if (fromParsed) return fromParsed;

    // handle parsed.response.message array/string case
    if (isRecord(parsed) && isRecord(parsed.response) && parsed.response.message !== undefined) {
      const m = parsed.response.message;
      if (typeof m === 'string') return m;
      const arr = asStringArray(m);
      if (arr) return arr.join(', ');
    }
  }

  // 3) Map common statuses when available
  if (isRecord(err) && typeof err.status === 'number') {
    if (err.status === 400) return 'Invalid or expired link';
    if (err.status === 422) return 'Password does not meet requirements';
  }

  return 'Request failed';
}
