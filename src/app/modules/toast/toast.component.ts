import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Toast } from './types';

@Component({
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  data: Toast[] = [];

  constructor(
    public snackbar: MatSnackBar,
    private changeDetection: ChangeDetectorRef,
    private _snackRef: MatSnackBarRef<ToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public snackbarData: { content: Toast[] }
  ) {}

  ngOnInit(): void {
    this.data = this.snackbarData.content;
  }

  close($event: any, index: number) {
    this.data.splice(index, 1);
    if (this.data.length === 0) {
      this._snackRef.dismiss();
    }
    this.changeDetection.detectChanges();
  }

  ngOnDestroy(): void {
    this.closeAll();
  }

  private closeAll() {
    this.data = [];
    this._snackRef.dismiss();
  }
}
