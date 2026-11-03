import { DestroyRef, Signal, inject, signal } from '@angular/core';
export function simulatedLoading(ms = 350): Signal<boolean> {
  const loading = signal(true);
  const timer = setTimeout(() => loading.set(false), ms);
  inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  return loading.asReadonly();
}
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
