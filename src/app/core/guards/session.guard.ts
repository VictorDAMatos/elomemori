import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { MockSessionService } from '../services/mock-session.service';
export const enteredGuard: CanActivateFn = () => {
  const session = inject(MockSessionService);
  const router = inject(Router);
  return session.entered() ? true : router.createUrlTree(['/login']);
};
export const rootGuard: CanActivateFn = () => {
  const router = inject(Router);
  // Sempre iniciar pela autenticação para a demonstração preservar os fluxos de login,
  // criação de conta e recuperação de senha. A sessão mock permanece disponível após entrar.
  return router.createUrlTree(['/login']);
};
export const familyGuard: CanActivateFn = () => {
  const session = inject(MockSessionService);
  const router = inject(Router);
  if (!session.entered()) return router.createUrlTree(['/login']);
  return session.familyProfile() ? true : router.createUrlTree(['/familia/acesso']);
};
/** Só o perfil familiar em uso pode abrir a edição do próprio perfil. */
export const ownProfileGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const session = inject(MockSessionService);
  const router = inject(Router);
  const active = session.familyProfile();
  return active && active.id === route.paramMap.get('id') ? true : router.createUrlTree(['/familia/perfis']);
};
