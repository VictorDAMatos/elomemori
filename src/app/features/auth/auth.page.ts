import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, arrowBack } from 'ionicons/icons';

 type AuthMode = 'login' | 'register' | 'recovery';

@Component({ selector: 'app-auth-page', standalone: true, imports: [IonContent, IonButton, IonIcon, FormsModule], template: `
<ion-content><main class="auth-shell">
  <header class="auth-brand"><img src="assets/icon/favicon.svg" alt="" width="60" height="60"><p class="em-wordmark"><span class="elo">Elo</span>Memori</p><p>Memórias que aproximam</p></header>
  <section class="em-card auth-card">
    @if (mode() !== 'login') { <button class="auth-back" type="button" (click)="mode.set('login')"><ion-icon name="arrow-back"></ion-icon> Voltar ao acesso</button> }
    @if (mode() === 'login') {
      <h1>Entre na sua conta</h1><p class="em-muted">Acesse suas lembranças e sua rotina.</p>
      <form class="em-stack-lg" (submit)="login($event)" novalidate>
        <div class="em-field"><label for="login-email">E-mail</label><input id="login-email" class="em-input" type="email" autocomplete="email" [(ngModel)]="email" name="email" required></div>
        <div class="em-field"><label for="login-password">Senha</label><div class="auth-password"><input id="login-password" class="em-input" [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" autocomplete="current-password" required><button type="button" class="auth-eye" (click)="showPassword.set(!showPassword())" [attr.aria-label]="showPassword() ? 'Ocultar senha' : 'Mostrar senha'"><ion-icon [name]="showPassword() ? 'eye-off' : 'eye'"></ion-icon></button></div></div>
        @if (error()) { <p class="em-error" role="alert">{{ error() }}</p> }
        <ion-button class="em-btn em-btn-xl" expand="block" type="submit">Entrar</ion-button>
      </form>
      <button class="auth-link" type="button" (click)="mode.set('recovery')">Esqueci minha senha</button>
      <p class="auth-create">Ainda não tem conta? <button class="auth-link" type="button" (click)="mode.set('register')">Criar conta</button></p>
    } @else if (mode() === 'register') {
      <h1>Criar conta</h1><p class="em-muted">Preencha os dados para começar.</p>
      <form class="em-stack-lg" (submit)="register($event)" novalidate>
        <div class="em-field"><label for="reg-name">Nome</label><input id="reg-name" class="em-input" [(ngModel)]="name" name="name" required autocomplete="name"></div>
        <div class="em-field"><label for="reg-email">E-mail</label><input id="reg-email" class="em-input" type="email" [(ngModel)]="email" name="regemail" required autocomplete="email"></div>
        <div class="em-field"><label for="reg-password">Senha</label><input id="reg-password" class="em-input" type="password" [(ngModel)]="password" name="regpassword" required minlength="6" autocomplete="new-password" aria-describedby="password-rule"><small id="password-rule" class="auth-password-rule">Use pelo menos 6 caracteres.</small></div>
        <div class="em-field"><label for="reg-confirm">Confirmar senha</label><input id="reg-confirm" class="em-input" type="password" [(ngModel)]="confirmPassword" name="confirm" required autocomplete="new-password"></div>
        @if (error()) { <p class="em-error" role="alert">{{ error() }}</p> }
        @if (success()) { <p class="em-notice" role="status">{{ success() }}</p> }
        <ion-button class="em-btn em-btn-xl" expand="block" type="submit">Criar minha conta</ion-button>
      </form>
    } @else {
      <h1>Recuperar senha</h1><p class="em-muted">Informe seu e-mail para receber as instruções de recuperação.</p>
      <form class="em-stack-lg" (submit)="recover($event)" novalidate>
        <div class="em-field"><label for="recovery-email">E-mail</label><input id="recovery-email" class="em-input" type="email" [(ngModel)]="email" name="recoveryemail" required autocomplete="email"></div>
        @if (error()) { <p class="em-error" role="alert">{{ error() }}</p> }
        @if (success()) { <p class="em-notice" role="status">{{ success() }}</p> }
        <ion-button class="em-btn em-btn-xl" expand="block" type="submit">Solicitar recuperação</ion-button>
      </form>
    }
  </section>
  <p class="auth-foot">Suas informações são mantidas localmente neste dispositivo.</p>
</main></ion-content>`, styles: [`
.auth-shell{max-width:520px;margin:0 auto;padding:24px 18px 48px}.auth-brand{text-align:center;padding:20px 0 28px}.auth-brand p{margin:6px 0;color:var(--em-text-muted)}.auth-card{padding:24px}.auth-card h1{font-size:1.6rem}.auth-password{position:relative}.auth-password input{padding-right:52px}.auth-eye{position:absolute;right:8px;top:5px;width:44px;height:44px;border:0;background:transparent;color:var(--em-primary);font-size:1.3rem}.auth-back,.auth-link{border:0;background:transparent;color:var(--em-primary);font-weight:700;padding:8px 0;cursor:pointer}.auth-create{margin-top:16px}.auth-password-rule{display:block;margin-top:6px;color:var(--em-text-muted);font-size:.88rem}.auth-foot{text-align:center;color:var(--em-text-muted);font-size:.9rem;padding:12px}
`] })
export class AuthPage {
 private router=inject(Router); readonly mode=signal<AuthMode>('login'); readonly showPassword=signal(false); readonly error=signal(''); readonly success=signal('');
 email=''; password=''; confirmPassword=''; name='';
 constructor(){addIcons({eye,eyeOff,arrowBack});}
 login(e:Event){e.preventDefault();this.error.set('');if(!this.validEmail(this.email)||!this.password.trim()){this.error.set('Informe um e-mail válido e sua senha.');return;}void this.router.navigateByUrl('/entrada');}
 register(e:Event){e.preventDefault();this.error.set('');this.success.set('');if(!this.name.trim()||!this.validEmail(this.email)){this.error.set('Informe seu nome e um e-mail válido.');return;}if(this.password.length<6){this.error.set('A senha é muito curta. Ela precisa ter pelo menos 6 caracteres.');return;}if(this.password!==this.confirmPassword){this.error.set('As senhas não coincidem. Confira a confirmação.');return;}this.success.set('Conta criada. Você já pode acessar o EloMemori.');}
 recover(e:Event){e.preventDefault();this.error.set('');this.success.set('');if(!this.validEmail(this.email)){this.error.set('Informe um endereço de e-mail válido.');return;}this.success.set('Se este e-mail estiver cadastrado, as instruções de recuperação estarão disponíveis nesta simulação.');}
 private validEmail(v:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());}
}
