import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { ProjectEditorDialogComponent } from './components/project-editor-dialog/project-editor-dialog.component';
import { StudyCourseModuleSelectionComponent } from './components/study-course-module-selection/study-course-module-selection.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectDetailsComponent,
    ProjectEditorComponent,
    ProjectEditorDialogComponent,
    ProjectItemComponent,
    StudyCourseModuleSelectionComponent,
    ConfirmDialogComponent
  ],
  imports: [SharedModule, ProjectRoutingModule],
  entryComponents: [ProjectEditorDialogComponent, ConfirmDialogComponent]
})
export class ProjectModule {}
