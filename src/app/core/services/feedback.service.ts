import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircle, checkmarkCircle, informationCircle } from 'ionicons/icons';

export type FeedbackKind = 'success' | 'info' | 'error';

export interface ConfirmOptions {
  header: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  destructive?: boolean;
}

const ICONS: Record<FeedbackKind, string> = {
  success: 'checkmark-circle',
  info: 'information-circle',
  error: 'alert-circle',
};
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly toasts = inject(ToastController);
  private readonly alerts = inject(AlertController);

  constructor() {
    addIcons({ checkmarkCircle, informationCircle, alertCircle });
  }

  async show(message: string, kind: FeedbackKind = 'success'): Promise<void> {
    const toast = await this.toasts.create({
      message,
      icon: ICONS[kind],
      position: 'top',
      duration: kind === 'error' ? 7000 : 4000,
      color: kind === 'error' ? 'danger' : kind === 'info' ? 'medium' : 'success',
      cssClass: 'em-toast',
      buttons: [{ text: 'Entendi', role: 'cancel' }],
    });
    await toast.present();
  }

  success(message: string): Promise<void> {
    return this.show(message, 'success');
  }

  info(message: string): Promise<void> {
    return this.show(message, 'info');
  }

  error(message: string): Promise<void> {
    return this.show(message, 'error');
  }
  async confirm(options: ConfirmOptions): Promise<boolean> {
    const alert = await this.alerts.create({
      header: options.header,
      message: options.message,
      cssClass: options.destructive ? 'em-alert em-alert-destructive' : 'em-alert',
      buttons: [
        { text: options.cancelText ?? 'Voltar', role: 'cancel' },
        { text: options.confirmText, role: 'confirm', cssClass: options.destructive ? 'em-alert-danger-button' : '' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}
