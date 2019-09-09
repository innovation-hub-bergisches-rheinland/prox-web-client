import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
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
import { ProjectStudyCourseService } from '@prox/core/services';
import { Module, StudyCourse } from '@prox/shared/hal-resources';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => StudyCourseModuleSelectionComponent),
  multi: true
};

const CUSTOM_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => StudyCourseModuleSelectionComponent),
  multi: true
};

@Component({
  selector: 'prox-study-course-module-selection',
  providers: [CUSTOM_VALUE_ACCESSOR, CUSTOM_VALIDATOR],
  templateUrl: './study-course-module-selection.component.html',
  styleUrls: ['./study-course-module-selection.component.scss']
})
export class StudyCourseModuleSelectionComponent
  implements OnInit, ControlValueAccessor, Validator {
  writeValue(obj: any): void {
    const throwError = () => {
      throw new Error('Input for StudyCourseModuleSelection must be an array of type Module');
    };

    if (!Array.isArray(obj)) {
      throwError();
    } else {
      const isModuleReducer = (accumulator, currentValue) =>
        accumulator ? currentValue instanceof Module : false;
      const allElementsAreModules = obj.reduce(isModuleReducer, true);
      if (!allElementsAreModules) {
        throwError();
      } else {
        // console.log(obj);
        // get study course
        // select study course
        // mark correct modules as checked
        // prevent propagation?
      }
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

  @Output() delete = new EventEmitter<any>();

  formGroup: FormGroup;
  studyCoursesObservable: Observable<StudyCourse[]>;
  availableStudyCourses: StudyCourse[] = [];
  filteredStudyCourses: Observable<StudyCourse[]>;
  availableModules: Module[] = [];

  propagateChange = (_: any) => {};

  constructor(
    private formBuilder: FormBuilder,
    private projectStudyCourseService: ProjectStudyCourseService
  ) {}

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
    this.studyCoursesObservable.subscribe(courses => (this.availableStudyCourses = courses));

    this.formGroup.controls.studyCourse.valueChanges.subscribe(value => {
      if (value instanceof StudyCourse) {
        this._createModuleSelection(value);
      }
    });
  }

  get moduleArray(): FormArray {
    return this.formGroup.get('moduleArray') as FormArray;
  }

  private _createModuleSelection(course: StudyCourse) {
    course.getModules().subscribe(modules => {
      let moduleArray = this.formBuilder.array([], minSelectedValidator);

      for (let index = 0; index < modules.length; index++) {
        moduleArray.push(this.formBuilder.control(false));
      }

      this.formGroup.setControl('moduleArray', moduleArray);
      this.availableModules = modules;

      moduleArray.valueChanges.subscribe(value => {
        this.propagateChange(this._getSelectedModules());
      });

      if (modules.length === 1) {
        moduleArray.controls[0].setValue(true);
      } else {
        this.propagateChange([]);
      }
    });
  }

  private _getSelectedModules(): Module[] {
    let selectedModules = [];
    let moduleArray = this.formGroup.controls.moduleArray as FormArray;
    for (let index = 0; index < moduleArray.length; index++) {
      if (moduleArray.controls[index].value) {
        selectedModules.push(this.availableModules[index]);
      }
    }
    return selectedModules;
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
  return control.value instanceof StudyCourse ? null : { invalidStudyCourse: true };
}

export function minSelectedValidator(formArray: FormArray): { [key: string]: boolean } | null {
  const selectedCount = formArray.controls
    .map(control => control.value)
    .reduce((prev, next) => (next ? prev + next : prev), 0);
  return selectedCount >= 1 ? null : { noneSelected: true };
}
