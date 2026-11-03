import { Component, ElementRef, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { NavController, IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, informationCircle, refresh, warningOutline } from 'ionicons/icons';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { ReminderDraft, ReminderKind, RecurrenceType, WEEKDAY_LONG } from '../../../core/models';
import { FeedbackService } from '../../../core/services/feedback.service';
import { MockRoutineService } from '../../../core/services/mock-routine.service';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { FieldErrors, LIMITS, validateReminderDraft } from '../../../core/state/demo-engine';
import { wait } from '../../../core/util/simulated-loading';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { FamilyContextComponent } from '../../../shared/components/family-context.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
@Component({
  selector: 'app-reminder-form-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, FamilyContextComponent, EmptyStateComponent],
  templateUrl: './reminder-form.page.html',
  styleUrl: './reminder-form.page.css',
})
export class ReminderFormPage implements OnInit, HasUnsavedChanges {
  private readonly routine = inject(MockRoutineService);
  private readonly feedback = inject(FeedbackService);
  private readonly nav = inject(NavController);
  readonly session = inject(MockSessionService);
  readonly id = input<string>();

  readonly errorSummary = viewChild<ElementRef<HTMLElement>>('errorSummary');

  readonly title = signal('');
  readonly instruction = signal('');
  readonly kind = signal<ReminderKind>('activity');
  readonly time = signal('08:00');
  readonly recurrenceType = signal<RecurrenceType>('daily');
  readonly days = signal<number[]>([]);
  readonly onceDate = signal('');
  readonly active = signal(true);

  readonly errors = signal<FieldErrors>({});
  readonly submitted = signal(false);
  readonly saving = signal(false);
  readonly dirty = signal(false);

  readonly limits = LIMITS;
  readonly weekdays = WEEKDAY_LONG;
  readonly recurrenceOptions: { value: RecurrenceType; label: string }[] = [
    { value: 'daily', label: 'Todos os dias' },
    { value: 'weekdays', label: 'De segunda a sexta' },
    { value: 'weekly', label: 'Em dias da semana que eu escolher' },
    { value: 'once', label: 'Só uma vez, em uma data' },
  ];

  readonly isEdit = computed(() => !!this.id());
  readonly existing = computed(() => this.routine.get(this.id()));
  readonly notFound = computed(() => this.isEdit() && !this.existing());
  readonly errorList = computed(() => Object.values(this.errors()));
  readonly today = this.routine.todayKey;

  constructor() {
    addIcons({ checkmarkCircle, informationCircle, refresh, warningOutline });
  }

  ngOnInit(): void {
    const r = this.existing();
    if (!r) return;
    this.title.set(r.title);
    this.instruction.set(r.instruction);
    this.kind.set(r.kind);
    this.time.set(r.time);
    this.recurrenceType.set(r.recurrence.type);
    this.days.set([...(r.recurrence.days ?? [])]);
    this.onceDate.set(r.recurrence.date ?? '');
    this.active.set(r.active);
  }

  set<T>(target: { set(value: T): void }, value: T): void {
    target.set(value);
    this.dirty.set(true);
  }

  toggleDay(day: number, checked: boolean): void {
    this.days.update((list) => (checked ? Array.from(new Set([...list, day])) : list.filter((d) => d !== day)));
    this.dirty.set(true);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    void this.save();
  }

  async save(): Promise<void> {
    if (this.saving()) return;
    this.submitted.set(true);
    const draft = this.buildDraft();
    const errors = validateReminderDraft(draft);
    this.errors.set(errors);
    if (Object.keys(errors).length > 0) {
      queueMicrotask(() => this.errorSummary()?.nativeElement.focus());
      return;
    }

    this.saving.set(true);
    await wait(500);
    const id = this.id();
    const result = id ? this.routine.update(id, draft) : this.routine.create(draft);
    this.saving.set(false);

    if (!result.ok) {
      this.errors.set(result.fieldErrors ?? {});
      await this.feedback.error(result.error);
      queueMicrotask(() => this.errorSummary()?.nativeElement.focus());
      return;
    }
    this.dirty.set(false);
    await this.feedback.success(
      id
        ? 'Atividade atualizada.'
        : 'Atividade adicionada. Nenhuma notificação externa foi agendada.',
    );
    this.nav.navigateBack('/familia/rotina');
  }
  cancel(): void {
    this.goBack();
  }

  goBack(): void {
    this.nav.navigateBack('/familia/rotina');
  }

  hasUnsavedChanges(): boolean {
    return this.dirty() && !this.saving();
  }

  confirmDiscard(): Promise<boolean> {
    return this.feedback.confirm({
      header: 'Descartar as alterações?',
      message: 'O que você escreveu ou escolheu nesta tela não será guardado.',
      confirmText: 'Sim, descartar',
      cancelText: 'Continuar editando',
      destructive: true,
    });
  }

  private buildDraft(): ReminderDraft {
    const type = this.recurrenceType();
    return {
      title: this.title(),
      instruction: this.instruction(),
      time: this.time(),
      kind: this.kind(),
      active: this.active(),
      recurrence:
        type === 'weekly'
          ? { type, days: this.days() }
          : type === 'once'
            ? { type, date: this.onceDate() }
            : { type },
    };
  }
}
