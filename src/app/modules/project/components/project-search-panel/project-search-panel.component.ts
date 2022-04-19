import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { ModuleType, Specialization, Status } from '@data/schema/project-service.types';
import { FormBuilder } from '@angular/forms';

export type ProjectSearch = {
  status?: Status;
  moduleTypes?: ModuleType['key'][];
  specializations?: Specialization['key'][];
  searchString?: string;
};

@Component({
  selector: 'app-project-search-panel',
  templateUrl: './project-search-panel.component.html',
  styleUrls: ['./project-search-panel.component.scss']
})
export class ProjectSearchPanelComponent implements OnInit {
  searchIcon = faSearch;
  specializations$: Observable<Specialization[]>;
  moduleTypes$: Observable<ModuleType[]>;

  searchForm = this.fb.group({
    status: ['AVAILABLE'],
    moduleTypes: [[]],
    specializations: [[]],
    txtSearch: ['']
  });

  @Output()
  search = new EventEmitter<ProjectSearch>();

  @Input()
  set initial(search: ProjectSearch | undefined) {
    if (search && Object.values(search).some(p => p !== undefined)) {
      this.searchForm.patchValue(
        {
          status: search.status,
          moduleTypes: search.moduleTypes,
          specializations: search.specializations,
          txtSearch: search.searchString
        },
        { emitEvent: false }
      );
    }
  }

  constructor(private projectService: ProjectService, private fb: FormBuilder) {
    this.specializations$ = projectService.getAllSpecializations();
    this.moduleTypes$ = projectService.getAllModuleTypes();
  }

  ngOnInit(): void {}

  onSubmit() {
    this.search.emit({
      searchString: this.searchForm.controls.txtSearch.value || undefined,
      status: this.searchForm.controls.status.value || undefined,
      moduleTypes: this.searchForm.controls.moduleTypes.value || undefined,
      specializations: this.searchForm.controls.specializations.value || undefined
    });
  }
}
