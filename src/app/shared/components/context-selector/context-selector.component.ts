import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { Organization } from '@data/schema/user-service.types';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';
import { map } from 'rxjs/operators';
import { OwnerDiscriminator } from '@data/schema/project-service.types';

export interface Context {
  id: string;
  name: string;
  discriminator: OwnerDiscriminator;
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
  organizationContexts$: Observable<Context[]>;
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
      name: this.username,
      discriminator: 'user'
    };
    this.selectCtrl.valueChanges.subscribe({
      next: value => this.onChange(value)
    });
    this.writeValue(this.userContext);
    this.organizationContexts$ = this.userService.getOrganizationsOfAuthenticatedUser().pipe(
      map(orgs =>
        orgs.map(org => ({
          id: org.id,
          name: org.name,
          discriminator: 'organization'
        }))
      )
    );
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

  compareContexts(c1: Context, c2: Context): boolean {
    return c1.id === c2.id;
  }
}
