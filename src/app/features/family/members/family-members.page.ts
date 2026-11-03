import { Component, computed, inject, signal } from '@angular/core';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, informationCircle, trashOutline, warningOutline } from 'ionicons/icons';
import { FamilyPermission, PERMISSION_LABELS } from '../../../core/models';
import { FeedbackService } from '../../../core/services/feedback.service';
import { MockFamilyService } from '../../../core/services/mock-family.service';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { FieldErrors, FamilyMember, LIMITS } from '../../../core/state/demo-engine';
import { FamilyContextComponent } from '../../../shared/components/family-context.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
@Component({
  selector: 'app-family-members-page',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, PageHeaderComponent, FamilyContextComponent],
  templateUrl: './family-members.page.html',
  styleUrl: './family-members.page.css',
})
export class FamilyMembersPage {
  private readonly family = inject(MockFamilyService);
  private readonly feedback = inject(FeedbackService);
  readonly session = inject(MockSessionService);

  readonly members = this.family.members;
  readonly canManage = this.session.canManageMembers;
  readonly activeId = computed(() => this.session.familyProfile()?.id ?? null);

  readonly permissions: FamilyPermission[] = ['view', 'edit', 'manage'];
  readonly labels = PERMISSION_LABELS;
  readonly limits = LIMITS;
  readonly relationSuggestions = ['Filha', 'Filho', 'Neta', 'Neto', 'Sobrinha', 'Sobrinho', 'Irmã', 'Irmão', 'Genro', 'Nora', 'Cuidador(a)'];
  readonly name = signal('');
  readonly relation = signal('');
  readonly permission = signal<FamilyPermission>('view');
  readonly errors = signal<FieldErrors>({});

  constructor() {
    addIcons({ addCircle, informationCircle, trashOutline, warningOutline });
  }


  async changeMemberPhoto(profileId: string, event: Event): Promise<void> {
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
      const result = this.family.updateProfilePhoto(profileId, String(reader.result));
      if (result.ok) await this.feedback.success('Foto do perfil atualizada.');
      else await this.feedback.error(result.error);
    };
    reader.onerror = () => void this.feedback.error('Não foi possível ler essa imagem.');
    reader.readAsDataURL(file);
  }

  async removeMemberPhoto(profileId: string): Promise<void> {
    const result = this.family.updateProfilePhoto(profileId, null);
    if (result.ok) await this.feedback.info('Foto removida.');
    else await this.feedback.error(result.error);
  }

  async add(event: Event): Promise<void> {
    event.preventDefault();
    const name = this.name().trim();
    const result = this.family.add({ displayName: name, relation: this.relation(), permission: this.permission() });
    if (!result.ok) {
      this.errors.set(result.fieldErrors ?? {});
      if (!result.fieldErrors) await this.feedback.error(result.error);
      return;
    }
    this.errors.set({});
    this.name.set('');
    this.relation.set('');
    this.permission.set('view');
    await this.feedback.info(`${name} foi adicionado(a).`);
  }

  async remove(m: FamilyMember): Promise<void> {
    const confirmed = await this.feedback.confirm({
      header: 'Remover da lista?',
      message: `${m.profile.displayName} sairá da lista de perfis.`,
      confirmText: 'Sim, remover',
      cancelText: 'Não, manter',
      destructive: true,
    });
    if (!confirmed) return;
    const result = this.family.remove(m.profile.id);
    if (result.ok) await this.feedback.success(`${m.profile.displayName} foi removido(a).`);
    else await this.feedback.error(result.error);
  }

  async changePermission(m: FamilyMember, select: HTMLSelectElement): Promise<void> {
    const next = select.value as FamilyPermission;
    const result = this.family.setPermission(m.profile.id, next);
    if (result.ok) {
      await this.feedback.success(`Permissão de ${m.profile.displayName} alterada para “${PERMISSION_LABELS[next]}” .`);
    } else {
      select.value = m.relationship.permission; // volta ao valor anterior
      await this.feedback.error(result.error);
    }
  }
}
