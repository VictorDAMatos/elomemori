import { buildSeedState } from '../../../mock-data/seed';
import {
  DEFAULT_PREFERENCES,
  DEFAULT_SESSION,
  DEMO_STATE_VERSION,
  DemoSession,
  DemoState,
  Preferences,
  TextScale,
} from '../models/state.model';
import { FamilyPermission, MockFamilyRelationship, MockProfile } from '../models/profile.model';
import { MediaType, MockMedia, MockMemory } from '../models/memory.model';
import {
  MockNotice,
  MockReminder,
  MockRoutineLog,
  Recurrence,
  ReminderKind,
  ReminderStatus,
  RoutineResult,
} from '../models/routine.model';
import { isValidPartialDate, isValidTime, toLocalIso } from '../util/dates';

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const STORAGE_KEYS = {
  state: 'elomemori.demo.state.v1',
  prefs: 'elomemori.demo.prefs.v1',
  session: 'elomemori.demo.session.v1',
} as const;
export const MAX_SERIALIZED_CHARS = 400_000;

export type LoadReason = 'loaded' | 'missing' | 'invalid' | 'unavailable';

export interface LoadOutcome {
  state: DemoState;
  reason: LoadReason;
  recovered: boolean;
}
export function getBrowserStorage(): KeyValueStorage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const probe = '__elomemori_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return localStorage;
  } catch {
    return null;
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const oneOf = <T extends string>(v: unknown, list: readonly T[]): v is T => isStr(v) && (list as readonly string[]).includes(v);

const MEDIA_TYPES: readonly MediaType[] = ['image', 'video', 'audio'];
const PERMISSIONS: readonly FamilyPermission[] = ['view', 'edit', 'manage'];
const STATUSES: readonly ReminderStatus[] = ['pending', 'done', 'help', 'forgot'];
const RESULTS: readonly RoutineResult[] = ['done', 'help', 'forgot'];
const KINDS: readonly ReminderKind[] = ['activity', 'medication'];
const SCALES: readonly TextScale[] = ['normal', 'large', 'xlarge'];
export function isSafeDemoAssetPath(p: unknown): p is string {
  return isStr(p) && p.startsWith('assets/demo-media/') && !p.includes('..') && !p.includes('://') && !p.includes('\\');
}

export function sanitizeMedia(v: unknown): MockMedia | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.name) || !oneOf(v.type, MEDIA_TYPES)) return null;
  const source = v.source === 'demo' || v.source === 'session' ? v.source : null;
  if (!source) return null;
  const media: MockMedia = { id: v.id, type: v.type, name: v.name.slice(0, 120), source };
  if (source === 'demo') {
    if (!isSafeDemoAssetPath(v.assetPath)) return null;
    media.assetPath = v.assetPath;
  }
  if (isStr(v.alt)) media.alt = v.alt.slice(0, 300);
  return media;
}

function sanitizeRecurrence(v: unknown): Recurrence | null {
  if (!isObj(v) || !oneOf(v.type, ['daily', 'weekdays', 'weekly', 'once'] as const)) return null;
  const r: Recurrence = { type: v.type };
  if (v.type === 'weekly') {
    const days = Array.isArray(v.days) ? v.days.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6) : [];
    if (days.length === 0) return null;
    r.days = Array.from(new Set(days)).sort((a, b) => a - b);
  }
  if (v.type === 'once') {
    if (!isStr(v.date) || !/^\d{4}-\d{2}-\d{2}$/.test(v.date) || !isValidPartialDate(v.date)) return null;
    r.date = v.date;
  }
  return r;
}

function sanitizeProfile(v: unknown): MockProfile | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.displayName) || !oneOf(v.role, ['assisted', 'family'] as const)) return null;
  return {
    id: v.id,
    displayName: v.displayName,
    role: v.role,
    relationLabel: isStr(v.relationLabel) ? v.relationLabel : '',
    initials: isStr(v.initials) ? v.initials : '?',
    ...(isStr(v.photoDataUrl) && /^data:image\/(jpeg|png|webp);base64,/.test(v.photoDataUrl) && v.photoDataUrl.length <= 1_500_000 ? { photoDataUrl: v.photoDataUrl } : {}),
  };
}

function sanitizeRelationship(v: unknown): MockFamilyRelationship | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.assistedId) || !isStr(v.familyId) || !oneOf(v.permission, PERMISSIONS)) return null;
  return {
    id: v.id,
    assistedId: v.assistedId,
    familyId: v.familyId,
    relation: isStr(v.relation) ? v.relation : '',
    permission: v.permission,
  };
}

function sanitizeMemory(v: unknown, fallbackIso: string): MockMemory | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.assistedId) || !isStr(v.title) || !isStr(v.story)) return null;
  const media = Array.isArray(v.media) ? v.media.map(sanitizeMedia).filter((m): m is MockMedia => m !== null) : [];
  const memory: MockMemory = {
    id: v.id,
    assistedId: v.assistedId,
    title: v.title,
    story: v.story,
    people: Array.isArray(v.people) ? v.people.filter(isStr) : [],
    media,
    createdBy: isStr(v.createdBy) ? v.createdBy : '',
    archived: v.archived === true,
    createdAt: isStr(v.createdAt) ? v.createdAt : fallbackIso,
    updatedAt: isStr(v.updatedAt) ? v.updatedAt : fallbackIso,
  };
  if (isStr(v.date) && isValidPartialDate(v.date)) memory.date = v.date;
  return memory;
}

function sanitizeReminder(v: unknown): MockReminder | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.assistedId) || !isStr(v.title) || !isStr(v.instruction)) return null;
  if (!isValidTime(v.time as string)) return null;
  const recurrence = sanitizeRecurrence(v.recurrence);
  if (!recurrence || !oneOf(v.kind, KINDS)) return null;
  return {
    id: v.id,
    assistedId: v.assistedId,
    title: v.title,
    instruction: v.instruction,
    time: v.time as string,
    recurrence,
    kind: v.kind,
    active: v.active !== false,
    status: oneOf(v.status, STATUSES) ? v.status : 'pending',
    statusDay: isStr(v.statusDay) ? v.statusDay : '',
    createdBy: isStr(v.createdBy) ? v.createdBy : '',
  };
}

function sanitizeLog(v: unknown): MockRoutineLog | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.reminderId) || !oneOf(v.result, RESULTS) || !isStr(v.at) || !isStr(v.day)) return null;
  return {
    id: v.id,
    reminderId: v.reminderId,
    reminderTitle: isStr(v.reminderTitle) ? v.reminderTitle : 'Atividade',
    result: v.result,
    at: v.at,
    day: v.day,
    source: v.source === 'demo_seed' ? 'demo_seed' : 'assisted_confirmation',
  };
}

function sanitizeNotice(v: unknown): MockNotice | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.at) || !isStr(v.text)) return null;
  return { id: v.id, at: v.at, text: v.text, reminderId: isStr(v.reminderId) ? v.reminderId : undefined };
}

function mapList<T>(raw: unknown, fn: (v: unknown) => T | null): T[] {
  return Array.isArray(raw) ? raw.map(fn).filter((x): x is T => x !== null) : [];
}
export function validateState(raw: unknown, now: Date = new Date()): DemoState | null {
  if (!isObj(raw) || raw.version !== DEMO_STATE_VERSION) return null;
  const fallbackIso = toLocalIso(now);
  const profiles = mapList(raw.profiles, sanitizeProfile);
  if (!profiles.some((p) => p.role === 'assisted')) return null;
  if (!Array.isArray(raw.memories) || !Array.isArray(raw.reminders) || !Array.isArray(raw.relationships)) return null;
  return {
    version: DEMO_STATE_VERSION,
    profiles,
    relationships: mapList(raw.relationships, sanitizeRelationship),
    memories: mapList(raw.memories, (m) => sanitizeMemory(m, fallbackIso)),
    reminders: mapList(raw.reminders, sanitizeReminder),
    logs: mapList(raw.logs, sanitizeLog),
    notices: mapList(raw.notices, sanitizeNotice),
  };
}

export function loadState(storage: KeyValueStorage | null, now: Date = new Date()): LoadOutcome {
  if (!storage) return { state: buildSeedState(now), reason: 'unavailable', recovered: false };
  let text: string | null;
  try {
    text = storage.getItem(STORAGE_KEYS.state);
  } catch {
    return { state: buildSeedState(now), reason: 'unavailable', recovered: false };
  }
  if (text === null) return { state: buildSeedState(now), reason: 'missing', recovered: false };
  try {
    const valid = validateState(JSON.parse(text), now);
    if (valid) return { state: valid, reason: 'loaded', recovered: false };
  } catch {
  }
  return { state: buildSeedState(now), reason: 'invalid', recovered: true };
}

export interface SaveOutcome {
  ok: boolean;
  error?: string;
}
export function serializeState(state: DemoState): string {
  const clean: DemoState = {
    ...state,
    memories: state.memories.map((m) => ({
      ...m,
      media: m.media.map((x) => sanitizeMedia(x)).filter((x): x is MockMedia => x !== null),
    })),
  };
  return JSON.stringify(clean);
}

export function saveState(storage: KeyValueStorage | null, state: DemoState): SaveOutcome {
  if (!storage) {
    return { ok: false, error: 'Este navegador não permite guardar dados locais. As alterações valem só até fechar a página.' };
  }
  try {
    const text = serializeState(state);
    if (text.length > MAX_SERIALIZED_CHARS) {
      return { ok: false, error: 'Há informação demais para guardar neste aparelho. Remova alguns itens ou restaure os dados iniciais.' };
    }
    storage.setItem(STORAGE_KEYS.state, text);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Não foi possível guardar as alterações neste aparelho. Elas valem só até fechar a página.' };
  }
}

export function clearSavedState(storage: KeyValueStorage | null): void {
  try {
    storage?.removeItem(STORAGE_KEYS.state);
  } catch {
  }
}

export function loadPreferences(storage: KeyValueStorage | null): Preferences {
  if (!storage) return { ...DEFAULT_PREFERENCES };
  try {
    const text = storage.getItem(STORAGE_KEYS.prefs);
    if (!text) return { ...DEFAULT_PREFERENCES };
    const raw = JSON.parse(text) as unknown;
    if (!isObj(raw)) return { ...DEFAULT_PREFERENCES };
    return {
      textScale: oneOf(raw.textScale, SCALES) ? raw.textScale : DEFAULT_PREFERENCES.textScale,
      highContrast: typeof raw.highContrast === 'boolean' ? raw.highContrast : DEFAULT_PREFERENCES.highContrast,
      readAloud: typeof raw.readAloud === 'boolean' ? raw.readAloud : DEFAULT_PREFERENCES.readAloud,
      darkMode: typeof raw.darkMode === 'boolean' ? raw.darkMode : DEFAULT_PREFERENCES.darkMode,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(storage: KeyValueStorage | null, prefs: Preferences): SaveOutcome {
  try {
    storage?.setItem(STORAGE_KEYS.prefs, JSON.stringify(prefs));
    return { ok: !!storage };
  } catch {
    return { ok: false, error: 'Não foi possível guardar as preferências neste aparelho.' };
  }
}

export function loadSession(storage: KeyValueStorage | null): DemoSession {
  if (!storage) return { ...DEFAULT_SESSION };
  try {
    const text = storage.getItem(STORAGE_KEYS.session);
    if (!text) return { ...DEFAULT_SESSION };
    const raw = JSON.parse(text) as unknown;
    if (!isObj(raw)) return { ...DEFAULT_SESSION };
    return {
      entered: raw.entered === true,
      familyProfileId: isStr(raw.familyProfileId) ? raw.familyProfileId : null,
    };
  } catch {
    return { ...DEFAULT_SESSION };
  }
}

export function saveSession(storage: KeyValueStorage | null, session: DemoSession): void {
  try {
    storage?.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  } catch {
  }
}
