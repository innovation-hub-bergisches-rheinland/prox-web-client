import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorDialogService } from '@shared/modules/errors/services/error-dialog.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorDialogService: ErrorDialogService, private zone: NgZone) {}

  handleError(error: any) {
    const message = error?.message || 'Undefined client error';

    this.zone.run(() => this.errorDialogService.openDialog(message, error));
  }
}
