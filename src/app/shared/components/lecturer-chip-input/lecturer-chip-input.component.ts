import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, delay, mergeMap, of } from 'rxjs';
import { catchError, debounceTime, filter, map, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Lecturer } from '@data/schema/profile.types';
import { ProfileService } from '@data/service/profile.service';

@Component({
  selector: 'app-lecturer-chip-input',
  templateUrl: './lecturer-chip-input.component.html',
  styleUrls: ['./lecturer-chip-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LecturerChipInputComponent),
      multi: true
    }
  ]
})
export class LecturerChipInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('lecturerInput') lecturerInput: ElementRef<HTMLInputElement>;
  @ViewChild('lecturerAuto') lecturerAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  lecturerAutocompleteTrigger: MatAutocompleteTrigger;

  @Input()
  label = 'Lehrende';

  lecturerInputCtrl = new UntypedFormControl('');
  _lecturers: Lecturer[] = [];
  lecturers$: Subject<Lecturer[]> = new BehaviorSubject(this._lecturers);
  lecturerAutocomplete$: Observable<Lecturer[]>;

  constructor(private profileService: ProfileService, private notificationService: NotificationService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (lecturer: Lecturer[]) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  ngOnInit(): void {
    this.lecturerAutocomplete$ = this.lecturerInputCtrl.valueChanges.pipe(
      debounceTime(120),
      startWith(''),
      filter(input => !!input && typeof input === 'string'),
      mergeMap(input => this.profileService.findLecturersByName(input)),
      map(p => p.content),
      catchError(err => {
        this.notificationService.error('Lehrende können aktuell nicht geladen werden. Versuchen Sie es später erneut');
        return of([]);
      }),
      delay(200)
    );
  }

  registerOnChange(fn: (lecturers: Lecturer[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: Lecturer[]): void {
    this._lecturers = obj;
    this.lecturers$.next(this._lecturers);
  }

  removeLecturer(lecturer: Lecturer) {
    this._lecturers = this._lecturers.filter(t => t.id !== lecturer.id);
    this.onChange(this._lecturers);
    this.lecturers$.next(this._lecturers);
  }

  addLecturer(lecturer: Lecturer) {
    if (!!lecturer && !this._lecturers.some(t => t.id === lecturer.id)) {
      this._lecturers = [...this._lecturers, lecturer];
      this.onChange(this._lecturers);
      this.lecturers$.next(this._lecturers);
    }
  }

  selectedLecturer(event: MatAutocompleteSelectedEvent): void {
    const selectedlecturer = event.option.value as Lecturer;
    this.addLecturer(selectedlecturer);
    this.lecturerInput.nativeElement.value = '';
    this.lecturerInputCtrl.setValue('', { emitEvent: false });
  }

  onOpenInNewClicked(event: MouseEvent) {
    // This way we ensure, that the event is not propagated as a selection event
    event.stopPropagation();
  }

  errorHandler(event: any) {
    event.target.src = '/assets/images/blank-profile-picture.png';
  }

  setDisabledState(isDisabled: boolean): void {
    this.lecturerInput.nativeElement.disabled = isDisabled;
  }
}
