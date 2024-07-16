import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorDialogService } from '@shared/modules/errors/services/error-dialog.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorDialogService: ErrorDialogService, private zone: NgZone) {}

  handleError(error: any) {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }

    const message = error?.message || 'Undefined client error';
    console.error('Global error handler catched an unhandled', error);

    this.zone.run(() => this.errorDialogService.openDialog(message, error));
  }
}
