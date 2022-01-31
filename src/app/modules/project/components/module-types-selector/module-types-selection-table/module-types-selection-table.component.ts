import { Component, Input, OnInit, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ModuleType, StudyProgram, StudyProgramsWithModules } from '@data/schema/project-service.types';
import { map } from 'rxjs/operators';
import { flatten } from 'lodash';

// TODO: Refactor the equality checks, these are not really nice, maybe stop using object references.
//  Should be done in the whole component family

@Component({
  selector: 'app-module-types-selection-table',
  templateUrl: './module-types-selection-table.component.html',
  styleUrls: ['./module-types-selection-table.component.scss']
})
export class ModuleTypesSelectionTableComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name'];
  private _studyPrograms: StudyProgramsWithModules[];
  private _allModules: ModuleType[];
  filteredModules: ModuleType[];

  moduleSelection = new SelectionModel<ModuleType>(true);

  @Output()
  selectedModulesChange = this.moduleSelection.changed.pipe(map(item => item.source.selected));

  @Input()
  set studyPrograms(sp: StudyProgramsWithModules[]) {
    this._studyPrograms = sp;
    this.filteredModules = this._allModules = this.distinctModules(flatten(sp.map(s => s.modules)));
  }

  get studyPrograms(): StudyProgramsWithModules[] {
    return this._studyPrograms;
  }

  private distinctModules(modules: ModuleType[]): ModuleType[] {
    return [...new Map(modules.map(item => [item.key, item])).values()];
  }

  @Input()
  set selectedModules(selectedModules: ModuleType[]) {
    const modules = this._allModules.filter(m => selectedModules.some(m1 => m.key === m1.key));
    this.moduleSelection.select(...modules);
    this.filteredModules = this.distinctModules([...this.filteredModules, ...modules]);
  }

  constructor() {}

  ngOnInit(): void {}

  applyFilter(selectedStudyPrograms: StudyProgram[]) {
    const nestedMatchingModules = this._studyPrograms.filter(s => selectedStudyPrograms.some(s1 => s1.key === s.key)).map(s => s.modules);
    this.filteredModules = this.distinctModules(flatten(nestedMatchingModules));
    this.moduleSelection.deselect(...this.moduleSelection.selected.filter(ms => !this.filteredModules.some(m => m.key === ms.key)));
  }
}
