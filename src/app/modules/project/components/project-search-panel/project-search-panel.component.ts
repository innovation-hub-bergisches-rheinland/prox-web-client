import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { Status } from '@data/schema/project-service.types';
import { UntypedFormBuilder } from '@angular/forms';
import { Discipline, ModuleType } from '@data/schema/project.types';

export type ProjectSearch = {
  status?: Status;
  moduleTypes?: ModuleType['key'][];
  specializations?: Discipline['key'][];
  searchString?: string;
};

@Component({
  selector: 'app-project-search-panel',
  templateUrl: './project-search-panel.component.html',
  styleUrls: ['./project-search-panel.component.scss']
})
export class ProjectSearchPanelComponent implements OnInit {
  searchIcon = faSearch;
  specializations$: Observable<Discipline[]>;
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

  constructor(private projectService: ProjectService, private fb: UntypedFormBuilder) {
    this.specializations$ = projectService.getAllDisciplines();
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
