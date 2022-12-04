import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './pages/project/project.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectIconsComponent } from './components/project-card/project-icons/project-icons.component';
import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { ProjectEditorDialogComponent } from './components/project-editor-dialog/project-editor-dialog.component';
import { ProjectEditorModuleComponent } from './components/project-editor/project-editor-module/project-editor-module.component';
import { ProjectEditorInformationComponent } from './components/project-editor/project-editor-information/project-editor-information.component';
import { ProjectEditorTagComponent } from './components/project-editor/project-editor-tag/project-editor-tag.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectCardComponent,
    ProjectIconsComponent,
    ProjectEditorModuleComponent,
    ProjectEditorInformationComponent,
    ProjectEditorTagComponent,
    ProjectEditorComponent,
    ProjectEditorDialogComponent,
    ProjectDetailsComponent
  ],
  imports: [SharedModule, ProjectRoutingModule, ScrollingModule]
})
export class ProjectModule {}
