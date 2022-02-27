import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserSearchResult } from '@data/schema/user-service.types';
import { delay, mergeMap, Observable, of } from 'rxjs';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'combobox',
    class: 'app-user-search'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSearchComponent),
      multi: true
    }
  ]
})
export class UserSearchComponent implements OnInit, OnDestroy, ControlValueAccessor {
  userSearchCtrl = new FormControl();
  userSearchFilteringCtrl = new FormControl();
  filteredUsers$: Observable<UserSearchResult[]>;
  searching = false;

  @Input()
  disabled = false;

  @Input()
  filter: (UserSearchResult) => boolean = () => true;

  onTouched: Function = () => {};
  onChange = (user: UserSearchResult) => {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.filteredUsers$ = this.userSearchFilteringCtrl.valueChanges.pipe(
      startWith(''),
      filter(value => !!value),
      debounceTime(300),
      tap(() => (this.searching = true)),
      mergeMap(input => (input ? this.userService.searchUser(input) : of([]))),
      map(result => result.filter(this.filter)),
      delay(300)
    );
    this.filteredUsers$.subscribe({
      next: () => (this.searching = false),
      error: () => (this.searching = false)
    });

    this.userSearchCtrl.valueChanges.subscribe({
      next: value => this.writeValue(value)
    });
  }

  ngOnDestroy() {}

  registerOnChange(onChange: (user: UserSearchResult) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value: UserSearchResult): void {
    if (value) {
      this.onChange(value);
    }
  }
}
