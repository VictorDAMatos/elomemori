import { Routes } from '@angular/router';
import { enteredGuard, familyGuard, rootGuard } from './core/guards/session.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
const entry = () => import('./features/entry/entry.page').then((m) => m.EntryPage);
const auth = () => import('./features/auth/auth.page').then((m) => m.AuthPage);

export const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [rootGuard], loadComponent: entry },
  { path: 'entrada', loadComponent: entry },
  { path: 'login', loadComponent: auth },
  { path: 'familia/perfis', loadComponent: () => import('./features/family/profiles/family-profiles.page').then((m) => m.FamilyProfilesPage) },
  { path: 'familia/perfis/novo', loadComponent: () => import('./features/family/profiles/family-profile-form.page').then((m) => m.FamilyProfileFormPage) },
  { path: 'familia/perfis/:id/editar', loadComponent: () => import('./features/family/profiles/family-profile-form.page').then((m) => m.FamilyProfileFormPage) },

  {
    path: 'tabs',
    canActivate: [enteredGuard],
    loadComponent: () => import('./features/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      { path: 'inicio', loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage) },
      { path: 'memorias', loadComponent: () => import('./features/memories/memories.page').then((m) => m.MemoriesPage) },
      { path: 'rotina', loadComponent: () => import('./features/routine/routine.page').then((m) => m.RoutinePage) },
      { path: 'perfil', loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage) },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },

  {
    path: 'memoria/:id',
    canActivate: [enteredGuard],
    loadComponent: () => import('./features/memories/memory-detail.page').then((m) => m.MemoryDetailPage),
  },
  {
    path: 'atividade/:id',
    canActivate: [enteredGuard],
    loadComponent: () => import('./features/routine/activity.page').then((m) => m.ActivityPage),
  },
  {
    path: 'ajuda',
    canActivate: [enteredGuard],
    loadComponent: () => import('./features/profile/help.page').then((m) => m.HelpPage),
  },
  { path: 'familia/acesso', redirectTo: 'familia/perfis', pathMatch: 'full' },
  {
    path: 'familia',
    pathMatch: 'full',
    canActivate: [familyGuard],
    loadComponent: () => import('./features/family/dashboard/family-dashboard.page').then((m) => m.FamilyDashboardPage),
  },
  {
    path: 'familia/memorias',
    pathMatch: 'full',
    canActivate: [familyGuard],
    loadComponent: () => import('./features/family/memories/family-memories.page').then((m) => m.FamilyMemoriesPage),
  },
  {
    path: 'familia/memorias/nova',
    canActivate: [familyGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./features/family/memory-form/memory-form.page').then((m) => m.MemoryFormPage),
  },
  {
    path: 'familia/memorias/:id/editar',
    canActivate: [familyGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./features/family/memory-form/memory-form.page').then((m) => m.MemoryFormPage),
  },
  {
    path: 'familia/rotina',
    pathMatch: 'full',
    canActivate: [familyGuard],
    loadComponent: () => import('./features/family/routine-config/routine-config.page').then((m) => m.RoutineConfigPage),
  },
  {
    path: 'familia/rotina/nova',
    canActivate: [familyGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./features/family/reminder-form/reminder-form.page').then((m) => m.ReminderFormPage),
  },
  {
    path: 'familia/rotina/:id/editar',
    canActivate: [familyGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./features/family/reminder-form/reminder-form.page').then((m) => m.ReminderFormPage),
  },
  {
    path: 'familia/membros',
    canActivate: [familyGuard],
    loadComponent: () => import('./features/family/members/family-members.page').then((m) => m.FamilyMembersPage),
  },

  { path: '**', redirectTo: '' },
];
