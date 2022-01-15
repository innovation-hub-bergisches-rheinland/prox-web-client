import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ProjectService } from '@data/service/project.service';
import { flatten } from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { Observable, of, withLatestFrom } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

interface ModuleType {
  id: string;
  name: string;
}

interface StudyProgram {
  id: string;
  name: string;
  modules: ModuleType[];
}

@Component({
  selector: 'app-module-types-selector',
  templateUrl: './module-types-selector.component.html',
  styleUrls: ['./module-types-selector.component.scss']
})
export class ModuleTypesSelectorComponent implements OnInit, OnDestroy {
  private STORAGE_PRE_SELECTED_KEY = 'project-editor-preselected';

  studyPrograms$: Observable<StudyProgram[]>;
  moduleTypes$: Observable<ModuleType[]>;
  filteredModuleTypes$: Observable<ModuleType[]>;

  moduleTableDataSource = new MatTableDataSource<ModuleType>();
  moduleSelection = new SelectionModel<ModuleType>(true);
  studyProgramSelection = new SelectionModel<StudyProgram>(true);
  displayedColumns: string[] = ['select', 'name'];

  @Output()
  change = new EventEmitter<SelectionChange<ModuleType>>();

  @Input()
  set preselect(preselect: Pick<ModuleType, 'id'>[]) {
    if (preselect.length > 0) {
      of(preselect)
        .pipe(withLatestFrom(this.moduleTypes$))
        .subscribe({
          next: ([val, moduleTypes]) => {
            this.moduleSelection.select(
              ...moduleTypes.filter(mt => val.some(id => id.id === mt.id))
            );
          }
        });
    }
  }

  constructor(
    private projectService: ProjectService,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.studyPrograms$ =
      this.projectService.getAllStudyPrograms('withModules');

    // All modules offered by our study programs
    this.moduleTypes$ = this.studyPrograms$.pipe(
      map(studyPrograms =>
        this.getDistinctModuleTypes(
          flatten(studyPrograms.map(sp => sp.modules))
        )
      )
    );

    // Select the last selected StudyPrograms
    this.loadStudyProgramsFromStorage().subscribe(value => {
      this.studyProgramSelection.select(...value);
    });

    // Everytime the StudyProgram selection changed, we need to update the displayed modules that
    // The selected modules contain
    this.filteredModuleTypes$ = this.studyProgramSelection.changed.pipe(
      withLatestFrom(this.moduleTypes$),
      map(([_val, moduleTypes]) =>
        this.filterModuleTypes(moduleTypes, this.studyProgramSelection.selected)
      )
    );

    // Delete all selected Modules from selection that aren't in the filter
    this.filteredModuleTypes$.subscribe({
      next: value =>
        this.moduleSelection.deselect(
          ...this.moduleSelection.selected.filter(
            mt => !value.some(v => this.moduleTypesCanEqual(v, mt))
          )
        )
    });

    this.moduleSelection.changed.subscribe({
      next: value => this.change.emit(value)
    });
  }

  ngOnDestroy(): void {
    this.saveSelectedStudyPrograms();
  }

  private filterModuleTypes(
    input: ModuleType[],
    selected: StudyProgram[]
  ): ModuleType[] {
    const filtered = input.filter(mt =>
      selected.some(sp =>
        sp.modules.some(item => this.moduleTypesCanEqual(item, mt))
      )
    );

    return filtered;
  }

  private getDistinctModuleTypes(input: ModuleType[]): ModuleType[] {
    return [...new Map(input.map(item => [item.id, item])).values()];
  }

  private moduleTypesCanEqual(m1: ModuleType, m2: ModuleType): boolean {
    return m1.id === m2.id;
  }

  private studyProgramsCanEqual(s1: StudyProgram, s2: StudyProgram): boolean {
    return s1.id === s2.id;
  }

  selectModule(element: ModuleType) {
    this.moduleSelection.toggle(element);
  }

  saveSelectedStudyPrograms() {
    this.storage.set(
      this.STORAGE_PRE_SELECTED_KEY,
      JSON.stringify(this.studyProgramSelection.selected.map(sp => sp.id))
    );
  }

  loadStudyProgramsFromStorage(): Observable<StudyProgram[]> {
    const loadedData: string[] = JSON.parse(
      this.storage.get(this.STORAGE_PRE_SELECTED_KEY)
    );

    return of(loadedData).pipe(
      withLatestFrom(this.studyPrograms$),
      map(([val, studyPrograms]) => {
        if (!val || !Array.isArray(val) || val.length === 0) {
          return studyPrograms;
        }
        return studyPrograms.filter(sp => val.some(id => sp.id === id));
      })
    );
  }
}
