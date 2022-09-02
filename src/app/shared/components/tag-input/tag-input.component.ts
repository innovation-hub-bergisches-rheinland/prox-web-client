import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TagService } from '@data/service/tag.service';
import { BehaviorSubject, Observable, Subject, delay, mergeMap, of } from 'rxjs';
import { catchError, debounceTime, filter, startWith } from 'rxjs/operators';
import { Tag } from '@data/schema/tag-service.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';

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

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagAuto') tagAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  tagAutocompleteTrigger: MatAutocompleteTrigger;
  tagInputCtrl = new FormControl('');
  _tags: Tag[] = [];
  tags$: Subject<Tag[]> = new BehaviorSubject(this._tags);
  tagRecommendations$: Observable<Tag[]>;
  tagAutocomplete$: Observable<Tag[]>;

  //  leverage angular directives, components, inputs and outputs or so...
  constructor(private tagService: TagService, private notificationService: NotificationService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (tags: Tag[]) => {};

  // TODO: For better maintainability and extensibility we should not use the tagservice here..

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  ngOnInit(): void {
    this.tagRecommendations$ = this.tags$.pipe(
      filter(tags => tags.length > 0),
      mergeMap(tags => this.tagService.getRecommendations(tags)),
      catchError(err => {
        this.notificationService.warning('Tag Empfehlungen können aktuell nicht geladen werden.');
        return of([]);
      })
    );
    this.tagAutocomplete$ = this.tagInputCtrl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      filter(input => !!input),
      mergeMap(input => this.tagService.findByTagName(input)),
      delay(200),
      catchError(err => {
        this.notificationService.warning('Tag Vorschäge können aktuell nicht geladen werden.');
        return of([]);
      })
    );
  }

  registerOnChange(fn: (tags: Tag[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: Tag[]): void {
    this._tags = obj;
    this.tags$.next(this._tags);
  }

  removeTag(tag: Tag) {
    this._tags = this._tags.filter(t => t !== tag);
    this.onChange(this._tags);
    this.tags$.next(this._tags);
  }

  addTag(tag: Tag) {
    if (!!tag && !this._tags.some(t => t === tag)) {
      this._tags = [...this._tags, tag];
      this.onChange(this._tags);
      this.tags$.next(this._tags);
    }
  }

  addTagEvent(event: MatChipInputEvent) {
    const input = event.input;
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
    const selectedTag = event.option.value as Tag;
    this.addTag(selectedTag);
    this.tagInput.nativeElement.value = '';
    this.tagInputCtrl.setValue('', { emitEvent: false });
  }
}
