import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule],
  providers: [NotificationService]
})
export class NotificationsModule {}
