import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Tag } from '@data/schema/tag.resource';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TagService } from '@data/service/tag.service';
import { BehaviorSubject, Observable, Subject, delay, mergeMap } from 'rxjs';
import { debounceTime, filter, startWith } from 'rxjs/operators';

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
  constructor(private tagService: TagService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (tags: Tag[]) => {};

  // TODO: For better maintainability and extensibility we should not use the tagservice here..

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  ngOnInit(): void {
    this.tagRecommendations$ = this.tags$.pipe(mergeMap(tags => this.tagService.getRecommendations(tags)));
    this.tagAutocomplete$ = this.tagInputCtrl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      filter(input => !!input),
      mergeMap(input => this.tagService.findByTagName(input, false)),
      delay(200)
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
    this._tags = this._tags.filter(t => t.tagName !== tag.tagName);
    this.onChange(this._tags);
    this.tags$.next(this._tags);
  }

  addTag(tag: Tag) {
    if (!!tag && !this._tags.some(t => t.tagName === tag.tagName)) {
      this._tags = [...this._tags, tag];
      this.onChange(this._tags);
      this.tags$.next(this._tags);
    }
  }

  addTagEvent(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const tag = new Tag();
      tag.tagName = value;
      this.addTag(tag);
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
