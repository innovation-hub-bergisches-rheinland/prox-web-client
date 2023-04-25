import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TagService } from '@data/service/tag.service';
import { BehaviorSubject, Observable, Subject, delay, mergeMap, of } from 'rxjs';
import { catchError, debounceTime, filter, map, startWith } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TagInputComponent
    }
  ]
})
export class TagInputComponent implements OnInit, ControlValueAccessor {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input()
  appearance: MatFormFieldAppearance = 'outline';

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagAuto') tagAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  tagAutocompleteTrigger: MatAutocompleteTrigger;
  tagInputCtrl = new UntypedFormControl('');
  _tags: string[] = [];
  tags$: Subject<string[]> = new BehaviorSubject(this._tags);
  tagRecommendations$: Observable<string[]>;
  tagAutocomplete$: Observable<string[]>;

  //  leverage angular directives, components, inputs and outputs or so...
  constructor(private tagService: TagService, private notificationService: NotificationService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (tags: string[]) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  ngOnInit(): void {
    this.tagRecommendations$ = this.tags$.pipe(
      mergeMap(tags => {
        if (tags.length > 0) {
          return this.tagService.getRecommendations(tags);
        } else {
          return of([]);
        }
      }),
      map(tags => tags.map(t => t.tagName)),
      catchError(err => {
        this.notificationService.warning('Tag Empfehlungen können aktuell nicht geladen werden.');
        return of([]);
      })
    );
    this.tagAutocomplete$ = this.tagInputCtrl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      filter(input => !!input),
      mergeMap(input => this.tagService.findTags(input)),
      map(tags => tags.map(t => t.tagName)),
      delay(200),
      catchError(err => {
        this.notificationService.warning('Tag Vorschäge können aktuell nicht geladen werden.');
        return of([]);
      })
    );
  }

  registerOnChange(fn: (tags: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: string[]): void {
    this._tags = obj;
    this.tags$.next(this._tags);
  }

  removeTag(tag: string) {
    this._tags = this._tags.filter(t => t !== tag);
    this.onChange(this._tags);
    this.tags$.next(this._tags);
  }

  addTag(tag: string) {
    const sluggedTag = this.slugify(tag);

    if (!!sluggedTag && !this._tags.some(t => t === sluggedTag)) {
      this._tags = [...this._tags, sluggedTag];
      this.onChange(this._tags);
      this.tags$.next(this._tags);
    }
  }

  addTagEvent(event: MatChipInputEvent) {
    const input = event.chipInput.inputElement;
    const value = event.value;

    if ((value || '').trim()) {
      this.addTag(value);
    }

    if (input) {
      input.value = '';
    }

    this.tagAutocompleteTrigger.closePanel();
    this.tagInputCtrl.setValue('', { emitEvent: false });
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const selectedTag = event.option.value;
    this.addTag(selectedTag);
    this.tagInput.nativeElement.value = '';
    this.tagInputCtrl.setValue('', { emitEvent: false });
  }

  private slugify(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
