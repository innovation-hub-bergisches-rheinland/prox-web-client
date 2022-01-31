import { Component, Inject, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ProjectService } from '@data/service/project.service';
import { ModuleType, StudyProgramsWithModules } from '@data/schema/project-service.types';
import { EMPTY, Observable } from 'rxjs';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-module-types-selector',
  templateUrl: './module-types-selector.component.html',
  styleUrls: ['./module-types-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModuleTypesSelectorComponent),
      multi: true
    }
  ]
})
export class ModuleTypesSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  studyPrograms$: Observable<StudyProgramsWithModules[]>;
  moduleTypes$: Observable<ModuleType[]>;
  selectedModules: ModuleType[] = [];

  @Input()
  disabled = false;

  onTouched: Function = () => {};
  onChange = (moduleTypes: ModuleType[]) => {};

  constructor(private projectService: ProjectService, private fb: FormBuilder) {}

  ngOnInit() {
    this.studyPrograms$ = this.projectService.getAllStudyPrograms('withModules');
  }

  ngOnDestroy() {}

  registerOnChange(onChange: (moduleTypes: ModuleType[]) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value: ModuleType[]): void {
    if (value) {
      this.selectedModules = value;
      this.onChange(this.selectedModules);
    }
  }
}

/*@Input()
  studyPrograms: StudyProgramsWithModules[];

  @Input()
  preselectedModules: Pick<ModuleType, 'id'>[];

  filteredModuleTypes: ModuleType[] = [];

  moduleTableDataSource = new MatTableDataSource<ModuleType>();
  moduleSelection = new SelectionModel<ModuleType>(true);
  displayedColumns: string[] = ['select', 'name'];

  @Output()
  change = new EventEmitter<SelectionChange<ModuleType>>();

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {
  }

  ngOnInit(): void {
    // Everytime the StudyProgram selection changed, we need to update the displayed modules that
    // The selected modules contain

    this.moduleTableDataSource.filterPredicate = ((data, filter) => {
      console.log(filter);
      const selectedIds = this.studyProgramSelection.selected.map(sp => sp.id);
      const matchingStudyPrograms = this.studyPrograms.filter(sp => selectedIds.some(si => si === sp.id));
      return matchingStudyPrograms.some(sp => sp.modules.some(mt => mt.id === data.id));
    });

    this.studyProgramSelection.changed.subscribe({
      next: value => {
        this.moduleTableDataSource.filter = JSON.stringify(this.studyProgramSelection.selected);
        console.log(this.moduleTableDataSource.filter);
      }
    });

    this.moduleSelection.changed.subscribe({
      next: value => this.change.emit(value)
    });
  }

  ngOnDestroy(): void {
    this.saveSelectedStudyPrograms();
  }

  private getDistinctModuleTypes(input: ModuleType[]): ModuleType[] {
    return [...new Map(input.map(item => [item.id, item])).values()];
  }

  private moduleTypesCanEqual(m1: Pick<ModuleType, "id">, m2: Pick<ModuleType, "id">): boolean {
    return m1.id === m2.id;
  }*/
