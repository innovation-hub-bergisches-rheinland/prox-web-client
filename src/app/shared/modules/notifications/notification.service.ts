import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
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
    if (isDevMode()) {
      // To test notifications we add the service to the window namespace.
      window['notificationService'] = this;
    }

    this.toasts$.subscribe(toast => this.showToast(toast));
  }

  error(message: string) {
    this.toasts$.next({ message, type: 'error' });
  }

  info(message: string) {
    this.toasts$.next({ message, type: 'info' });
  }

  warning(message: string) {
    this.toasts$.next({ message, type: 'warning' });
  }

  success(message: string) {
    this.toasts$.next({ message, type: 'success' });
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
