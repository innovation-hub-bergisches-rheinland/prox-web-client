import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { ProjectEditorDialogComponent } from './components/project-editor-dialog/project-editor-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexModule } from '@angular/flex-layout';
import { ProjectIconsComponent } from './components/project-card/project-icons/project-icons.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectEditorInformationComponent } from './components/project-editor/project-editor-information/project-editor-information.component';
import { ProjectEditorModuleComponent } from './components/project-editor/project-editor-module/project-editor-module.component';
import { ProjectEditorTagComponent } from './components/project-editor/project-editor-tag/project-editor-tag.component';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectDetailsComponent,
    ProjectEditorComponent,
    ProjectEditorDialogComponent,
    ProjectItemComponent,
    ProjectIconsComponent,
    ProjectCardComponent,
    ProjectEditorInformationComponent,
    ProjectEditorModuleComponent,
    ProjectEditorTagComponent
  ],
  imports: [SharedModule, ProjectRoutingModule, ScrollingModule, FlexModule],
  entryComponents: [ProjectEditorDialogComponent]
})
export class ProjectModule {}
