import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ErrorDialogService, ErrorReport } from '../../services/error-dialog.service';

export interface ErrorData {
  message: string;
  error: Error;
  report: ErrorReport;
}

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  reportUrl: SafeUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ErrorData,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const report = this.data.report;
    if (report) {
      const blob = new Blob([JSON.stringify(report)], { type: 'text/plain' });
      const file = new File([blob], 'error-report.json', { type: 'text/plain' });
      this.reportUrl = this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    }
  }
}
