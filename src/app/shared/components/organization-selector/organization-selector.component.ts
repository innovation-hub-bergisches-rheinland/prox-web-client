import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ProfileService } from '@data/service/profile.service';
import { KeycloakService } from 'keycloak-angular';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Organization } from '@data/schema/profile.types';

@Component({
  selector: 'app-organization-selector',
  templateUrl: './organization-selector.component.html',
  styleUrls: ['./organization-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrganizationSelectorComponent),
      multi: true
    }
  ]
})
export class OrganizationSelectorComponent implements OnInit, ControlValueAccessor {
  organizations$: Observable<Organization[]>;

  selectCtrl = new FormControl<Organization>(null);

  constructor(private profileService: ProfileService, private notificationService: NotificationService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (context: Organization) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch = () => {};

  ngOnInit() {
    this.selectCtrl.valueChanges.subscribe({
      next: value => this.onChange(value)
    });
    this.organizations$ = this.profileService.getOrganizationsOfUser().pipe(
      catchError(err => {
        this.notificationService.warning('Kontexte können aktuell nicht geladen werden.');
        return of([]);
      })
    );
  }

  writeValue(obj: Organization): void {
    this.selectCtrl.setValue(obj);
  }

  registerOnChange(fn: (obj: Organization) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  compareOrganizations(c1: Organization, c2: Organization): boolean {
    return c1.id === c2.id;
  }
}
