import {
  DemoState,
  FamilyPermission,
  MemoryDraft,
  MockFamilyRelationship,
  MockMedia,
  MockMemory,
  MockNotice,
  MockProfile,
  MockReminder,
  MockRoutineLog,
  ReminderDraft,
  ReminderStatus,
  RoutineResult,
} from '../models';
import {
  isDueOn,
  isValidPartialDate,
  isValidTime,
  minutesOf,
  minutesOfDate,
  toDayKey,
  toLocalIso,
} from '../util/dates';

export type FieldErrors = Record<string, string>;

export type OpResult<T> =
  | { ok: true; state: DemoState; value: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

function fail<T>(error: string, fieldErrors?: FieldErrors): OpResult<T> {
  return { ok: false, error, fieldErrors };
}

function success<T>(state: DemoState, value: T): OpResult<T> {
  return { ok: true, state, value };
}

let idCounter = 0;
export function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

export const LIMITS = {
  memoryTitle: 80,
  memoryStory: 600,
  personName: 40,
  people: 10,
  mediaPerMemory: 8,
  reminderTitle: 60,
  reminderInstruction: 200,
  familyName: 40,
  familyRelation: 30,
} as const;

export function assistedProfile(state: DemoState): MockProfile | undefined {
  return state.profiles.find((p) => p.role === 'assisted');
}

export function profileById(state: DemoState, id: string | null | undefined): MockProfile | undefined {
  return id ? state.profiles.find((p) => p.id === id) : undefined;
}

export interface FamilyMember {
  relationship: MockFamilyRelationship;
  profile: MockProfile;
}

export function listFamily(state: DemoState): FamilyMember[] {
  const members: FamilyMember[] = [];
  for (const relationship of state.relationships) {
    const profile = profileById(state, relationship.familyId);
    if (profile && profile.role === 'family') members.push({ relationship, profile });
  }
  return members;
}

export function permissionOf(state: DemoState, familyProfileId: string | null | undefined): FamilyPermission | null {
  if (!familyProfileId) return null;
  return state.relationships.find((r) => r.familyId === familyProfileId)?.permission ?? null;
}

export function canEdit(permission: FamilyPermission | null): boolean {
  return permission === 'edit' || permission === 'manage';
}

export function canManageMembers(permission: FamilyPermission | null): boolean {
  return permission === 'manage';
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function addFamilyMember(
  state: DemoState,
  input: { displayName: string; relation: string; permission: FamilyPermission },
): OpResult<FamilyMember> {
  const name = input.displayName.trim();
  const relation = input.relation.trim();
  const errors: FieldErrors = {};
  if (!name) errors['displayName'] = 'Escreva o nome do familiar fictício.';
  else if (name.length > LIMITS.familyName) errors['displayName'] = `Use no máximo ${LIMITS.familyName} letras no nome.`;
  else if (state.profiles.some((p) => p.displayName.toLowerCase() === name.toLowerCase())) {
    errors['displayName'] = 'Já existe alguém com esse nome. Use outro nome.';
  }
  if (!relation) errors['relation'] = 'Escreva o parentesco, por exemplo "Sobrinha".';
  else if (relation.length > LIMITS.familyRelation) errors['relation'] = `Use no máximo ${LIMITS.familyRelation} letras no parentesco.`;
  if (Object.keys(errors).length) return fail('Confira os campos destacados.', errors);

  const assisted = assistedProfile(state);
  if (!assisted) return fail('Não há perfil da pessoa assistida. Restaure os dados iniciais.');
  const profile: MockProfile = {
    id: newId('profile'),
    displayName: name,
    role: 'family',
    relationLabel: relation,
    initials: initialsOf(name),
  };
  const relationship: MockFamilyRelationship = {
    id: newId('rel'),
    assistedId: assisted.id,
    familyId: profile.id,
    relation,
    permission: input.permission,
  };
  return success(
    { ...state, profiles: [...state.profiles, profile], relationships: [...state.relationships, relationship] },
    { profile, relationship },
  );
}

function managersAfter(state: DemoState, familyId: string, newPermission: FamilyPermission | 'removed'): number {
  return state.relationships.filter((r) => {
    if (r.familyId === familyId) return newPermission === 'manage';
    return r.permission === 'manage';
  }).length;
}

export function removeFamilyMember(state: DemoState, familyId: string, actingProfileId: string | null): OpResult<true> {
  const rel = state.relationships.find((r) => r.familyId === familyId);
  if (!rel) return fail('Esse familiar não está mais na lista.');
  if (familyId === actingProfileId) return fail('Você não pode remover o perfil que está usando.');
  if (managersAfter(state, familyId, 'removed') < 1) {
    return fail('É preciso manter pelo menos uma pessoa com permissão "Gerenciar tudo".');
  }
  return success(
    {
      ...state,
      relationships: state.relationships.filter((r) => r.familyId !== familyId),
      profiles: state.profiles.filter((p) => p.id !== familyId),
    },
    true,
  );
}

export function setMemberPermission(state: DemoState, familyId: string, permission: FamilyPermission): OpResult<true> {
  const rel = state.relationships.find((r) => r.familyId === familyId);
  if (!rel) return fail('Esse familiar não está mais na lista.');
  if (managersAfter(state, familyId, permission) < 1) {
    return fail('É preciso manter pelo menos uma pessoa com permissão "Gerenciar tudo".');
  }
  return success(
    { ...state, relationships: state.relationships.map((r) => (r.familyId === familyId ? { ...r, permission } : r)) },
    true,
  );
}

function isFutureDate(date: string, now: Date): boolean {
  const parts = date.split('-').map(Number);
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  if (parts.length === 1) return parts[0] > y;
  if (parts.length === 2) return parts[0] > y || (parts[0] === y && parts[1] > m);
  return date > toDayKey(now);
}

export function validateMemoryDraft(draft: MemoryDraft, now: Date = new Date()): FieldErrors {
  const errors: FieldErrors = {};
  const title = draft.title.trim();
  const story = draft.story.trim();
  if (!title) errors['title'] = 'Escreva um título para a lembrança.';
  else if (title.length > LIMITS.memoryTitle) errors['title'] = `O título pode ter no máximo ${LIMITS.memoryTitle} letras.`;
  if (!story) errors['story'] = 'Conte a história em poucas palavras.';
  else if (story.length > LIMITS.memoryStory) errors['story'] = `A história pode ter no máximo ${LIMITS.memoryStory} letras.`;
  const date = draft.date?.trim();
  if (date) {
    if (!isValidPartialDate(date)) errors['date'] = 'Use uma data válida (ano, mês e ano, ou dia completo).';
    else if (isFutureDate(date, now)) errors['date'] = 'A data não pode ser no futuro.';
  }
  if (draft.people.length > LIMITS.people) errors['people'] = `Informe no máximo ${LIMITS.people} pessoas.`;
  else if (draft.people.some((p) => p.trim().length > LIMITS.personName)) {
    errors['people'] = `Cada nome pode ter no máximo ${LIMITS.personName} letras.`;
  }
  if (draft.media.length > LIMITS.mediaPerMemory) {
    errors['media'] = `Cada lembrança pode ter no máximo ${LIMITS.mediaPerMemory} arquivos. Remova alguns.`;
  }
  return errors;
}

function normalizeDraft(draft: MemoryDraft) {
  return {
    title: draft.title.trim(),
    story: draft.story.trim(),
    date: draft.date?.trim() || undefined,
    people: Array.from(new Set(draft.people.map((p) => p.trim()).filter(Boolean))),
    media: draft.media,
  };
}
function compareMemories(a: MockMemory, b: MockMemory): number {
  if (a.date && b.date) return b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt);
  if (a.date) return -1;
  if (b.date) return 1;
  return b.updatedAt.localeCompare(a.updatedAt);
}

export function listMemories(state: DemoState, options: { archived?: boolean } = {}): MockMemory[] {
  const archived = options.archived ?? false;
  return state.memories.filter((m) => m.archived === archived).sort(compareMemories);
}

export function getMemory(state: DemoState, id: string | null | undefined): MockMemory | undefined {
  return id ? state.memories.find((m) => m.id === id) : undefined;
}

export function createMemory(state: DemoState, draft: MemoryDraft, createdBy: string, now: Date = new Date()): OpResult<MockMemory> {
  const fieldErrors = validateMemoryDraft(draft, now);
  if (Object.keys(fieldErrors).length) return fail('Confira os campos destacados.', fieldErrors);
  const assisted = assistedProfile(state);
  if (!assisted) return fail('Não há perfil da pessoa assistida. Restaure os dados iniciais.');
  const iso = toLocalIso(now);
  const memory: MockMemory = {
    id: newId('mem'),
    assistedId: assisted.id,
    ...normalizeDraft(draft),
    createdBy,
    archived: false,
    createdAt: iso,
    updatedAt: iso,
  };
  return success({ ...state, memories: [...state.memories, memory] }, memory);
}

export function updateMemory(state: DemoState, id: string, draft: MemoryDraft, now: Date = new Date()): OpResult<MockMemory> {
  const current = getMemory(state, id);
  if (!current) return fail('Essa lembrança não foi encontrada. Ela pode ter sido excluída.');
  const fieldErrors = validateMemoryDraft(draft, now);
  if (Object.keys(fieldErrors).length) return fail('Confira os campos destacados.', fieldErrors);
  const updated: MockMemory = { ...current, ...normalizeDraft(draft), updatedAt: toLocalIso(now) };
  return success({ ...state, memories: state.memories.map((m) => (m.id === id ? updated : m)) }, updated);
}

export function setMemoryArchived(state: DemoState, id: string, archived: boolean, now: Date = new Date()): OpResult<MockMemory> {
  const current = getMemory(state, id);
  if (!current) return fail('Essa lembrança não foi encontrada. Ela pode ter sido excluída.');
  const updated: MockMemory = { ...current, archived, updatedAt: toLocalIso(now) };
  return success({ ...state, memories: state.memories.map((m) => (m.id === id ? updated : m)) }, updated);
}

export function deleteMemory(state: DemoState, id: string): OpResult<MockMemory> {
  const current = getMemory(state, id);
  if (!current) return fail('Essa lembrança já não existe.');
  return success({ ...state, memories: state.memories.filter((m) => m.id !== id) }, current);
}
export function makeSessionMedia(id: string, type: MockMedia['type'], name: string): MockMedia {
  return { id, type, name, source: 'session' };
}

export function effectiveStatus(reminder: MockReminder, dayKey: string): ReminderStatus {
  return reminder.statusDay === dayKey ? reminder.status : 'pending';
}

export interface RoutineItem {
  reminder: MockReminder;
  status: ReminderStatus;
}

export function listReminders(state: DemoState, options: { activeOnly?: boolean } = {}): MockReminder[] {
  return state.reminders
    .filter((r) => (options.activeOnly ? r.active : true))
    .sort((a, b) => minutesOf(a.time) - minutesOf(b.time) || a.title.localeCompare(b.title, 'pt-BR'));
}

export function getReminder(state: DemoState, id: string | null | undefined): MockReminder | undefined {
  return id ? state.reminders.find((r) => r.id === id) : undefined;
}
export function routineForDay(state: DemoState, dayKey: string): RoutineItem[] {
  return listReminders(state, { activeOnly: true })
    .filter((r) => isDueOn(r.recurrence, dayKey))
    .map((reminder) => ({ reminder, status: effectiveStatus(reminder, dayKey) }));
}

export interface DaySummary {
  total: number;
  done: number;
  pending: number;
  help: number;
  forgot: number;
}

export function summarizeDay(items: RoutineItem[]): DaySummary {
  const s: DaySummary = { total: items.length, done: 0, pending: 0, help: 0, forgot: 0 };
  for (const i of items) s[i.status] += 1;
  return s;
}
export function nextReminder(state: DemoState, now: Date): RoutineItem | null {
  const pending = routineForDay(state, toDayKey(now)).filter((i) => i.status === 'pending');
  if (pending.length === 0) return null;
  const nowMin = minutesOfDate(now);
  return pending.find((i) => minutesOf(i.reminder.time) >= nowMin) ?? pending[0];
}

export function validateReminderDraft(draft: ReminderDraft, now: Date = new Date()): FieldErrors {
  const errors: FieldErrors = {};
  const title = draft.title.trim();
  const instruction = draft.instruction.trim();
  if (!title) errors['title'] = 'Escreva o nome da atividade.';
  else if (title.length > LIMITS.reminderTitle) errors['title'] = `O nome pode ter no máximo ${LIMITS.reminderTitle} letras.`;
  if (!instruction) errors['instruction'] = 'Escreva o que a pessoa deve fazer, em uma frase simples.';
  else if (instruction.length > LIMITS.reminderInstruction) {
    errors['instruction'] = `A instrução pode ter no máximo ${LIMITS.reminderInstruction} letras.`;
  }
  if (!isValidTime(draft.time)) errors['time'] = 'Escolha um horário válido.';
  const r = draft.recurrence;
  if (r.type === 'weekly' && (!r.days || r.days.length === 0)) errors['recurrence'] = 'Escolha pelo menos um dia da semana.';
  if (r.type === 'once') {
    if (!r.date || !isValidPartialDate(r.date) || r.date.length !== 10) errors['recurrence'] = 'Escolha a data em que a atividade acontece.';
    else if (r.date < toDayKey(now)) errors['recurrence'] = 'Escolha uma data de hoje em diante.';
  }
  return errors;
}

function normalizeReminderDraft(draft: ReminderDraft): ReminderDraft {
  const r = draft.recurrence;
  return {
    ...draft,
    title: draft.title.trim(),
    instruction: draft.instruction.trim(),
    recurrence:
      r.type === 'weekly'
        ? { type: 'weekly', days: Array.from(new Set(r.days ?? [])).sort((a, b) => a - b) }
        : r.type === 'once'
          ? { type: 'once', date: r.date }
          : { type: r.type },
  };
}

export function createReminder(state: DemoState, draft: ReminderDraft, createdBy: string, now: Date = new Date()): OpResult<MockReminder> {
  const fieldErrors = validateReminderDraft(draft, now);
  if (Object.keys(fieldErrors).length) return fail('Confira os campos destacados.', fieldErrors);
  const assisted = assistedProfile(state);
  if (!assisted) return fail('Não há perfil da pessoa assistida. Restaure os dados iniciais.');
  const reminder: MockReminder = {
    id: newId('rem'),
    assistedId: assisted.id,
    ...normalizeReminderDraft(draft),
    status: 'pending',
    statusDay: toDayKey(now),
    createdBy,
  };
  return success({ ...state, reminders: [...state.reminders, reminder] }, reminder);
}

export function updateReminder(state: DemoState, id: string, draft: ReminderDraft, now: Date = new Date()): OpResult<MockReminder> {
  const current = getReminder(state, id);
  if (!current) return fail('Essa atividade não foi encontrada. Ela pode ter sido excluída.');
  const fieldErrors = validateReminderDraft(draft, now);
  if (Object.keys(fieldErrors).length) return fail('Confira os campos destacados.', fieldErrors);
  const updated: MockReminder = { ...current, ...normalizeReminderDraft(draft) };
  return success({ ...state, reminders: state.reminders.map((r) => (r.id === id ? updated : r)) }, updated);
}

export function setReminderActive(state: DemoState, id: string, active: boolean): OpResult<MockReminder> {
  const current = getReminder(state, id);
  if (!current) return fail('Essa atividade não foi encontrada.');
  const updated = { ...current, active };
  return success({ ...state, reminders: state.reminders.map((r) => (r.id === id ? updated : r)) }, updated);
}
export function deleteReminder(state: DemoState, id: string): OpResult<MockReminder> {
  const current = getReminder(state, id);
  if (!current) return fail('Essa atividade já não existe.');
  return success({ ...state, reminders: state.reminders.filter((r) => r.id !== id) }, current);
}
export function respondToReminder(state: DemoState, id: string, result: RoutineResult, now: Date = new Date()): OpResult<MockRoutineLog> {
  const reminder = getReminder(state, id);
  if (!reminder) return fail('Essa atividade não foi encontrada. Ela pode ter sido alterada pela família.');
  const day = toDayKey(now);
  const log: MockRoutineLog = {
    id: newId('log'),
    reminderId: id,
    reminderTitle: reminder.title,
    result,
    at: toLocalIso(now),
    day,
    source: 'assisted_confirmation',
  };
  return success(
    {
      ...state,
      reminders: state.reminders.map((r) => (r.id === id ? { ...r, status: result, statusDay: day } : r)),
      logs: [...state.logs, log],
    },
    log,
  );
}
export function undoLastResponse(state: DemoState, id: string, now: Date = new Date()): OpResult<ReminderStatus> {
  const reminder = getReminder(state, id);
  if (!reminder) return fail('Essa atividade não foi encontrada.');
  const day = toDayKey(now);
  const todays = state.logs.filter((l) => l.reminderId === id && l.day === day && l.source === 'assisted_confirmation');
  if (todays.length === 0) return fail('Ainda não há resposta de hoje para desfazer.');
  const last = todays[todays.length - 1];
  const remaining = state.logs.filter((l) => l.id !== last.id);
  const previous = todays.length > 1 ? todays[todays.length - 2].result : 'pending';
  return success(
    {
      ...state,
      logs: remaining,
      reminders: state.reminders.map((r) => (r.id === id ? { ...r, status: previous, statusDay: day } : r)),
    },
    previous,
  );
}
export function recentLogs(state: DemoState, limit = 10): MockRoutineLog[] {
  return [...state.logs].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
export function addSimulatedNotice(state: DemoState, reminderId: string | undefined, recipientId?: string, now: Date = new Date()): OpResult<MockNotice> {
  const reminder = reminderId ? getReminder(state, reminderId) : undefined;
  const recipient = recipientId ? profileById(state, recipientId) : undefined;
  const notice: MockNotice = {
    id: newId('notice'),
    at: toLocalIso(now),
    reminderId,
    recipientId,
    status: 'requested',
    text: reminder
      ? `Pedido de ajuda para "${reminder.title}"${recipient ? ` para ${recipient.displayName}` : ''}.`
      : 'Pedido de ajuda registrado no aplicativo.',
  };
  return success({ ...state, notices: [...state.notices, notice] }, notice);
}

export function recentNotices(state: DemoState, limit = 5): MockNotice[] {
  return [...state.notices].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
