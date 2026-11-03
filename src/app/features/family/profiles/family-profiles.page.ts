import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, peopleOutline, pencilOutline } from 'ionicons/icons';
import { MockFamilyService } from '../../../core/services/mock-family.service';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
@Component({selector:'app-family-profiles-page',standalone:true,imports:[IonButton,IonContent,IonIcon,PageHeaderComponent],template:`
<app-page-header title="Perfis da família" backHref="/entrada"/><ion-content><main class="em-container">
<h1>Quem está acessando?</h1><p class="em-lead">Escolha seu perfil para entrar na área familiar.</p>
@if(profiles().length){<ul class="em-list">@for(p of profiles();track p.id){<li class="em-card profile-row"><span class="em-avatar profile-avatar">@if(p.photoDataUrl){<img [src]="p.photoDataUrl" alt="Foto de {{p.displayName}}"/>}@else{ {{p.initials}} }</span><div class="profile-info"><button type="button" class="profile-name" (click)="edit(p.id)" aria-label="Abrir perfil de {{p.displayName}}">{{p.displayName}}</button><p class="em-muted em-small">{{p.relationLabel}} · {{p.memberType === 'caregiver' ? 'Cuidador(a)' : 'Familiar'}}</p></div><ion-button class="em-btn" (click)="enter(p.id)">Entrar</ion-button></li>}</ul>}@else{<div class="em-card"><p>Ainda não há perfis familiares. Crie o primeiro perfil para continuar.</p></div>}
<ion-button class="em-btn em-btn-xl" expand="block" (click)="create()"><ion-icon slot="start" name="add-circle"></ion-icon>Criar perfil familiar</ion-button>
</main></ion-content>`,styles:[`.profile-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.profile-info{flex:1;min-width:100px}.profile-info p{margin:4px 0}.profile-name{padding:0;border:0;background:transparent;color:var(--em-text);font:inherit;font-weight:700;text-align:left;cursor:pointer}.profile-name:focus-visible{outline:2px solid var(--em-primary);outline-offset:3px;border-radius:3px}.profile-avatar{overflow:hidden;flex:0 0 3rem}.profile-avatar img{width:100%;height:100%;object-fit:cover;border-radius:inherit}`]})
export class FamilyProfilesPage{private router=inject(Router);private family=inject(MockFamilyService);private session=inject(MockSessionService);readonly profiles=this.family.demoProfiles;constructor(){addIcons({addCircle,peopleOutline,pencilOutline});}enter(id:string){if(this.session.enterAsFamily(id))void this.router.navigateByUrl('/familia');}edit(id:string){void this.router.navigateByUrl(`/familia/perfis/${id}/editar`);}create(){void this.router.navigateByUrl('/familia/perfis/novo');}}
