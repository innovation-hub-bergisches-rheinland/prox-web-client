import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { Organization } from '@data/schema/user-service.types';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';

interface Context {
  id: string;
  name: string;
}

@Component({
  selector: 'app-context-selector',
  templateUrl: './context-selector.component.html',
  styleUrls: ['./context-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContextSelectorComponent),
      multi: true
    }
  ]
})
export class ContextSelectorComponent implements OnInit, ControlValueAccessor {
  organizations$: Observable<Organization[]>;
  username: string;
  userContext: Context;

  selectCtrl = new FormControl('');

  constructor(private userService: UserService, private keycloakService: KeycloakService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (context: Context) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch = () => {};

  ngOnInit() {
    this.username = this.keycloakService.getUsername();
    this.userContext = {
      id: this.keycloakService.getKeycloakInstance().subject,
      name: this.username
    };
    this.selectCtrl.valueChanges.subscribe({
      next: value => this.onChange(value)
    });
    this.selectCtrl.setValue(this.userContext);
    this.organizations$ = this.userService.getOrganizationsOfAuthenticatedUser();
  }

  writeValue(obj: Context): void {
    this.selectCtrl.setValue(obj);
  }

  registerOnChange(fn: (obj: Context) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
