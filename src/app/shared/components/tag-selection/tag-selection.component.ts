import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagService } from '@data/service/tag.service';
import { Observable, delay, mergeMap, of } from 'rxjs';
import { catchError, debounceTime, filter, startWith, tap } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-tag-selection',
  templateUrl: './tag-selection.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TagSelectionComponent
    }
  ]
})
export class TagSelectionComponent implements OnInit, ControlValueAccessor {
  tagSelectCtrl = new FormControl<Tag>(null);
  tagSearchCtrl = new FormControl('');
  filteredTags$: Observable<Tag[]>;
  searching = false;
  disabled = false;

  //  leverage angular directives, components, inputs and outputs or so...
  constructor(private tagService: TagService, private notificationService: NotificationService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (tags: Tag) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  ngOnInit(): void {
    this.filteredTags$ = this.tagSearchCtrl.valueChanges.pipe(
      startWith(''),
      filter(value => !!value && value.length > 1),
      debounceTime(300),
      tap(() => (this.searching = true)),
      mergeMap(input => (input ? this.tagService.findTags(input) : of([]))),
      delay(300),
      catchError(err => {
        console.error(err);
        this.notificationService.error('Tags können aktuell nicht geladen werden. Versuchen Sie es später erneut');
        return of([]);
      })
    );
    this.filteredTags$.subscribe({
      next: () => (this.searching = false),
      error: () => (this.searching = false)
    });

    this.tagSelectCtrl.valueChanges.subscribe({
      next: value => this.writeValue(value)
    });
  }

  registerOnChange(onChange: (tag: Tag) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value: Tag): void {
    if (value) {
      this.onChange(value);
    }
  }
}
