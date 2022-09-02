import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from './toast/toast.component';
import { Toast } from './toast/types';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {
    window['toastService'] = this;
  }

  showToast(content: Toast, duration = 2000) {
    this.showToasts([content], duration);
  }

  showToasts(content: Toast[], duration = 2000) {
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
