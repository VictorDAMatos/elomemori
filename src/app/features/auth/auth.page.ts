import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, arrowBack, warningOutline } from 'ionicons/icons';

 type AuthMode = 'login' | 'register' | 'recovery';

@Component({ selector: 'app-auth-page', standalone: true, imports: [IonContent, IonButton, IonIcon, FormsModule], template: `
<ion-content><main class="auth-shell">
  <header class="auth-brand"><img src="assets/icon/favicon.svg" alt="" width="60" height="60"><p class="em-wordmark"><span class="elo">Elo</span>Memori</p><p>Memórias que aproximam</p></header>
  <section class="em-card auth-card">
    @if (mode() !== 'login') { <button class="auth-back" type="button" (click)="mode.set('login'); fe.set({}); error.set(''); success.set('')"><ion-icon name="arrow-back" aria-hidden="true"></ion-icon> Voltar ao acesso</button> }
    @if (mode() === 'login') {
      <h1>Entre na sua conta</h1><p class="em-muted">Acesse suas lembranças e sua rotina.</p>
      <form class="em-stack-lg" (submit)="login($event)" novalidate>
        <div class="em-field"><label for="login-email">E-mail <span class="req" aria-hidden="true">*</span></label><input id="login-email" class="em-input" type="email" autocomplete="email" [(ngModel)]="email" name="email" required aria-required="true" [attr.aria-invalid]="fe()['email'] ? 'true' : null" [attr.aria-describedby]="fe()['email'] ? 'login-email-err' : null">@if (fe()['email']) { <p id="login-email-err" class="em-error"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ fe()['email'] }}</p> }</div>
        <div class="em-field"><label for="login-password">Senha <span class="req" aria-hidden="true">*</span></label><div class="auth-password"><input id="login-password" class="em-input" [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" autocomplete="current-password" required aria-required="true" [attr.aria-invalid]="fe()['password'] ? 'true' : null" [attr.aria-describedby]="fe()['password'] ? 'login-password-err' : null"><button type="button" class="auth-eye" (click)="showPassword.set(!showPassword())" [attr.aria-label]="showPassword() ? 'Ocultar senha' : 'Mostrar senha'"><ion-icon [name]="showPassword() ? 'eye-off' : 'eye'" aria-hidden="true"></ion-icon></button></div>@if (fe()['password']) { <p id="login-password-err" class="em-error"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ fe()['password'] }}</p> }</div>
        @if (error()) { <p class="em-error" role="alert"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ error() }}</p> }
        <ion-button class="em-btn em-btn-xl" expand="block" type="submit">Entrar</ion-button>
      </form>
      <button class="auth-link" type="button" (click)="mode.set('recovery'); fe.set({}); error.set('')">Esqueci minha senha</button>
      <p class="auth-create">Ainda não tem conta? <button class="auth-link" type="button" (click)="mode.set('register'); fe.set({}); error.set('')">Criar conta</button></p>
    } @else if (mode() === 'register') {
      <h1>Criar conta</h1><p class="em-muted">Preencha os dados para começar.</p>
      <form class="em-stack-lg" (submit)="register($event)" novalidate>
        <div class="em-field"><label for="reg-name">Nome <span class="req" aria-hidden="true">*</span></label><input id="reg-name" class="em-input" [(ngModel)]="name" name="name" required aria-required="true" autocomplete="name" [attr.aria-invalid]="fe()['name'] ? 'true' : null" [attr.aria-describedby]="fe()['name'] ? 'reg-name-err' : null">@if (fe()['name']) { <p id="reg-name-err" class="em-error"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ fe()['name'] }}</p> }</div>
        <div class="em-field"><label for="reg-email">E-mail <span class="req" aria-hidden="true">*</span></label><input id="reg-email" class="em-input" type="email" [(ngModel)]="email" name="regemail" required aria-required="true" autocomplete="email" [attr.aria-invalid]="fe()['email'] ? 'true' : null" [attr.aria-describedby]="fe()['email'] ? 'reg-email-err' : null">@if (fe()['email']) { <p id="reg-email-err" class="em-error"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ fe()['email'] }}</p> }</div>
        <div class="em-field"><label for="reg-password">Senha <span class="req" aria-hidden="true">*</span></label><input id="reg-password" class="em-input" type="password" [(ngModel)]="password" name="regpassword" required aria-required="true" minlength="6" autocomplete="new-password" [attr.aria-invalid]="fe()['password'] ? 'true' : null" [attr.aria-describedby]="fe()['password'] ? 'password-rule reg-password-err' : 'password-rule'"><small id="password-rule" class="auth-password-rule">Use pelo menos 6 caracteres.</small>@if (fe()['password']) { <p id="reg-password-err" class="em-error"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ fe()['password'] }}</p> }</div>
        <div class="em-field"><label for="reg-confirm">Confirmar senha <span class="req" aria-hidden="true">*</span></label><input id="reg-confirm" class="em-input" type="password" [(ngModel)]="confirmPassword" name="confirm" required aria-required="true" autocomplete="new-password" [attr.aria-invalid]="fe()['confirm'] ? 'true' : null" [attr.aria-describedby]="fe()['confirm'] ? 'reg-confirm-err' : null">@if (fe()['confirm']) { <p id="reg-confirm-err" class="em-error"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ fe()['confirm'] }}</p> }</div>
        @if (error()) { <p class="em-error" role="alert"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ error() }}</p> }
        @if (success()) { <p class="em-notice" role="status">{{ success() }}</p> }
        <ion-button class="em-btn em-btn-xl" expand="block" type="submit">Criar minha conta</ion-button>
      </form>
    } @else {
      <h1>Recuperar senha</h1><p class="em-muted">Informe seu e-mail para receber as instruções de recuperação.</p>
      <form class="em-stack-lg" (submit)="recover($event)" novalidate>
        <div class="em-field"><label for="recovery-email">E-mail <span class="req" aria-hidden="true">*</span></label><input id="recovery-email" class="em-input" type="email" [(ngModel)]="email" name="recoveryemail" required aria-required="true" autocomplete="email" [attr.aria-invalid]="fe()['email'] ? 'true' : null" [attr.aria-describedby]="fe()['email'] ? 'recovery-email-err' : null">@if (fe()['email']) { <p id="recovery-email-err" class="em-error"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ fe()['email'] }}</p> }</div>
        @if (error()) { <p class="em-error" role="alert"><ion-icon name="warning-outline" aria-hidden="true"></ion-icon> {{ error() }}</p> }
        @if (success()) { <p class="em-notice" role="status">{{ success() }}</p> }
        <ion-button class="em-btn em-btn-xl" expand="block" type="submit">Solicitar recuperação</ion-button>
      </form>
    }
  </section>
  <p class="auth-foot">Suas informações são mantidas localmente neste dispositivo.</p>
</main></ion-content>`, styles: [`
.auth-shell{max-width:520px;margin:0 auto;padding:24px 18px 48px}.auth-brand{text-align:center;padding:20px 0 28px}.auth-brand p{margin:6px 0;color:var(--em-text-muted)}.auth-card{padding:24px}.auth-card h1{font-size:1.6rem}.auth-password{position:relative}.auth-password input{padding-right:52px}.auth-eye{position:absolute;right:8px;top:5px;width:44px;height:44px;border:0;background:transparent;color:var(--em-primary);font-size:1.3rem}.auth-back,.auth-link{border:0;background:transparent;color:var(--em-primary);font-weight:700;padding:8px 0;cursor:pointer}.auth-create{margin-top:16px}.auth-password-rule{display:block;margin-top:6px;color:var(--em-text-muted);font-size:.88rem}.req{color:var(--em-danger)}.auth-foot{text-align:center;color:var(--em-text-muted);font-size:.9rem;padding:12px}
`] })
export class AuthPage {
 private router=inject(Router); readonly mode=signal<AuthMode>('login'); readonly showPassword=signal(false); readonly error=signal(''); readonly fe=signal<Record<string,string>>({}); readonly success=signal('');
 email=''; password=''; confirmPassword=''; name='';
 constructor(){addIcons({eye,eyeOff,arrowBack,warningOutline});}
 login(e:Event){e.preventDefault();this.error.set('');const f:Record<string,string>={};if(!this.validEmail(this.email))f['email']='Informe um e-mail válido, por exemplo: nome@exemplo.com.';if(!this.password.trim())f['password']='Informe sua senha.';this.fe.set(f);if(Object.keys(f).length){this.error.set('Confira os campos destacados.');return;}void this.router.navigateByUrl('/entrada');}
 register(e:Event){e.preventDefault();this.error.set('');this.success.set('');const f:Record<string,string>={};if(!this.name.trim())f['name']='Informe seu nome.';if(!this.validEmail(this.email))f['email']='Informe um e-mail válido, por exemplo: nome@exemplo.com.';if(this.password.length<6)f['password']='A senha é muito curta. Ela precisa ter pelo menos 6 caracteres.';if(this.password!==this.confirmPassword)f['confirm']='As senhas não coincidem. Confira a confirmação.';this.fe.set(f);if(Object.keys(f).length){this.error.set('Confira os campos destacados.');return;}this.success.set('Conta criada (simulação, nenhuma conta real foi criada). Você já pode acessar o EloMemori.');}
 recover(e:Event){e.preventDefault();this.error.set('');this.success.set('');if(!this.validEmail(this.email)){this.fe.set({email:'Informe um e-mail válido, por exemplo: nome@exemplo.com.'});this.error.set('Confira o campo destacado.');return;}this.fe.set({});this.success.set('Simulação: nenhum e-mail foi enviado.');}
 private validEmail(v:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());}
}
