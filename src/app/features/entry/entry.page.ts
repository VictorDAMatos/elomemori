import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, peopleOutline } from 'ionicons/icons';
import { MockSessionService } from '../../core/services/mock-session.service';
@Component({
  selector: 'app-entry-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
  templateUrl: './entry.page.html',
  styleUrl: './entry.page.css',
})
export class EntryPage {
  private readonly session = inject(MockSessionService);
  private readonly router = inject(Router);

  readonly assisted = this.session.assistedProfile;

  constructor() {
    addIcons({ heart, peopleOutline });
  }

  openAssisted(): void {
    this.session.enterAsAssisted();
    void this.router.navigateByUrl('/tabs/inicio');
  }

  openFamilyProfiles(): void {
    void this.router.navigateByUrl('/familia/perfis');
  }
}
