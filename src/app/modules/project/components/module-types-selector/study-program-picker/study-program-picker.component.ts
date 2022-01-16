import {
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Provider
} from '@angular/core';
import { ModuleType, StudyProgram } from '@data/schema/project-service.types';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-study-program-picker',
  templateUrl: './study-program-picker.component.html',
  styleUrls: ['./study-program-picker.component.scss']
})
export class StudyProgramPickerComponent implements OnInit, OnDestroy {
  @Input()
  studyPrograms: StudyProgram[];

  selectedStudyPrograms = new SelectionModel<StudyProgram>(true);

  @Input()
  restoreKey = 'restore-study-program-picker';

  @Output()
  valueChange = this.selectedStudyPrograms.changed.pipe(
    map(s => s.source.selected)
  );

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  ngOnInit(): void {
    const previouslySelected = this.studyPrograms.filter(sp =>
      this.loadPreviouslySelectedKeysFromStorage().some(s => s === sp.key)
    );
    if (previouslySelected.length > 0) {
      this.writeValue(previouslySelected);
    } else {
      this.writeValue(this.studyPrograms);
    }
  }

  ngOnDestroy() {
    this.saveSelectedStudyPrograms();
  }

  writeValue(obj: Pick<StudyProgram, 'key'>[]): void {
    if (obj) {
      this.selectedStudyPrograms.select(
        ...this.studyPrograms.filter(sp => obj.some(s => s.key === sp.key))
      );
    }
  }

  saveSelectedStudyPrograms() {
    this.storage.set(
      this.restoreKey,
      JSON.stringify(this.selectedStudyPrograms.selected.map(sp => sp.key))
    );
  }

  loadPreviouslySelectedKeysFromStorage(): string[] {
    const loadedData: string[] =
      JSON.parse(this.storage.get(this.restoreKey)) ?? [];

    if (!loadedData || !Array.isArray(loadedData)) {
      return [];
    }

    return loadedData;
  }
}
