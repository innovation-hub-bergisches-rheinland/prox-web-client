import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast/toast.component';
import { NotificationService } from './notification.service';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [ToastComponent],
  imports: [CommonModule, MaterialModule],
  providers: [NotificationService]
})
export class NotificationsModule {}
