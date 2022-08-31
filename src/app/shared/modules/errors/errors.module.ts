import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { ErrorDialogService } from './services/error-dialog.service';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [CommonModule, MaterialModule],
  providers: [ErrorDialogService]
})
export class ErrorsModule {}
