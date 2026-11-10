import { MockFamilyRelationship, MockProfile } from '../app/core/models/profile.model';

export const MOCK_PROFILES: MockProfile[] = [
  {
    id: 'profile-ana',
    displayName: 'Ana Mendes',
    role: 'assisted',
    relationLabel: 'Pessoa assistida (personagem fictícia, 80 anos)',
    initials: 'AM',
  },
  {
    id: 'profile-marta',
    displayName: 'Marta Mendes Costa',
    role: 'family',
    relationLabel: 'Filha',
    initials: 'MC',
    phone: '11900000001',
  },
  {
    id: 'profile-pedro',
    displayName: 'Pedro Costa',
    role: 'family',
    relationLabel: 'Neto',
    initials: 'PC',
    phone: '11900000002',
  },
  {
    id: 'profile-julia',
    displayName: 'Júlia Costa',
    role: 'family',
    relationLabel: 'Neta',
    initials: 'JC',
    phone: '11900000003',
  },
];

export const MOCK_RELATIONSHIPS: MockFamilyRelationship[] = [
  { id: 'rel-marta', assistedId: 'profile-ana', familyId: 'profile-marta', relation: 'Filha', permission: 'manage' },
  { id: 'rel-pedro', assistedId: 'profile-ana', familyId: 'profile-pedro', relation: 'Neto', permission: 'edit' },
  { id: 'rel-julia', assistedId: 'profile-ana', familyId: 'profile-julia', relation: 'Neta', permission: 'view' },
];
