import { MockNotice, MockReminder, MockRoutineLog, RoutineResult } from '../app/core/models/routine.model';
import { addDays, minutesOf, toDayKey, toLocalIso } from '../app/core/util/dates';

interface ReminderSeed {
  id: string;
  title: string;
  instruction: string;
  time: string;
  kind: MockReminder['kind'];
  recurrence: MockReminder['recurrence'];
}

const REMINDER_SEEDS: ReminderSeed[] = [
  {
    id: 'rem-cafe',
    title: 'Café da manhã',
    instruction: 'Sentar à mesa e tomar o café da manhã com a família.',
    time: '08:00',
    kind: 'activity',
    recurrence: { type: 'daily' },
  },
  {
    id: 'rem-remedio-manha',
    title: 'Remédio da manhã (exemplo)',
    instruction: 'Pegar o remédio na caixinha da cozinha, do jeito que a receita indica. Exemplo fictício de demonstração.',
    time: '09:00',
    kind: 'medication',
    recurrence: { type: 'daily' },
  },
  {
    id: 'rem-caminhada',
    title: 'Caminhada no quintal',
    instruction: 'Dar uma volta tranquila no quintal e ver as roseiras.',
    time: '10:30',
    kind: 'activity',
    recurrence: { type: 'daily' },
  },
  {
    id: 'rem-almoco',
    title: 'Almoço',
    instruction: 'Almoçar com a família. Hoje tem a comida de que você gosta.',
    time: '12:30',
    kind: 'activity',
    recurrence: { type: 'daily' },
  },
  {
    id: 'rem-cha',
    title: 'Chá da tarde com os netos',
    instruction: 'Tomar um chá e conversar um pouco com os netos.',
    time: '15:30',
    kind: 'activity',
    recurrence: { type: 'weekdays' },
  },
  {
    id: 'rem-video-prima',
    title: 'Conversa por vídeo com a prima Lúcia',
    instruction: 'A Marta vai ajudar a abrir a chamada de vídeo com a prima Lúcia.',
    time: '16:30',
    kind: 'activity',
    recurrence: { type: 'weekly', days: [3] },
  },
  {
    id: 'rem-remedio-noite',
    title: 'Remédio da noite (exemplo)',
    instruction: 'Pegar o remédio na caixinha, do jeito que a receita indica. Exemplo fictício de demonstração.',
    time: '19:00',
    kind: 'medication',
    recurrence: { type: 'daily' },
  },
  {
    id: 'rem-dormir',
    title: 'Hora de se preparar para dormir',
    instruction: 'Escovar os dentes, vestir o pijama e apagar a luz do quarto.',
    time: '21:00',
    kind: 'activity',
    recurrence: { type: 'daily' },
  },
];

export function buildMockReminders(today: string): MockReminder[] {
  return REMINDER_SEEDS.map((s) => ({
    ...s,
    assistedId: 'profile-ana',
    active: true,
    status: 'pending' as const,
    statusDay: today,
    createdBy: 'profile-marta',
  }));
}
export function buildMockLogs(now: Date): { logs: MockRoutineLog[]; notices: MockNotice[] } {
  const yesterday = addDays(now, -1);
  const day = toDayKey(yesterday);
  const results: Record<string, RoutineResult> = {
    'rem-cafe': 'done',
    'rem-remedio-manha': 'done',
    'rem-caminhada': 'done',
    'rem-almoco': 'done',
    'rem-cha': 'forgot',
    'rem-remedio-noite': 'help',
    'rem-dormir': 'done',
  };
  const logs: MockRoutineLog[] = [];
  const notices: MockNotice[] = [];
  for (const seed of REMINDER_SEEDS) {
    const result = results[seed.id];
    if (!result) continue;
    const minutes = minutesOf(seed.time) + 6;
    const at = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), Math.floor(minutes / 60), minutes % 60, 0);
    const iso = toLocalIso(at);
    logs.push({
      id: `log-seed-${seed.id}`,
      reminderId: seed.id,
      reminderTitle: seed.title,
      result,
      at: iso,
      day,
      source: 'demo_seed',
    });
    if (result === 'help') {
      notices.push({
        id: `notice-seed-${seed.id}`,
        at: iso,
        reminderId: seed.id,
        text: `Registro de demonstração: "${seed.title}" ficou marcado como "Preciso de ajuda". Nenhuma mensagem foi enviada.`,
      });
    }
  }
  logs.sort((a, b) => a.at.localeCompare(b.at));
  return { logs, notices };
}
