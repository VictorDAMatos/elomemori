import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DemoStateService } from './demo-state.service';
import { FeedbackService } from './feedback.service';
import { MockSessionService } from './mock-session.service';
import { SessionMediaService } from './session-media.service';
@Injectable({ providedIn: 'root' })
export class DemoRestoreService {
  private readonly demo = inject(DemoStateService);
  private readonly feedback = inject(FeedbackService);
  private readonly media = inject(SessionMediaService);
  private readonly session = inject(MockSessionService);
  private readonly router = inject(Router);
  async restoreWithConfirmation(): Promise<boolean> {
    const confirmed = await this.feedback.confirm({
      header: 'Restaurar dados iniciais?',
      message:
        'Lembranças, atividades, respostas e familiares voltam ao exemplo inicial. ' +
        'Arquivos escolhidos neste aparelho serão desvinculados. Isso afeta apenas os dados locais do aplicativo.',
      confirmText: 'Sim, restaurar',
      cancelText: 'Não, manter como está',
      destructive: true,
    });
    if (!confirmed) return false;

    this.demo.restore();
    this.media.revokeAll();
    if (this.router.url.startsWith('/familia') && !this.session.familyProfile()) {
      await this.router.navigateByUrl('/tabs/perfil');
    }
    await this.feedback.success('Dados iniciais restaurados.');
    return true;
  }
}
