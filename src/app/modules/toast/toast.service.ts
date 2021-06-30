import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from './toast.component';
import { Toast } from './types';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {
    window['toastService'] = this;
  }

  showToasts(content: Toast[], duration: number = 2000) {
    this.snackBar.openFromComponent(ToastComponent, {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: {
        content
      }
    });
  }
}
