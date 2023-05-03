import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Observable, tap } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const CanDeactivateState = {
  defendAgainstBrowserBackButton: false
};

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(readonly matDialog: MatDialog) {}

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return (
      component.canDeactivate() ||
      this.matDialog
        .open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(ConfirmationDialogComponent, {
          disableClose: true,
          data: {
            title: 'Ungespeicherte Änderungen',
            message: 'Sie haben ungespeicherte Änderungen, wirklich verlassen?'
          }
        })
        .afterClosed()
        .pipe(
          tap(confirmed => {
            if (!confirmed && CanDeactivateState.defendAgainstBrowserBackButton) {
              history.pushState(null, '', '');
            }
          })
        )
    );
  }
}
