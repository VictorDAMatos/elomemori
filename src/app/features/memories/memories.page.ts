import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { MockMemoryService } from '../../core/services/mock-memory.service';
import { simulatedLoading } from '../../core/util/simulated-loading';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { MemoryCardComponent } from '../../shared/components/memory-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
@Component({
  selector: 'app-memories-page',
  standalone: true,
  imports: [IonContent, IonButton, PageHeaderComponent, MemoryCardComponent, EmptyStateComponent],
  templateUrl: './memories.page.html',
  styleUrl: './memories.page.css',
})
export class MemoriesPage {
  private readonly router = inject(Router);
  private readonly memoryService = inject(MockMemoryService);
  readonly order = signal<'newest' | 'oldest'>('newest');
  readonly sortPopupOpen = signal(false);

  chooseOrder(value: 'newest' | 'oldest'): void {
    this.order.set(value);
    this.sortPopupOpen.set(false);
  }
  readonly memories = computed(() => {
    const items = [...this.memoryService.memories()];
    const dateValue = (date?: string) => date ? new Date(date.length === 4 ? `${date}-01-01` : date.length === 7 ? `${date}-01` : date).getTime() : 0;
    return items.sort((a, b) => this.order() === 'newest' ? dateValue(b.date) - dateValue(a.date) : dateValue(a.date) - dateValue(b.date));
  });
  readonly loading = simulatedLoading();

  openProfile(): void {
    void this.router.navigateByUrl('/tabs/perfil');
  }
}
