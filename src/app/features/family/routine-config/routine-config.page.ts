import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, checkmarkCircle, createOutline, informationCircle, pauseCircle, playCircle, trashOutline } from 'ionicons/icons';
import { MockReminder } from '../../../core/models';
import { FeedbackService } from '../../../core/services/feedback.service';
import { MockRoutineService } from '../../../core/services/mock-routine.service';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { simulatedLoading } from '../../../core/util/simulated-loading';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { FamilyContextComponent } from '../../../shared/components/family-context.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { RecurrencePipe, TimeHumanPipe } from '../../../shared/pipes/format.pipes';
@Component({
  selector: 'app-routine-config-page',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    PageHeaderComponent,
    FamilyContextComponent,
    EmptyStateComponent,
    TimeHumanPipe,
    RecurrencePipe,
  ],
  templateUrl: './routine-config.page.html',
  styleUrl: './routine-config.page.css',
})
export class RoutineConfigPage {
  private readonly routine = inject(MockRoutineService);
  private readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);
  readonly session = inject(MockSessionService);

  readonly reminders = this.routine.reminders;
  readonly loading = simulatedLoading();

  constructor() {
    addIcons({ addCircle, checkmarkCircle, createOutline, informationCircle, pauseCircle, playCircle, trashOutline });
  }

  create(): void {
    void this.router.navigateByUrl('/familia/rotina/nova');
  }

  edit(r: MockReminder): void {
    void this.router.navigate(['/familia/rotina', r.id, 'editar']);
  }

  async toggleActive(r: MockReminder): Promise<void> {
    const result = this.routine.setActive(r.id, !r.active);
    if (result.ok) {
      await this.feedback.success(
        r.active ? `“${r.title}” foi pausada. Ela não aparece na rotina de hoje.` : `“${r.title}” voltou para a rotina.`,
      );
    } else {
      await this.feedback.error(result.error);
    }
  }

  async remove(r: MockReminder): Promise<void> {
    const confirmed = await this.feedback.confirm({
      header: 'Excluir esta atividade?',
      message: `“${r.title}” será excluída. Se quiser só tirar da rotina por um tempo, use “Pausar”.`,
      confirmText: 'Sim, excluir',
      cancelText: 'Não, manter',
      destructive: true,
    });
    if (!confirmed) return;
    const result = this.routine.remove(r.id);
    if (result.ok) await this.feedback.success(`“${r.title}” foi excluída.`);
    else await this.feedback.error(result.error);
  }
}
