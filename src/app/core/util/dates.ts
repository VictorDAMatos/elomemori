import { Recurrence, WEEKDAY_LONG, WEEKDAY_SHORT } from '../models/routine.model';

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
export function toDayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d.getTime());
  copy.setDate(copy.getDate() + days);
  return copy;
}
export function weekdayOfKey(key: string): number {
  return fromDayKey(key).getDay();
}
export function minutesOf(time: string): number {
  if (!isValidTime(time)) return NaN;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesOfDate(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function isValidTime(value: string | undefined | null): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isRealCalendarDate(y: number, m: number, d: number): boolean {
  const dt = new Date(y, m - 1, d, 12);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}
export function isValidPartialDate(value: string | undefined | null): boolean {
  if (typeof value !== 'string') return false;
  let m = /^(\d{4})$/.exec(value);
  if (m) return Number(m[1]) >= 1900;
  m = /^(\d{4})-(\d{2})$/.exec(value);
  if (m) return Number(m[1]) >= 1900 && Number(m[2]) >= 1 && Number(m[2]) <= 12;
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (m) return Number(m[1]) >= 1900 && isRealCalendarDate(Number(m[1]), Number(m[2]), Number(m[3]));
  return false;
}
export function formatPartialDate(value: string | undefined | null): string {
  if (!value || !isValidPartialDate(value)) return '';
  const parts = value.split('-').map(Number);
  if (parts.length === 1) return `${parts[0]}`;
  if (parts.length === 2) return `${MONTHS[parts[1] - 1]} de ${parts[0]}`;
  return `${parts[2]} de ${MONTHS[parts[1] - 1]} de ${parts[0]}`;
}
export function formatTimeHuman(time: string): string {
  if (!isValidTime(time)) return time;
  const [h, m] = time.split(':').map(Number);
  return m === 0 ? `${h}h` : `${h}h${pad2(m)}`;
}
export function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 5) return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
export function formatLongDay(d: Date): string {
  return `${WEEKDAY_LONG[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}
export function isDueOn(recurrence: Recurrence, dayKey: string): boolean {
  const wd = weekdayOfKey(dayKey);
  switch (recurrence.type) {
    case 'daily':
      return true;
    case 'weekdays':
      return wd >= 1 && wd <= 5;
    case 'weekly':
      return (recurrence.days ?? []).includes(wd);
    case 'once':
      return recurrence.date === dayKey;
    default:
      return false;
  }
}
export function describeRecurrence(recurrence: Recurrence): string {
  switch (recurrence.type) {
    case 'daily':
      return 'Todos os dias';
    case 'weekdays':
      return 'De segunda a sexta';
    case 'weekly': {
      const days = [...(recurrence.days ?? [])].sort((a, b) => a - b).map((d) => WEEKDAY_SHORT[d]);
      if (days.length === 0) return 'Dias a escolher';
      if (days.length === 1) return `Toda ${WEEKDAY_LONG[recurrence.days![0]]}`;
      return `${days.slice(0, -1).join(', ')} e ${days[days.length - 1]}`;
    }
    case 'once':
      return recurrence.date ? `Só em ${formatPartialDate(recurrence.date)}` : 'Uma vez';
    default:
      return '';
  }
}
export function toLocalIso(d: Date): string {
  return `${toDayKey(d)}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
export function timeOfIso(iso: string): string {
  const m = /T(\d{2}):(\d{2})/.exec(iso);
  return m ? `${m[1]}:${m[2]}` : '';
}
