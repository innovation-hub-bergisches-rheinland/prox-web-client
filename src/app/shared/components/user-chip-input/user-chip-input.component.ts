import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, delay, mergeMap, of } from 'rxjs';
import { catchError, debounceTime, filter, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { User } from '@data/schema/user.types';

@Component({
  selector: 'app-user-chip-input',
  templateUrl: './user-chip-input.component.html',
  styleUrls: ['./user-chip-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserChipInputComponent),
      multi: true
    }
  ]
})
export class UserChipInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('userInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('userAuto') tagAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  tagAutocompleteTrigger: MatAutocompleteTrigger;

  @Input()
  label = 'Benutzer';

  userInputCtrl = new UntypedFormControl('');
  _users: User[] = [];
  users$: Subject<User[]> = new BehaviorSubject(this._users);
  userAutocomplete$: Observable<User[]>;

  constructor(private userService: UserService, private notificationService: NotificationService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (user: User[]) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  ngOnInit(): void {
    this.userAutocomplete$ = this.userInputCtrl.valueChanges.pipe(
      debounceTime(120),
      startWith(''),
      filter(input => !!input),
      mergeMap(input => this.userService.search(input)),
      catchError(err => {
        this.notificationService.error('Benutzer können aktuell nicht geladen werden. Versuchen Sie es später erneut');
        return of([]);
      }),
      delay(200)
    );
  }

  registerOnChange(fn: (users: User[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: User[]): void {
    this._users = obj;
    this.users$.next(this._users);
  }

  removeUser(user: User) {
    this._users = this._users.filter(t => t.id !== user.id);
    this.onChange(this._users);
    this.users$.next(this._users);
  }

  addUser(user: User) {
    if (!!user && !this._users.some(t => t.id === user.id)) {
      this._users = [...this._users, user];
      this.onChange(this._users);
      this.users$.next(this._users);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value as User;
    this.addUser(selectedUser);
    this.tagInput.nativeElement.value = '';
    this.userInputCtrl.setValue('', { emitEvent: false });
  }

  onOpenInNewClicked(event: MouseEvent) {
    // This way we ensure, that the event is not propagated as a selection event
    event.stopPropagation();
  }
}
