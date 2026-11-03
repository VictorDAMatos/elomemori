import { CanDeactivateFn } from '@angular/router';
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
  confirmDiscard(): Promise<boolean>;
}
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  component.hasUnsavedChanges() ? component.confirmDiscard() : true;
