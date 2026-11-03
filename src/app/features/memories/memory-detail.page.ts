import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { archiveOutline, createOutline, people, stopCircleOutline, volumeHighOutline } from 'ionicons/icons';
import { MockMemoryService } from '../../core/services/mock-memory.service';
import { MockSessionService } from '../../core/services/mock-session.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SpeechService } from '../../core/services/speech.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { MediaViewerComponent } from '../../shared/components/media-viewer.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { MemoryDatePipe } from '../../shared/pipes/format.pipes';
@Component({
  selector: 'app-memory-detail-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, MediaViewerComponent, EmptyStateComponent, MemoryDatePipe],
  templateUrl: './memory-detail.page.html',
  styleUrl: './memory-detail.page.css',
})
export class MemoryDetailPage {
  private readonly memories = inject(MockMemoryService);
  private readonly router = inject(Router);
  private readonly preferences = inject(PreferencesService);
  readonly session = inject(MockSessionService);
  readonly speech = inject(SpeechService);
  readonly id = input<string>();
  readonly from = input<string>();
  readonly memory = computed(() => {
    const m = this.memories.get(this.id());
    if (!m) return null;
    if (m.archived && !this.session.familyProfile()) return null;
    return m;
  });
  readonly backHref = computed(() => (this.from() === 'familia' ? '/familia/memorias' : '/tabs/memorias'));
  readonly canReadAloud = computed(() => this.speech.supported && this.preferences.readAloud());

  constructor() {
    addIcons({ archiveOutline, createOutline, people, stopCircleOutline, volumeHighOutline });
  }

  toggleReadAloud(): void {
    const m = this.memory();
    if (!m) return;
    if (this.speech.speaking()) this.speech.stop();
    else this.speech.speak(`${m.title}. ${m.story}`);
  }

  openMemories(): void {
    void this.router.navigateByUrl('/tabs/memorias');
  }

  editMemory(): void {
    const m = this.memory();
    if (m) void this.router.navigate(['/familia/memorias', m.id, 'editar']);
  }
  ionViewWillLeave(): void {
    this.speech.stop();
  }
}
