import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircle,
  albumsOutline,
  calendarOutline,
  checkmarkCircle,
  exitOutline,
  helpBuoy,
  helpCircle,
  informationCircle,
  peopleOutline,
  personCircleOutline,
  time,
} from 'ionicons/icons';
import { MockMemoryService } from '../../../core/services/mock-memory.service';
import { MockRoutineService } from '../../../core/services/mock-routine.service';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { simulatedLoading } from '../../../core/util/simulated-loading';
import { FamilyContextComponent } from '../../../shared/components/family-context.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { RecoveryNoticeComponent } from '../../../shared/components/recovery-notice.component';
import { RestoreDemoComponent } from '../../../shared/components/restore-demo.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';
import { LogTimePipe, TimeHumanPipe } from '../../../shared/pipes/format.pipes';
@Component({
  selector: 'app-family-dashboard-page',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    PageHeaderComponent,
    FamilyContextComponent,
    RecoveryNoticeComponent,
    StatusBadgeComponent,
    RestoreDemoComponent,
    TimeHumanPipe,
    LogTimePipe,
  ],
  templateUrl: './family-dashboard.page.html',
  styleUrl: './family-dashboard.page.css',
})
export class FamilyDashboardPage {
  private readonly router = inject(Router);
  private readonly routine = inject(MockRoutineService);
  readonly session = inject(MockSessionService);
  private readonly memories = inject(MockMemoryService);

  readonly items = this.routine.items;
  readonly summary = this.routine.summary;
  readonly history = this.routine.history;
  readonly notices = computed(() => this.routine.notices().filter((n) => !n.recipientId || n.recipientId === this.session.familyProfile()?.id));
  readonly memoryCount = computed(() => this.memories.memories().length);
  readonly assistedName = computed(() => this.session.assistedProfile()?.displayName.split(' ')[0] ?? 'a pessoa assistida');
  readonly loading = simulatedLoading();

  constructor() {
    addIcons({
      addCircle,
      albumsOutline,
      calendarOutline,
      checkmarkCircle,
      exitOutline,
      helpBuoy,
      helpCircle,
      informationCircle,
      peopleOutline,
      personCircleOutline,
      time,
    });
  }

  markNotice(id: string, status: 'seen' | 'attended' | 'cancelled'): void { this.routine.updateNoticeStatus(id, status); }

  go(url: string): void {
    void this.router.navigateByUrl(url);
  }
  viewAsAssisted(): void {
    this.session.leaveFamilyArea();
    void this.router.navigateByUrl('/tabs/inicio');
  }

  leave(): void {
    this.session.leaveFamilyArea();
    void this.router.navigateByUrl('/tabs/perfil');
  }
}
