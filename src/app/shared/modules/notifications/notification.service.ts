import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

export type Toast = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts$: Subject<Toast> = new Subject<Toast>();

  constructor(private toastrService: ToastrService) {
    window['toastService'] = this;

    this.toasts$.subscribe(toast => this.showToast(toast));
  }

  sendToast(content: Toast) {
    this.toasts$.next(content);
  }

  sendToasts(content: Toast[]) {
    for (const toast of content) {
      this.sendToast(toast);
    }
  }

  private showToast(toast: Toast): void {
    switch (toast.type) {
      case 'error':
        this.toastrService.error(toast.message);
        break;
      case 'info':
        this.toastrService.info(toast.message);
        break;
      case 'warning':
        this.toastrService.warning(toast.message);
        break;
      case 'success':
        this.toastrService.success(toast.message);
        break;
    }
  }
}
