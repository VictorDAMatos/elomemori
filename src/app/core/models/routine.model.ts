export type ReminderStatus = 'pending' | 'done' | 'help' | 'forgot';
export type RoutineResult = 'done' | 'help' | 'forgot';

export type ReminderKind = 'activity' | 'medication';

export type RecurrenceType = 'daily' | 'weekdays' | 'weekly' | 'once';

export interface Recurrence {
  type: RecurrenceType;
  days?: number[];
  date?: string;
}

export interface MockReminder {
  id: string;
  assistedId: string;
  title: string;
  instruction: string;
  time: string;
  recurrence: Recurrence;
  kind: ReminderKind;
  active: boolean;
  status: ReminderStatus;
  statusDay: string;
  createdBy: string;
}

export type RoutineLogSource = 'assisted_confirmation' | 'demo_seed';

export interface MockRoutineLog {
  id: string;
  reminderId: string;
  reminderTitle: string;
  result: RoutineResult;
  at: string;
  day: string;
  source: RoutineLogSource;
}
export type HelpRequestStatus = 'requested' | 'seen' | 'attended' | 'cancelled';

export interface MockNotice {
  id: string;
  at: string;
  reminderId?: string;
  recipientId?: string;
  status?: HelpRequestStatus;
  text: string;
}

export interface ReminderDraft {
  title: string;
  instruction: string;
  time: string;
  recurrence: Recurrence;
  kind: ReminderKind;
  active: boolean;
}

export const STATUS_LABELS: Record<ReminderStatus, string> = {
  pending: 'Pendente',
  done: 'Concluída',
  help: 'Preciso de ajuda',
  forgot: 'Não me lembro',
};

export const RESULT_LABELS: Record<RoutineResult, string> = {
  done: 'Concluí',
  help: 'Preciso de ajuda',
  forgot: 'Não me lembro',
};

export const WEEKDAY_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;
export const WEEKDAY_LONG = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;
