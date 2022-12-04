import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './pages/project/project.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectIconsComponent } from './components/project-card/project-icons/project-icons.component';

@NgModule({
  declarations: [ProjectComponent, ProjectCardComponent, ProjectIconsComponent],
  imports: [SharedModule, ProjectRoutingModule, ScrollingModule]
})
export class ProjectModule {}
