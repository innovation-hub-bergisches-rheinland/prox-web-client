import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserSearchResult } from '@data/schema/user-service.types';
import { BehaviorSubject, Observable, Subject, delay, mergeMap } from 'rxjs';
import { debounceTime, filter, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

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
  label: string = 'Benutzer';

  userInputCtrl = new FormControl('');
  _users: UserSearchResult[] = [];
  users$: Subject<UserSearchResult[]> = new BehaviorSubject(this._users);
  userAutocomplete$: Observable<UserSearchResult[]>;

  constructor(private userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (user: UserSearchResult[]) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  ngOnInit(): void {
    this.userAutocomplete$ = this.userInputCtrl.valueChanges.pipe(
      debounceTime(120),
      startWith(''),
      filter(input => !!input),
      mergeMap(input => this.userService.searchUser(input)),
      delay(200)
    );
  }

  registerOnChange(fn: (users: UserSearchResult[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: UserSearchResult[]): void {
    this._users = obj;
    this.users$.next(this._users);
  }

  removeUser(user: UserSearchResult) {
    this._users = this._users.filter(t => t.id !== user.id);
    this.onChange(this._users);
    this.users$.next(this._users);
  }

  addUser(user: UserSearchResult) {
    if (!!user && !this._users.some(t => t.id === user.id)) {
      this._users = [...this._users, user];
      this.onChange(this._users);
      this.users$.next(this._users);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value as UserSearchResult;
    this.addUser(selectedUser);
    this.tagInput.nativeElement.value = '';
    this.userInputCtrl.setValue('', { emitEvent: false });
  }

  onOpenInNewClicked(event: MouseEvent) {
    // This way we ensure, that the event is not propagated as a selection event
    event.stopPropagation();
  }

  getAvatarUrl(user: UserSearchResult) {
    return this.userService.getUserAvatar(user.id);
  }
}
