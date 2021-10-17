import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentPageComponent } from './components/content-page/content-page.component';

@NgModule({
  declarations: [ContentPageComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [ContentPageComponent]
})
export class ContentPageModule {}
