import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './pages/project/project.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [ProjectComponent],
  imports: [SharedModule, ProjectRoutingModule, ScrollingModule]
})
export class ProjectModule {}
