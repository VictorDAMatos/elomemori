import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';
import { MockRoutineService } from '../../core/services/mock-routine.service';
import { formatLongDay } from '../../core/util/dates';
import { simulatedLoading } from '../../core/util/simulated-loading';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { TimeHumanPipe } from '../../shared/pipes/format.pipes';
@Component({
  selector: 'app-routine-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, RouterLink, PageHeaderComponent, StatusBadgeComponent, EmptyStateComponent, TimeHumanPipe],
  templateUrl: './routine.page.html',
  styleUrl: './routine.page.css',
})
export class RoutinePage {
  private readonly routine = inject(MockRoutineService);
  private readonly router = inject(Router);

  readonly items = this.routine.items;
  readonly summary = this.routine.summary;
  readonly loading = simulatedLoading();
  readonly percent = computed(() => {
    const { total, done } = this.summary();
    return total ? Math.round((done / total) * 100) : 0;
  });

  dayText(): string {
    return formatLongDay(this.routine.now());
  }

  openProfile(): void {
    void this.router.navigateByUrl('/tabs/perfil');
  }

  constructor() {
    addIcons({ chevronForward });
  }
}
