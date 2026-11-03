import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, archive, archiveOutline, createOutline, eyeOutline, trashOutline } from 'ionicons/icons';
import { MockMemory } from '../../../core/models';
import { FeedbackService } from '../../../core/services/feedback.service';
import { MockMemoryService } from '../../../core/services/mock-memory.service';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { simulatedLoading } from '../../../core/util/simulated-loading';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { FamilyContextComponent } from '../../../shared/components/family-context.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { MemoryDatePipe } from '../../../shared/pipes/format.pipes';
@Component({
  selector: 'app-family-memories-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, FamilyContextComponent, EmptyStateComponent, MemoryDatePipe],
  templateUrl: './family-memories.page.html',
  styleUrl: './family-memories.page.css',
})
export class FamilyMemoriesPage {
  private readonly memories = inject(MockMemoryService);
  private readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);
  readonly session = inject(MockSessionService);

  readonly showArchived = signal(false);
  readonly loading = simulatedLoading();

  readonly activeCount = computed(() => this.memories.memories().length);
  readonly archivedCount = computed(() => this.memories.archivedMemories().length);
  readonly visible = computed<MockMemory[]>(() =>
    this.showArchived() ? [...this.memories.memories(), ...this.memories.archivedMemories()] : this.memories.memories(),
  );

  constructor() {
    addIcons({ addCircle, archive, archiveOutline, createOutline, eyeOutline, trashOutline });
  }

  toggleArchived(show: boolean): void {
    this.showArchived.set(show);
  }

  create(): void {
    void this.router.navigateByUrl('/familia/memorias/nova');
  }

  view(m: MockMemory): void {
    void this.router.navigate(['/memoria', m.id], { queryParams: { from: 'familia' } });
  }

  edit(m: MockMemory): void {
    void this.router.navigate(['/familia/memorias', m.id, 'editar']);
  }

  async archive(m: MockMemory): Promise<void> {
    const r = this.memories.archive(m.id);
    if (r.ok) await this.feedback.success(`“${m.title}” foi arquivada. Ela some da galeria, mas pode ser restaurada.`);
    else await this.feedback.error(r.error);
  }

  async unarchive(m: MockMemory): Promise<void> {
    const r = this.memories.unarchive(m.id);
    if (r.ok) await this.feedback.success(`“${m.title}” voltou para a galeria.`);
    else await this.feedback.error(r.error);
  }

  async remove(m: MockMemory): Promise<void> {
    const confirmed = await this.feedback.confirm({
      header: 'Excluir esta lembrança?',
      message: `“${m.title}” será excluída. Para guardá-la sem excluir, use “Arquivar”. A restauração dos dados iniciais recupera os exemplos.`,
      confirmText: 'Sim, excluir',
      cancelText: 'Não, manter',
      destructive: true,
    });
    if (!confirmed) return;
    const r = this.memories.remove(m.id);
    if (r.ok) await this.feedback.success(`“${m.title}” foi excluída.`);
    else await this.feedback.error(r.error);
  }
}
