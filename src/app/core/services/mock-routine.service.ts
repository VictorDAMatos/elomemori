import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { MockNotice, MockReminder, MockRoutineLog, ReminderDraft, ReminderStatus, RoutineResult } from '../models';
import {
  OpResult,
  addSimulatedNotice,
  createReminder,
  deleteReminder,
  getReminder,
  listReminders,
  nextReminder,
  recentLogs,
  recentNotices,
  respondToReminder,
  routineForDay,
  setReminderActive,
  summarizeDay,
  undoLastResponse,
  updateReminder,
} from '../state/demo-engine';
import { toDayKey } from '../util/dates';
import { DemoStateService } from './demo-state.service';
import { MockSessionService } from './mock-session.service';
@Injectable({ providedIn: 'root' })
export class MockRoutineService {
  private readonly demo = inject(DemoStateService);
  private readonly session = inject(MockSessionService);
  readonly now = signal(new Date());
  readonly todayKey = computed(() => toDayKey(this.now()));

  readonly items = computed(() => routineForDay(this.demo.state(), this.todayKey()));
  readonly summary = computed(() => summarizeDay(this.items()));
  readonly next = computed(() => nextReminder(this.demo.state(), this.now()));
  readonly reminders = computed(() => listReminders(this.demo.state()));
  readonly history = computed(() => recentLogs(this.demo.state(), 12));
  readonly notices = computed(() => recentNotices(this.demo.state(), 5));

  constructor() {
    const timer = setInterval(() => this.now.set(new Date()), 30_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  get(id: string | null | undefined): MockReminder | undefined {
    return getReminder(this.demo.state(), id);
  }
  statusOf(id: string): ReminderStatus {
    return this.items().find((i) => i.reminder.id === id)?.status ?? 'pending';
  }
  respond(id: string, result: RoutineResult): OpResult<MockRoutineLog> {
    return this.apply(respondToReminder(this.demo.state(), id, result, new Date()));
  }

  undo(id: string): OpResult<ReminderStatus> {
    return this.apply(undoLastResponse(this.demo.state(), id, new Date()));
  }
  notifyFamilySimulated(reminderId?: string, recipientId?: string): OpResult<MockNotice> {
    return this.apply(addSimulatedNotice(this.demo.state(), reminderId, recipientId, new Date()));
  }

  updateNoticeStatus(id: string, status: NonNullable<MockNotice['status']>): boolean {
    const state = this.demo.state();
    if (!state.notices.some((n) => n.id === id)) return false;
    this.demo.commit({ ...state, notices: state.notices.map((n) => n.id === id ? { ...n, status } : n) });
    return true;
  }

  create(draft: ReminderDraft): OpResult<MockReminder> {
    const by = this.session.familyProfile()?.id ?? 'profile-marta';
    return this.apply(createReminder(this.demo.state(), draft, by, new Date()));
  }

  update(id: string, draft: ReminderDraft): OpResult<MockReminder> {
    return this.apply(updateReminder(this.demo.state(), id, draft, new Date()));
  }

  setActive(id: string, active: boolean): OpResult<MockReminder> {
    return this.apply(setReminderActive(this.demo.state(), id, active));
  }

  remove(id: string): OpResult<MockReminder> {
    return this.apply(deleteReminder(this.demo.state(), id));
  }

  private apply<T>(result: OpResult<T>): OpResult<T> {
    if (result.ok) this.demo.commit(result.state);
    return result;
  }
}
