import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Discipline, ModuleType, ProjectState } from '@data/schema/project.types';
import { SearchService } from '@shared/modules/search/search.service';

export interface ProjectSearch {
  status?: ProjectState[];
  moduleTypes?: ModuleType['key'][];
  disciplines?: Discipline['key'][];
  txt?: string;
  tags?: string[];
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
    status: new FormControl<ProjectState[]>(['PROPOSED', 'OFFERED']),
    moduleTypes: new FormControl([]),
    disciplines: new FormControl([]),
    tags: new FormControl([]),
    txt: new FormControl('')
  });

  @Output()
  search = new EventEmitter<ProjectSearch>();

  @Input()
  set searchValues(value: ProjectSearch) {
    this.searchForm.patchValue(value);
  }

  constructor(private projectService: ProjectService, private searchService: SearchService) {}

  ngOnInit(): void {
    this.disciplines$ = this.projectService.getAllDisciplines();
    this.moduleTypes$ = this.projectService.getAllModuleTypes();
  }

  onSubmit() {
    const search = {
      txt: this.searchForm.controls.txt.value || undefined,
      status: this.searchForm.controls.status.value || undefined,
      moduleTypes: this.searchForm.controls.moduleTypes.value || undefined,
      disciplines: this.searchForm.controls.disciplines.value || undefined,
      tags: this.searchForm.controls.tags.value || undefined
    } satisfies ProjectSearch;
    this.searchService.saveProjectSearch(search);
    this.search.emit(search);
  }
}
