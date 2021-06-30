import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '@shared/shared.module';
import { ToastComponent } from './toast.component';

@NgModule({
  declarations: [ToastComponent],
  imports: [SharedModule, BrowserModule, FlexLayoutModule]
})
export class ToastModule {}
