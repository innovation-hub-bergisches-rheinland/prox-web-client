import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Discipline, ModuleType } from '@data/schema/project.types';
import { SearchPreferences } from '@data/schema/user.types';
import { ProjectService } from '@data/service/project.service';
import { UserService } from '@data/service/user.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './search-preferences.component.html'
})
export class SearchPreferencesComponent implements OnInit {
  formGroup = this.fb.group({
    projectSearch: this.fb.group({
      enabled: [false],
      disciplines: new FormControl([]),
      moduleTypes: new FormControl([])
    }),
    lecturerSearch: this.fb.group({
      enabled: [false]
    }),
    organizationSearch: this.fb.group({
      enabled: [false]
    })
  });

  disciplines$: Observable<Discipline[]>;
  modules$: Observable<ModuleType[]>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) {
    this.disciplines$ = this.projectService.getAllDisciplines();
    this.modules$ = this.projectService.getAllModuleTypes();
  }

  @HostListener('window:beforeunload')
  canDeactivate() {
    return true; // TODO
  }

  ngOnInit(): void {
    this.userService.getSearchPreferences().subscribe({
      next: sp => {
        this.setFormValues(sp);
      },
      error: err => {
        this.notificationService.error('Sucheinstellungen konnten nicht geladen werden.');
        console.error(err);
      }
    });
  }

  onSave() {
    const searchPreferences = this.formGroup.getRawValue();
    this.userService.setSearchPreferences(searchPreferences).subscribe({
      next: sp => {
        this.setFormValues(sp);
        this.formGroup.markAsPristine();
      },
      error: err => {
        this.notificationService.error('Sucheinstellungen konnten nicht gespeichert werden.');
        console.error(err);
      }
    });
  }

  setFormValues(searchPreferences: SearchPreferences) {
    this.formGroup.patchValue({
      projectSearch: {
        enabled: searchPreferences.projectSearch?.enabled || false,
        disciplines: searchPreferences.projectSearch?.disciplines?.map(d => d.key) || [],
        moduleTypes: searchPreferences.projectSearch?.moduleTypes?.map(m => m.key) || []
      },
      lecturerSearch: {
        enabled: searchPreferences.lecturerSearch?.enabled || false
      },
      organizationSearch: {
        enabled: searchPreferences.organizationSearch?.enabled || false
      }
    });
  }
}
