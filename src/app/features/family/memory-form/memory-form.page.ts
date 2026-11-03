import { Component, DestroyRef, ElementRef, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { NavController, IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, attach, checkmarkCircle, close, refresh, trashOutline, warningOutline } from 'ionicons/icons';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { MEDIA_TYPE_LABELS, MemoryDraft, MockMedia } from '../../../core/models';
import { FeedbackService } from '../../../core/services/feedback.service';
import { MockFamilyService } from '../../../core/services/mock-family.service';
import { MockMemoryService } from '../../../core/services/mock-memory.service';
import { MockSessionService } from '../../../core/services/mock-session.service';
import { SessionMediaService } from '../../../core/services/session-media.service';
import { FieldErrors, LIMITS, newId, validateMemoryDraft } from '../../../core/state/demo-engine';
import { ACCEPT_ATTRIBUTE, formatBytes, MAX_BYTES } from '../../../core/util/media-validation';
import { wait } from '../../../core/util/simulated-loading';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { FamilyContextComponent } from '../../../shared/components/family-context.component';
import { MediaViewerComponent } from '../../../shared/components/media-viewer.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
@Component({
  selector: 'app-memory-form-page',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    PageHeaderComponent,
    FamilyContextComponent,
    MediaViewerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './memory-form.page.html',
  styleUrl: './memory-form.page.css',
})
export class MemoryFormPage implements OnInit, HasUnsavedChanges {
  private readonly memories = inject(MockMemoryService);
  private readonly sessionMedia = inject(SessionMediaService);
  private readonly feedback = inject(FeedbackService);
  private readonly family = inject(MockFamilyService);
  private readonly nav = inject(NavController);
  readonly session = inject(MockSessionService);
  readonly id = input<string>();

  readonly errorSummary = viewChild<ElementRef<HTMLElement>>('errorSummary');
  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  readonly relinkInput = viewChild<ElementRef<HTMLInputElement>>('relinkInput');
  readonly title = signal('');
  readonly story = signal('');
  readonly year = signal('');
  readonly month = signal('');
  readonly day = signal('');
  readonly people = signal<string[]>([]);
  readonly personInput = signal('');
  readonly media = signal<MockMedia[]>([]);
  readonly errors = signal<FieldErrors>({});
  readonly fileErrors = signal<string[]>([]);
  readonly submitted = signal(false);
  readonly saving = signal(false);
  readonly dirty = signal(false);

  readonly limits = LIMITS;
  readonly months = MONTHS;
  readonly accept = ACCEPT_ATTRIBUTE;
  readonly typeLabels = MEDIA_TYPE_LABELS;
  readonly maxSizes = `fotos até ${formatBytes(MAX_BYTES.image)}, áudios até ${formatBytes(MAX_BYTES.audio)}, vídeos até ${formatBytes(MAX_BYTES.video)}`;

  readonly isEdit = computed(() => !!this.id());
  readonly existing = computed(() => this.memories.get(this.id()));
  readonly notFound = computed(() => this.isEdit() && !this.existing());
  readonly errorList = computed(() => Object.values(this.errors()));
  readonly suggestions = computed(() => {
    const chosen = this.people().map((p) => p.toLowerCase());
    return this.family
      .members()
      .map((m) => m.profile.displayName.split(' ')[0])
      .filter((name) => !chosen.includes(name.toLowerCase()));
  });

  private readonly addedSessionIds = new Set<string>();
  private relinkTarget: MockMedia | null = null;
  private saved = false;

  constructor() {
    addIcons({ addCircle, attach, checkmarkCircle, close, refresh, trashOutline, warningOutline });
    inject(DestroyRef).onDestroy(() => {
      if (!this.saved) this.sessionMedia.revokeMany([...this.addedSessionIds]);
    });
  }

  ngOnInit(): void {
    const m = this.existing();
    if (!m) return;
    this.title.set(m.title);
    this.story.set(m.story);
    const [y = '', mo = '', d = ''] = (m.date ?? '').split('-');
    this.year.set(y);
    this.month.set(mo ? String(Number(mo)) : '');
    this.day.set(d ? String(Number(d)) : '');
    this.people.set([...m.people]);
    this.media.set([...m.media]);
  }

  setTitle(value: string): void {
    this.title.set(value);
    this.touch();
  }

  setStory(value: string): void {
    this.story.set(value);
    this.touch();
  }

  setYear(value: string): void {
    this.year.set(value);
    this.touch();
  }

  setMonth(value: string): void {
    this.month.set(value);
    this.touch();
  }

  setDay(value: string): void {
    this.day.set(value);
    this.touch();
  }

  addPerson(name?: string): void {
    const value = (name ?? this.personInput()).trim();
    if (!value) return;
    if (value.length > LIMITS.personName) {
      this.errors.update((e) => ({ ...e, people: `Cada nome pode ter no máximo ${LIMITS.personName} letras.` }));
      return;
    }
    if (this.people().length >= LIMITS.people) {
      this.errors.update((e) => ({ ...e, people: `Informe no máximo ${LIMITS.people} pessoas.` }));
      return;
    }
    if (!this.people().some((p) => p.toLowerCase() === value.toLowerCase())) {
      this.people.update((list) => [...list, value]);
    }
    this.personInput.set('');
    this.errors.update(({ people: _ignored, ...rest }) => rest);
    this.touch();
  }

  removePerson(name: string): void {
    this.people.update((list) => list.filter((p) => p !== name));
    this.touch();
  }

  openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  onFilesChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = ''; // permite escolher o mesmo arquivo de novo
    this.addFiles(files);
  }

  addFiles(files: File[]): void {
    const problems: string[] = [];
    let added = 0;
    for (const file of files) {
      if (this.media().length >= LIMITS.mediaPerMemory) {
        problems.push(`Cada lembrança pode ter no máximo ${LIMITS.mediaPerMemory} arquivos. Remova algum para adicionar outro.`);
        break;
      }
      const result = this.sessionMedia.register(file);
      if (result.ok) {
        this.media.update((list) => [...list, result.media]);
        this.addedSessionIds.add(result.media.id);
        added += 1;
      } else {
        problems.push(result.message);
      }
    }
    this.fileErrors.set(problems);
    if (added > 0) {
      this.touch();
      void this.feedback.info(
        added === 1
          ? 'Arquivo adicionado à prévia. Ele só fica neste aparelho, e nada é enviado.'
          : `${added} arquivos adicionados à prévia. Eles só ficam neste aparelho, e nada é enviado.`,
      );
    }
  }


  removeMedia(media: MockMedia): void {
    this.media.update((list) => list.filter((m) => m.id !== media.id));
    if (this.addedSessionIds.has(media.id)) {
      this.sessionMedia.revoke(media.id);
      this.addedSessionIds.delete(media.id);
    }
    this.touch();
  }

  isUnavailable(media: MockMedia): boolean {
    return this.sessionMedia.urlFor(media) === null;
  }

  startRelink(media: MockMedia): void {
    this.relinkTarget = media;
    this.relinkInput()?.nativeElement.click();
  }

  onRelinkChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    const target = this.relinkTarget;
    this.relinkTarget = null;
    if (!file || !target) return;
    const result = this.sessionMedia.reattach(target, file);
    if (result.ok) {
      this.fileErrors.set([]);
      this.touch();
      void this.feedback.success('Arquivo anexado de novo. Ele só fica neste aparelho enquanto a página estiver aberta.');
    } else {
      this.fileErrors.set([result.message]);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    void this.save();
  }

  async save(): Promise<void> {
    if (this.saving()) return;
    this.submitted.set(true);
    const composed = this.composeDate();
    const draft = this.buildDraft(composed.date);
    const errors: FieldErrors = { ...validateMemoryDraft(draft) };
    if (composed.error) errors['date'] = composed.error;
    this.errors.set(errors);
    if (Object.keys(errors).length > 0) {
      queueMicrotask(() => this.errorSummary()?.nativeElement.focus());
      return;
    }

    this.saving.set(true);
    await wait(700); // etapa breve "Salvando lembrança…" (nada é enviado)
    const id = this.id();
    const result = id ? this.memories.update(id, draft) : this.memories.create(draft);
    this.saving.set(false);

    if (!result.ok) {
      this.errors.set(result.fieldErrors ?? {});
      await this.feedback.error(result.error);
      queueMicrotask(() => this.errorSummary()?.nativeElement.focus());
      return;
    }
    this.saved = true;
    await this.feedback.success(
      id ? 'Lembrança atualizada.' : 'Lembrança adicionada.',
    );
    this.nav.navigateBack('/familia/memorias');
  }
  cancel(): void {
    this.goBack();
  }

  goBack(): void {
    this.nav.navigateBack('/familia/memorias');
  }

  hasUnsavedChanges(): boolean {
    return this.dirty() && !this.saved && !this.saving();
  }

  confirmDiscard(): Promise<boolean> {
    return this.feedback.confirm({
      header: 'Descartar as alterações?',
      message: 'O que você escreveu ou escolheu nesta tela não será guardado.',
      confirmText: 'Sim, descartar',
      cancelText: 'Continuar editando',
      destructive: true,
    });
  }

  private touch(): void {
    this.dirty.set(true);
  }
  private composeDate(): { date?: string; error?: string } {
    const y = this.year().trim();
    const m = this.month().trim();
    const d = this.day().trim();
    if (!y && !m && !d) return {};
    if (!y) return { error: 'Informe o ano da lembrança, ou deixe a data em branco.' };
    if (!/^\d{4}$/.test(y)) return { error: 'O ano deve ter 4 números, por exemplo 1985.' };
    if (!m && d) return { error: 'Escolha o mês, ou apague o dia.' };
    if (!m) return { date: y };
    const mm = m.padStart(2, '0');
    if (!d) return { date: `${y}-${mm}` };
    if (!/^\d{1,2}$/.test(d)) return { error: 'O dia deve ser um número, por exemplo 15.' };
    return { date: `${y}-${mm}-${d.padStart(2, '0')}` };
  }

  private buildDraft(date: string | undefined): MemoryDraft {
    return {
      title: this.title(),
      story: this.story(),
      date,
      people: this.people(),
      media: this.media(),
    };
  }
}
