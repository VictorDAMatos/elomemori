import { Component, computed, effect, ElementRef, HostListener, inject, input, signal, untracked, viewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUndo, checkmark, helpBuoy, helpCircle, informationCircle, call, callOutline, mic, micOff, volumeHigh, volumeMute, keypad, pause, play } from 'ionicons/icons';
import { ReminderStatus, RoutineResult } from '../../core/models';
import { FeedbackService } from '../../core/services/feedback.service';
import { MockRoutineService } from '../../core/services/mock-routine.service';
import { MockFamilyService } from '../../core/services/mock-family.service';
import { MockSessionService } from '../../core/services/mock-session.service';
import { effectiveStatus } from '../../core/state/demo-engine';
import { formatPhone } from '../../core/util/phone';
import { describeRecurrence } from '../../core/util/dates';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { TimeHumanPipe } from '../../shared/pipes/format.pipes';

const RESPONSE_MESSAGES: Record<RoutineResult, string> = {
  done: 'Pronto! Registramos que você concluiu esta atividade.',
  help: 'Registramos que você precisa de ajuda. Nenhuma mensagem é enviada para fora do aplicativo.',
  forgot: 'Tudo bem. Registramos a sua resposta.',
};
@Component({
  selector: 'app-activity-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, StatusBadgeComponent, EmptyStateComponent, TimeHumanPipe],
  templateUrl: './activity.page.html',
  styleUrl: './activity.page.css',
})
export class ActivityPage implements OnDestroy {
  private readonly routine = inject(MockRoutineService);
  private readonly family = inject(MockFamilyService);
  private readonly session = inject(MockSessionService);
  readonly anaProfile = this.session.assistedProfile;
  readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);
  readonly id = input<string>();
  /** Id do contato para iniciar a ligação simulada ao abrir (vem da tela inicial). */
  readonly ligar = input<string>();
  readonly formatPhone = formatPhone;
  private autoCallStarted = false;

  readonly reminder = computed(() => this.routine.get(this.id()));
  readonly status = computed<ReminderStatus>(() => {
    const r = this.reminder();
    return r ? effectiveStatus(r, this.routine.todayKey()) : 'pending';
  });
  readonly recurrenceText = computed(() => {
    const r = this.reminder();
    return r ? describeRecurrence(r.recurrence) : '';
  });
  readonly noticeRecorded = signal(false);
  readonly requestId = signal<string | null>(null);
  readonly contacts = this.family.demoProfiles;
  readonly selectedContact = signal('');
  readonly chosenContact = computed(() => this.contacts().find((person) => person.id === this.selectedContact()) ?? null);
  readonly contactsPopupOpen = signal(false);
  readonly callActive = signal(false);
  readonly callMuted = signal(false);
  readonly callSpeaker = signal(false);
  readonly callPaused = signal(false);
  readonly callSeconds = signal(0);
  private callInterval: ReturnType<typeof setInterval> | null = null;
  readonly callTime = computed(() => { const s = this.callSeconds(); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; });

  private readonly endCallButton = viewChild<ElementRef<HTMLButtonElement>>('endCallButton');

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.callActive()) this.endCall();
    else if (this.contactsPopupOpen()) this.contactsPopupOpen.set(false);
  }

  constructor() {
    effect(() => { this.endCallButton()?.nativeElement.focus(); });
    effect(() => {
      const contactId = this.ligar();
      if (!contactId || this.autoCallStarted || !this.contacts().some((p) => p.id === contactId)) return;
      this.autoCallStarted = true;
      untracked(() => {
        this.selectedContact.set(contactId);
        this.startCall();
        void this.router.navigate([], { queryParams: { ligar: null }, queryParamsHandling: 'merge', replaceUrl: true });
      });
    });
    addIcons({ arrowUndo, checkmark, helpBuoy, helpCircle, informationCircle, call, callOutline, mic, micOff, volumeHigh, volumeMute, keypad, pause, play });
  }
  async confirmDone(): Promise<void> {
    const r = this.reminder();
    if (!r) return;
    const message =
      r.kind === 'medication'
        ? `Marque "Sim, concluí" só se você realmente já fez isto: "${r.title}". O aplicativo não sabe se você fez; ele apenas guarda a sua resposta.`
        : `Marque "Sim, concluí" se você já fez: "${r.title}".`;
    const confirmed = await this.feedback.confirm({
      header: 'Você concluiu esta atividade?',
      message,
      confirmText: 'Sim, concluí',
      cancelText: 'Ainda não',
    });
    if (confirmed) await this.record('done');
  }

  needHelp(): Promise<void> {
    return this.record('help');
  }

  dontRemember(): Promise<void> {
    return this.record('forgot');
  }
  async undo(): Promise<void> {
    const r = this.reminder();
    if (!r) return;
    const result = this.routine.undo(r.id);
    if (result.ok) {
      this.noticeRecorded.set(false);
      this.requestId.set(null);
      await this.feedback.info('Resposta desfeita. Você pode responder de novo quando quiser.');
    } else {
      await this.feedback.error(result.error);
    }
  }

  openContacts(): void { this.contactsPopupOpen.set(true); }

  chooseContact(id: string): void { this.selectedContact.set(id); this.contactsPopupOpen.set(false); }

  async contactBy(method: 'message' | 'call'): Promise<void> {
    const contact = this.contacts().find((person) => person.id === this.selectedContact());
    if (!contact) { await this.feedback.info('Escolha uma pessoa da lista primeiro.'); return; }
    if (method === 'call') {
      this.startCall();
      return;
    }
    await this.notifyFamily();
    if (this.noticeRecorded()) {
      await this.feedback.info(`Mensagem simulada para ${contact.displayName}: nada é enviado para fora do aplicativo.`);
    }
  }

  startCall(): void {
    this.callActive.set(true);
    this.callMuted.set(false);
    this.callSpeaker.set(false);
    this.callPaused.set(false);
    this.callSeconds.set(0);
    this.callInterval = setInterval(() => { if (!this.callPaused()) this.callSeconds.update((n) => n + 1); }, 1000);
  }

  toggleMute(): void { this.callMuted.update((v) => !v); }
  toggleSpeaker(): void { this.callSpeaker.update((v) => !v); }
  togglePause(): void { this.callPaused.update((v) => !v); }
  endCall(): void {
    this.callActive.set(false);
    if (this.callInterval) clearInterval(this.callInterval);
    this.callInterval = null;
  }
  ngOnDestroy(): void { if (this.callInterval) clearInterval(this.callInterval); }

  async notifyFamily(): Promise<void> {
    const r = this.reminder();
    if (!r) return;
    if (!this.selectedContact()) { await this.feedback.info('Escolha um familiar ou cuidador para receber o pedido.'); return; }
    const result = this.routine.notifyFamilySimulated(r.id, this.selectedContact());
    if (result.ok) {
      this.noticeRecorded.set(true);
      this.requestId.set(result.value.id);
      await this.feedback.success('Pedido registrado. O familiar poderá vê-lo na área da família.');
    } else { await this.feedback.error(result.error); }
  }

  async cancelHelpRequest(): Promise<void> {
    const id = this.requestId();
    if (!id) return;
    const changed = this.routine.updateNoticeStatus(id, 'cancelled');
    if (changed) { this.noticeRecorded.set(false); this.requestId.set(null); await this.feedback.info('Pedido cancelado.'); }
  }

  backToRoutine(): void {
    void this.router.navigateByUrl('/tabs/rotina');
  }

  private async record(result: RoutineResult): Promise<void> {
    const r = this.reminder();
    if (!r) return;
    const outcome = this.routine.respond(r.id, result);
    if (outcome.ok) {
      this.noticeRecorded.set(false);
      await this.feedback.success(RESPONSE_MESSAGES[result]);
    } else {
      await this.feedback.error(outcome.error);
    }
  }
}
