import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'underscore';

import { ProjectStudyCourseService } from '@data/service/project-study-course.service';
import { StudyCourse } from '@data/schema/study-course.resource';
import { Module } from '@data/schema/module.resource';

const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => StudyCourseModuleSelectionComponent),
  multi: true
};

const CUSTOM_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => StudyCourseModuleSelectionComponent),
  multi: true
};

export class StudyCourseModuleSelectionModel {
  constructor(
    public studyCourse: StudyCourse,
    public selectedModules: Module[]
  ) {}
}

@Component({
  selector: 'app-study-course-module-selection',
  providers: [CUSTOM_VALUE_ACCESSOR, CUSTOM_VALIDATOR],
  templateUrl: './study-course-module-selection.component.html',
  styleUrls: ['./study-course-module-selection.component.scss']
})
export class StudyCourseModuleSelectionComponent
  implements OnInit, ControlValueAccessor, Validator {
  constructor(
    private formBuilder: FormBuilder,
    private projectStudyCourseService: ProjectStudyCourseService
  ) {}

  get moduleArray(): FormArray {
    return this.formGroup.get('moduleArray') as FormArray;
  }

  @Output() delete = new EventEmitter<any>();

  modulesToSet: Module[];

  formGroup: FormGroup;
  studyCoursesObservable: Observable<StudyCourse[]>;
  availableStudyCourses: StudyCourse[] = [];
  filteredStudyCourses: Observable<StudyCourse[]>;
  availableModules: Module[] = [];
  writeValue(obj: any): void {
    if (obj === null) {
      // reset ?
      return;
    }

    if (!(obj instanceof StudyCourseModuleSelectionModel)) {
      throw new Error(
        'Input for StudyCourseModuleSelection must be of type StudyCourseModuleSelectionModel'
      );
    } else {
      const data = obj as StudyCourseModuleSelectionModel;
      this.modulesToSet = data.selectedModules;
      this.formGroup.controls.studyCourse.setValue(data.studyCourse);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // nothing here ?
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.formGroup.controls.studyCourse.invalid) {
      return this.formGroup.controls.studyCourse.errors;
    }

    if (this.formGroup.controls.moduleArray.invalid) {
      return this.formGroup.controls.moduleArray.errors;
    }
    return null;
  }

  propagateChange = (change: any) => {};

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      studyCourse: ['', [isStudyCourseValidator]],
      moduleArray: this.formBuilder.array([])
    });

    this.filteredStudyCourses = this.formGroup.controls.studyCourse.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCourseName(value))
    );

    this.studyCoursesObservable = this.projectStudyCourseService.getAll();
    this.studyCoursesObservable.subscribe(courses => {
      this.availableStudyCourses = courses;
    });

    this.formGroup.controls.studyCourse.valueChanges.subscribe(value => {
      if (value instanceof StudyCourse) {
        this._createModuleSelection(value);
      }
    });
  }

  private _createModuleSelection(course: StudyCourse) {
    course.getModules().subscribe(modules => {
      const moduleArray = this.formBuilder.array([], minSelectedValidator);

      for (const {} of modules) {
        moduleArray.push(this.formBuilder.control(false));
      }

      this.formGroup.setControl('moduleArray', moduleArray);
      this.availableModules = modules;

      moduleArray.valueChanges.subscribe(value => {
        this.propagateChange(this._getSelectedModules());
      });

      if (this.modulesToSet) {
        for (const moduleToSet of this.modulesToSet) {
          const currentModule: any = moduleToSet;
          const i = _.findIndex(this.availableModules, (x: any) => {
            return x.id === currentModule.id;
          });
          if (i >= 0) {
            moduleArray.controls[i].setValue(true);
          }
        }
        this.modulesToSet = null;
      } else {
        if (modules.length === 1) {
          moduleArray.controls[0].setValue(true);
        } else {
          this.propagateChange([]);
        }
      }
    });
  }

  private _getSelectedModules(): StudyCourseModuleSelectionModel {
    const selectedModules = [];
    const moduleArray = this.formGroup.controls.moduleArray as FormArray;
    for (let index = 0; index < moduleArray.length; index++) {
      if (moduleArray.controls[index].value) {
        selectedModules.push(this.availableModules[index]);
      }
    }
    return new StudyCourseModuleSelectionModel(
      this.formGroup.controls.studyCourse.value,
      selectedModules
    );
  }

  private _filterCourseName(value: string): StudyCourse[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.availableStudyCourses.filter(course =>
        course.name.toLowerCase().includes(filterValue)
      );
    }
  }

  displayCourseName(course?: StudyCourse): string | undefined {
    return course ? `${course.name} ${course.academicDegree}` : undefined;
  }

  deleteCard() {
    this.delete.emit();
  }
}

export function isStudyCourseValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  return control.value instanceof StudyCourse
    ? null
    : { invalidStudyCourse: true };
}

export function minSelectedValidator(
  formArray: FormArray
): { [key: string]: boolean } | null {
  const selectedCount = formArray.controls
    .map(control => control.value)
    .reduce((prev, next) => (next ? prev + next : prev), 0);
  return selectedCount >= 1 ? null : { noneSelected: true };
}
