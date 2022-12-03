import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { Observable, delay, mergeMap, of } from 'rxjs';
import { catchError, debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { User } from '@data/schema/user.types';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSearchComponent),
      multi: true
    }
  ]
})
export class UserSearchComponent implements OnInit, ControlValueAccessor {
  @HostBinding('class')
  classes = 'app-user-search';
  @HostBinding('role')
  role = 'combobox';

  userSearchCtrl = new UntypedFormControl();
  userSearchFilteringCtrl = new UntypedFormControl();
  filteredUsers$: Observable<User[]>;
  searching = false;

  @Input()
  disabled = false;

  constructor(private userService: UserService, private notificationService: NotificationService) {}

  @Input()
  filter: (UserSearchResult) => boolean = () => true;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (user: User) => {};

  ngOnInit(): void {
    this.filteredUsers$ = this.userSearchFilteringCtrl.valueChanges.pipe(
      startWith(''),
      filter(value => !!value),
      debounceTime(300),
      tap(() => (this.searching = true)),
      mergeMap(input => (input ? this.userService.search(input) : of([]))),
      map(result => result.filter(this.filter)),
      delay(300),
      catchError(err => {
        this.notificationService.error('Benutzer können aktuell nicht geladen werden. Versuchen Sie es später erneut');
        return of([]);
      })
    );
    this.filteredUsers$.subscribe({
      next: () => (this.searching = false),
      error: () => (this.searching = false)
    });

    this.userSearchCtrl.valueChanges.subscribe({
      next: value => this.writeValue(value)
    });
  }

  registerOnChange(onChange: (user: User) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value: User): void {
    if (value) {
      this.onChange(value);
    }
  }
}
