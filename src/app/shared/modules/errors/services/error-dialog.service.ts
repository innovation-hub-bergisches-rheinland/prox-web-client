import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorData, ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

export interface ErrorReport {
  error: {
    message: string;
    stack: string;
    name: string;
  };
  timestamp: Date;
  userAgent: string;
}

@Injectable()
export class ErrorDialogService {
  private opened = false;

  constructor(private dialog: MatDialog) {}

  openDialog(message: string, error: Error): void {
    if (!this.opened) {
      this.opened = true;
      const ed: ErrorData = {
        message,
        error,
        report: this.generateErrorReport(error)
      };
      const dialogRef = this.dialog.open(ErrorDialogComponent, {
        data: ed,
        maxHeight: '100%',
        width: '540px',
        maxWidth: '100%',
        disableClose: true,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  generateErrorReport(error: Error): ErrorReport {
    return {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };
  }
}
