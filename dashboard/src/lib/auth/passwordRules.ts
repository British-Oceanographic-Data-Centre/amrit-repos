export function strongEnough(p: string) {
  if (!p || p.length < 12) return false;
  const hasL = /[a-z]/.test(p);
  const hasU = /[A-Z]/.test(p);
  const hasD = /\d/.test(p);
  const hasS = /[^A-Za-z0-9]/.test(p);
  return hasL && hasU && hasD && hasS;
}