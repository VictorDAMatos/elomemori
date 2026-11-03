import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle } from 'ionicons/icons';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { DemoBannerComponent } from '../../../shared/components/demo-banner.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { ProfilePickerComponent } from '../../../shared/components/profile-picker.component';
@Component({
  selector: 'app-family-gate-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, ProfilePickerComponent, DemoBannerComponent],
  template: `
    <app-page-header title="Área da Família" backHref="/tabs/perfil" />
    <ion-content>
      <main class="em-container">
        <h1>Escolha um perfil familiar</h1>
        <div class="em-notice" role="note">
          <ion-icon name="information-circle" aria-hidden="true"></ion-icon>
          <p>
            Estes são <strong>perfis familiares</strong>. Escolha um para continuar: o acesso é simulado. A permissão de cada perfil organiza as opções disponíveis.
          </p>
        </div>
        <app-profile-picker (picked)="enter($event)" />
        <ion-button class="em-btn" expand="block" fill="outline" (click)="cancel()">Voltar ao Perfil</ion-button>
        <app-demo-banner />
      </main>
    </ion-content>
  `,
})
export class FamilyGatePage {
  private readonly session = inject(MockSessionService);
  private readonly router = inject(Router);

  constructor() {
    addIcons({ informationCircle });
  }

  enter(profileId: string): void {
    if (this.session.enterAsFamily(profileId)) {
      void this.router.navigateByUrl('/familia');
    }
  }

  cancel(): void {
    void this.router.navigateByUrl('/tabs/perfil');
  }
}
