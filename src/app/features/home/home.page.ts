import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, chevronForward, images, informationCircle } from 'ionicons/icons';
import { MockRoutineService } from '../../core/services/mock-routine.service';
import { MockSessionService } from '../../core/services/mock-session.service';
import { getBrowserStorage } from '../../core/state/persistence';
import { formatLongDay, greetingFor } from '../../core/util/dates';
import { DemoBannerComponent } from '../../shared/components/demo-banner.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RecoveryNoticeComponent } from '../../shared/components/recovery-notice.component';
import { TimeHumanPipe } from '../../shared/pipes/format.pipes';

const WELCOME_KEY = 'elomemori.demo.welcome.v1';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, RecoveryNoticeComponent, DemoBannerComponent, TimeHumanPipe],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private readonly routine = inject(MockRoutineService);
  private readonly session = inject(MockSessionService);
  private readonly router = inject(Router);
  private readonly storage = getBrowserStorage();

  readonly greeting = computed(() => greetingFor(this.routine.now()));
  readonly dayText = computed(() => formatLongDay(this.routine.now()));
  readonly firstName = computed(() => this.session.assistedProfile()?.displayName.split(' ')[0] ?? '');
  readonly next = this.routine.next;
  readonly summary = this.routine.summary;
  readonly showWelcome = signal(this.readWelcomePending());

  constructor() {
    addIcons({ checkmarkCircle, chevronForward, images, informationCircle });
  }

  dismissWelcome(): void {
    this.showWelcome.set(false);
    try {
      this.storage?.setItem(WELCOME_KEY, 'dismissed');
    } catch {
    }
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
