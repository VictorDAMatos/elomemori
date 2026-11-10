import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookOutline, chevronForward, logOutOutline, people, warningOutline } from 'ionicons/icons';
import { DemoStateService } from '../../core/services/demo-state.service';
import { MockFamilyService } from '../../core/services/mock-family.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { MockSessionService } from '../../core/services/mock-session.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RecoveryNoticeComponent } from '../../shared/components/recovery-notice.component';
import { RestoreDemoComponent } from '../../shared/components/restore-demo.component';
import { ReadingSettingsComponent } from '../settings/reading-settings.component';
@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    PageHeaderComponent,
    ReadingSettingsComponent,
    RestoreDemoComponent,
    RecoveryNoticeComponent,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
})
export class ProfilePage {
  private readonly router = inject(Router);
  readonly session = inject(MockSessionService);
  readonly demo = inject(DemoStateService);
  private readonly family = inject(MockFamilyService);
  private readonly feedback = inject(FeedbackService);

  readonly assisted = this.session.assistedProfile;

  constructor() {
    addIcons({ bookOutline, chevronForward, logOutOutline, people, warningOutline });
  }

  async changeAnaPhoto(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      await this.feedback.error('Escolha uma imagem JPG, PNG ou WEBP de até 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const result = this.family.updateProfilePhoto(this.session.assistedProfile()?.id ?? '', String(reader.result));
      if (result.ok) await this.feedback.success('Foto de Ana atualizada.');
      else await this.feedback.error(result.error);
    };
    reader.onerror = () => void this.feedback.error('Não foi possível ler essa imagem.');
    reader.readAsDataURL(file);
  }

  async removeAnaPhoto(): Promise<void> {
    const result = this.family.updateProfilePhoto(this.session.assistedProfile()?.id ?? '', null);
    if (result.ok) await this.feedback.info('Foto removida.');
    else await this.feedback.error(result.error);
  }

  openFamilyArea(): void {
    void this.router.navigateByUrl(this.session.familyProfile() ? '/familia' : '/familia/perfis');
  }

  openHelp(): void {
    void this.router.navigateByUrl('/ajuda');
  }

  backToEntry(): void {
    this.session.exit();
    void this.router.navigateByUrl('/entrada');
  }
}
