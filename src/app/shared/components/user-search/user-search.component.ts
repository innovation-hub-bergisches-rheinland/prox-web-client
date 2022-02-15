import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserSearchResult } from '@data/schema/user-service.types';
import { mergeMap, Observable, of } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSearchComponent),
      multi: true
    }
  ]
})
export class UserSearchComponent implements OnInit, OnDestroy, ControlValueAccessor {
  userSearchInput = new FormControl();
  filteredUsers$: Observable<UserSearchResult[]>;

  @Input()
  disabled = false;

  onTouched: Function = () => {};
  onChange = (user: UserSearchResult) => {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.filteredUsers$ = this.userSearchInput.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      tap(input => console.log(input)),
      mergeMap(input => (input ? this.userService.searchUser(input) : of([])))
    );
  }

  ngOnDestroy() {}

  onSelectResult(event: MatAutocompleteSelectedEvent) {
    const searchResult: UserSearchResult = event.option.value;
    this.writeValue(searchResult);
  }

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
      this.userSearchInput.setValue('', {
        emitEvent: false
      });
    }
  }
}
