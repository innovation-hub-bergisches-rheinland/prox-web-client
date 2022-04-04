import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-simple-chip-input',
  templateUrl: './simple-chip-input.component.html',
  styleUrls: ['./simple-chip-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SimpleChipInputComponent
    }
  ]
})
export class SimpleChipInputComponent implements ControlValueAccessor {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input()
  title: string;

  @Input()
  placeholder: string;

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  chipInputCtrl = new FormControl('');
  _chips: string[] = [];
  chips$: Subject<string[]> = new BehaviorSubject(this._chips);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (chip: string[]) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  registerOnChange(fn: (chips: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: string[]): void {
    this._chips = obj;
    this.chips$.next(this._chips);
  }

  removeChip(chip: string) {
    this._chips = this._chips.filter(c => c !== chip);
    this.onChange(this._chips);
    this.chips$.next(this._chips);
  }

  addChip(chip: string) {
    if (!!chip && !this._chips.some(c => c === chip)) {
      this._chips = [...this._chips, chip];
      this.onChange(this._chips);
      this.chips$.next(this._chips);
    }
  }

  addChipEvent(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.addChip(value);
    }

    if (input) {
      input.value = '';
    }

    this.chipInputCtrl.setValue('', { emitEvent: false });
  }
}
