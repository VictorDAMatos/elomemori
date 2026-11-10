export type ProfileRole = 'assisted' | 'family';
export type FamilyPermission = 'view' | 'edit' | 'manage';

export interface MockProfile {
  id: string;
  displayName: string;
  role: ProfileRole;
  relationLabel: string;
  memberType?: 'family' | 'caregiver';
  initials: string;
  photoDataUrl?: string;
  /** Telefone fictício de demonstração, só dígitos (10 ou 11). */
  phone?: string;
}

export interface MockFamilyRelationship {
  id: string;
  assistedId: string;
  familyId: string;
  relation: string;
  permission: FamilyPermission;
}

export const PERMISSION_LABELS: Record<FamilyPermission, string> = {
  view: 'Só visualizar',
  edit: 'Visualizar e editar',
  manage: 'Gerenciar tudo',
};
