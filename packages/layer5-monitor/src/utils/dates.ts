export function todayIsoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function isoDateTime(date = new Date()): string {
  return date.toISOString();
}

/** Monday of the week containing `date`, as YYYY-MM-DD (UTC). */
export function getWeekStarting(date = new Date()): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function getWeekEnding(weekStarting: string): string {
  const d = new Date(`${weekStarting}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 6);
  return d.toISOString().slice(0, 10);
}

export function previousWeekStarting(weekStarting: string): string {
  const d = new Date(`${weekStarting}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString().slice(0, 10);
}

export function weekRange(weekStarting: string): { start: string; end: string } {
  return { start: weekStarting, end: getWeekEnding(weekStarting) };
}
