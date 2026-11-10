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
import { getBrowserStorage } from '../../core/state/persistence';
import { formatLongDay, greetingFor } from '../../core/util/dates';
import { HoldButtonComponent } from '../../shared/components/hold-button.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RecoveryNoticeComponent } from '../../shared/components/recovery-notice.component';
import { TimeHumanPipe } from '../../shared/pipes/format.pipes';

const WELCOME_KEY = 'elomemori.demo.welcome.v1';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, RecoveryNoticeComponent, HoldButtonComponent, TimeHumanPipe],
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
  /** Pessoa chamada no pedido de ajuda: primeiro familiar ou cuidador da lista. */
  readonly helpContact = computed(() => this.family.demoProfiles()[0] ?? null);
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

  /** Chamado depois de segurar o botão por 5 s: ainda pede uma confirmação antes da ligação simulada. */
  async requestHelp(reminderId: string): Promise<void> {
    const contact = this.helpContact();
    if (!contact) {
      await this.feedback.info('Ainda não há familiar ou cuidador cadastrado para receber o pedido.');
      return;
    }
    const confirmed = await this.feedback.confirm({
      header: `Ligar para ${contact.displayName}?`,
      message: 'Isto é uma simulação: nenhuma ligação real será feita. Você quer pedir ajuda com este lembrete?',
      confirmText: 'Sim, pedir ajuda',
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
