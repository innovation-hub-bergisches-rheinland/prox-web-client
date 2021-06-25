import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';
import { Toast } from './types';

@Component({
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  constructor(
    public snackbar: MatSnackBar,
    private changeDetection: ChangeDetectorRef,
    private _snackRef: MatSnackBarRef<ToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: Toast[]
  ) {}

  ngOnInit(): void {}

  private close($event: any, index: number) {
    this.data.splice(index, 1);
    if (this.data.length === 0) {
      console.log('Going to dismiss');
      console.log(this._snackRef);
      this._snackRef.dismiss();
    }
    this.changeDetection.detectChanges();
  }

  private closeAll() {
    this.data = [];
    this._snackRef.dismiss();
  }

  ngOnDestroy(): void {
    this.closeAll();
  }
}
