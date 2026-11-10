import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { call, checkmarkCircle, chevronForward, images, informationCircle, time } from 'ionicons/icons';
import { FeedbackService } from '../../core/services/feedback.service';
import { MockFamilyService } from '../../core/services/mock-family.service';
import { MockMemoryService } from '../../core/services/mock-memory.service';
import { MockRoutineService } from '../../core/services/mock-routine.service';
import { MockSessionService } from '../../core/services/mock-session.service';
import { formatPhone } from '../../core/util/phone';
import { getBrowserStorage } from '../../core/state/persistence';
import { formatLongDay, greetingFor } from '../../core/util/dates';
import { ContactPickerComponent } from '../../shared/components/contact-picker.component';
import { HoldButtonComponent } from '../../shared/components/hold-button.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RecoveryNoticeComponent } from '../../shared/components/recovery-notice.component';
import { TimeHumanPipe } from '../../shared/pipes/format.pipes';

const WELCOME_KEY = 'elomemori.demo.welcome.v1';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, RecoveryNoticeComponent, HoldButtonComponent, ContactPickerComponent, TimeHumanPipe],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private readonly routine = inject(MockRoutineService);
  private readonly session = inject(MockSessionService);
  private readonly router = inject(Router);
  private readonly feedback = inject(FeedbackService);
  private readonly family = inject(MockFamilyService);
  private readonly memoryService = inject(MockMemoryService);
  private readonly storage = getBrowserStorage();

  readonly greeting = computed(() => greetingFor(this.routine.now()));
  readonly dayText = computed(() => formatLongDay(this.routine.now()));
  readonly firstName = computed(() => this.session.assistedProfile()?.displayName.split(' ')[0] ?? '');
  readonly next = this.routine.next;
  readonly summary = this.routine.summary;
  readonly memoryCount = computed(() => this.memoryService.memories().length);
  /** Perfis que podem ser chamados: todos, menos o perfil familiar em uso. */
  readonly contacts = computed(() => this.family.demoProfiles().filter((p) => p.id !== this.session.familyProfile()?.id));
  readonly pendingReminderId = signal<string | null>(null);
  readonly doneRatio = computed(() => {
    const s = this.summary();
    return s.total ? Math.round((s.done / s.total) * 100) : 0;
  });
  readonly showWelcome = signal(this.readWelcomePending());

  constructor() {
    addIcons({ call, checkmarkCircle, chevronForward, images, informationCircle, time });
  }

  dismissWelcome(): void {
    this.showWelcome.set(false);
    try {
      this.storage?.setItem(WELCOME_KEY, 'dismissed');
    } catch {
    }
  }

  /** Chamado depois de segurar o botão por 5 s: abre a lista de contatos. */
  requestHelp(reminderId: string): void {
    if (!this.contacts().length) {
      void this.feedback.info('Ainda não há familiar ou cuidador cadastrado para receber o pedido.');
      return;
    }
    this.pendingReminderId.set(reminderId);
  }

  closePicker(): void {
    this.pendingReminderId.set(null);
  }

  /** Contato escolhido: pede a confirmação final antes da ligação simulada. */
  async pickContact(contactId: string): Promise<void> {
    const reminderId = this.pendingReminderId();
    const contact = this.contacts().find((p) => p.id === contactId);
    if (!reminderId || !contact) return;
    this.pendingReminderId.set(null);
    const phone = contact.phone ? ` (${formatPhone(contact.phone)})` : '';
    const confirmed = await this.feedback.confirm({
      header: `Ligar para ${contact.displayName}?`,
      message: `${contact.relationLabel}${phone}. Isto é uma simulação: nenhuma ligação real será feita.`,
      confirmText: 'Sim, ligar',
      cancelText: 'Não, voltar',
    });
    if (!confirmed) return;
    this.routine.respond(reminderId, 'help');
    void this.router.navigate(['/atividade', reminderId], { queryParams: { ligar: contact.id } });
  }

  openMemories(): void {
    void this.router.navigateByUrl('/tabs/memorias');
  }

  openActivity(id: string): void {
    void this.router.navigate(['/atividade', id]);
  }

  openRoutine(): void {
    void this.router.navigateByUrl('/tabs/rotina');
  }

  private readWelcomePending(): boolean {
    try {
      return this.storage?.getItem(WELCOME_KEY) !== 'dismissed';
    } catch {
      return true;
    }
  }
}
