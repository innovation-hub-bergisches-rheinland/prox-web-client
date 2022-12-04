import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Discipline, ModuleType, ProjectState } from '@data/schema/project.types';

export interface ProjectSearch {
  status?: ProjectState;
  moduleTypes?: ModuleType['key'][];
  disciplines?: Discipline['key'][];
  txt?: string;
}

@Component({
  selector: 'app-project-search-panel',
  templateUrl: './project-search-panel.component.html',
  styleUrls: ['./project-search-panel.component.scss']
})
export class ProjectSearchPanelComponent implements OnInit {
  searchIcon = faSearch;
  disciplines$: Observable<Discipline[]>;
  moduleTypes$: Observable<ModuleType[]>;

  searchForm = new FormGroup({
    status: new FormControl<ProjectState>('OFFERED'),
    moduleTypes: new FormControl([]),
    disciplines: new FormControl([]),
    txt: new FormControl('')
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
          disciplines: search.disciplines,
          txt: search.txt
        },
        { emitEvent: false }
      );
    }
  }

  constructor(private projectService: ProjectService, private fb: UntypedFormBuilder) {
    this.disciplines$ = projectService.getAllDisciplines();
    this.moduleTypes$ = projectService.getAllModuleTypes();
  }

  ngOnInit(): void {}

  onSubmit() {
    this.search.emit({
      txt: this.searchForm.controls.txt.value || undefined,
      status: this.searchForm.controls.status.value || undefined,
      moduleTypes: this.searchForm.controls.moduleTypes.value || undefined,
      disciplines: this.searchForm.controls.disciplines.value || undefined
    });
  }
}
