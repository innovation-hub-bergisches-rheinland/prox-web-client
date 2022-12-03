import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ProfileService } from '@data/service/profile.service';
import { KeycloakService } from 'keycloak-angular';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';

export interface Context {
  id: string;
  name: string;
  discriminator: 'lecturer' | 'organization';
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

  selectCtrl = new UntypedFormControl('');

  constructor(
    private userService: ProfileService,
    private keycloakService: KeycloakService,
    private notificationService: NotificationService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (context: Context) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch = () => {};

  ngOnInit() {
    this.username = this.keycloakService.getUsername();
    this.userContext = {
      id: this.keycloakService.getKeycloakInstance().subject,
      name: this.username,
      discriminator: 'lecturer'
    };
    this.selectCtrl.valueChanges.subscribe({
      next: value => this.onChange(value)
    });
    this.writeValue(this.userContext);
    this.organizationContexts$ = this.userService.getOrganizationsOfUser().pipe(
      map(orgs =>
        orgs.map(
          org =>
            ({
              id: org.id,
              name: org.name,
              discriminator: 'organization'
            } as Context)
        )
      ),
      catchError(err => {
        this.notificationService.warning('Kontexte können aktuell nicht geladen werden.');
        return of([]);
      })
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
