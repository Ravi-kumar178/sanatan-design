/**
 * Client-side .ics generation.
 *
 * Event "Register →" buttons previously linked to /contact, which lost most
 * people. A calendar file needs no backend at all — it is a text format the
 * browser can build and hand to the visitor's calendar app directly.
 *
 * Dates in the event data are human strings ("August 15, 2025", "6:00 PM –
 * 8:00 PM PDT"), so they are parsed leniently and the event falls back to
 * all-day when a time cannot be read — never to a wrong time.
 */

export interface CalendarEvent {
  title: string;
  /** e.g. "August 15, 2025" or "September 13–14, 2025" */
  date: string;
  /** e.g. "10:00 AM – 1:00 PM PDT". Optional; omitted means all-day. */
  time?: string;
  location?: string;
  description?: string;
  url?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

function parseDate(date: string): Date | null {
  // Take the first day of a range like "September 13–14, 2025".
  const cleaned = date.replace(/(\d+)\s*[–—-]\s*\d+/, '$1');
  const d = new Date(cleaned);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Returns [hour, minute] in 24h, or null when unparseable. */
function parseClock(part: string): [number, number] | null {
  const m = part.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const mer = m[3].toUpperCase();
  if (mer === 'PM' && h !== 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;
  return [h, min];
}

function floatingStamp(d: Date, hm: [number, number]) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hm[0])}${pad(hm[1])}00`;
}
function dateStamp(d: Date) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

/** Folds long lines to 75 octets and escapes per RFC 5545. */
function line(name: string, value: string) {
  const escaped = value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const full = `${name}:${escaped}`;
  if (full.length <= 75) return full;
  const out = [full.slice(0, 75)];
  let rest = full.slice(75);
  while (rest.length > 74) {
    out.push(' ' + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest) out.push(' ' + rest);
  return out.join('\r\n');
}

export function buildIcs(ev: CalendarEvent): string {
  const day = parseDate(ev.date);
  const now = new Date();
  const uid = `${ev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${day ? dateStamp(day) : 'tbd'}@sanataninternational.org`;

  const rows = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sanatan International//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    line('UID', uid),
    `DTSTAMP:${dateStamp(now)}T${pad(now.getHours())}${pad(now.getMinutes())}00`,
    line('SUMMARY', ev.title),
  ];

  if (day) {
    const parts = (ev.time || '').split(/[–—-]/);
    const start = parts[0] ? parseClock(parts[0]) : null;
    const end = parts[1] ? parseClock(parts[1]) : null;

    if (start) {
      // Floating local time: the listed time is local to the attendee's event,
      // which is what a published "6:00 PM" means to a reader.
      rows.push(`DTSTART:${floatingStamp(day, start)}`);
      rows.push(`DTEND:${floatingStamp(day, end ?? [start[0] + 2, start[1]])}`);
    } else {
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      rows.push(`DTSTART;VALUE=DATE:${dateStamp(day)}`);
      rows.push(`DTEND;VALUE=DATE:${dateStamp(next)}`);
    }
  }

  if (ev.location) rows.push(line('LOCATION', ev.location));
  if (ev.description) rows.push(line('DESCRIPTION', ev.description));
  if (ev.url) rows.push(line('URL', ev.url));

  rows.push('STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR');
  return rows.join('\r\n');
}

/** Triggers the download. Object URL is revoked on the next tick. */
export function downloadIcs(ev: CalendarEvent) {
  const blob = new Blob([buildIcs(ev)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** "Add to Google Calendar" link, for people who live in the browser. */
export function googleCalendarUrl(ev: CalendarEvent): string {
  const day = parseDate(ev.date);
  const p = new URLSearchParams({ action: 'TEMPLATE', text: ev.title });
  if (day) {
    const parts = (ev.time || '').split(/[–—-]/);
    const start = parts[0] ? parseClock(parts[0]) : null;
    const end = parts[1] ? parseClock(parts[1]) : null;
    if (start) {
      p.set('dates', `${floatingStamp(day, start)}/${floatingStamp(day, end ?? [start[0] + 2, start[1]])}`);
    } else {
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      p.set('dates', `${dateStamp(day)}/${dateStamp(next)}`);
    }
  }
  if (ev.location) p.set('location', ev.location);
  if (ev.description) p.set('details', ev.description);
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
