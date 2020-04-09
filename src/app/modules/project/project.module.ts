import { NgModule } from '@angular/core';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './pages/project/project.component';
import { SharedModule } from '@shared/shared.module';
import { ProjectItemComponent } from './pages/project-item/project-item.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectEditorComponent } from './pages/project-editor/project-editor.component';
import { ProjectEditorDialogComponent } from './pages/project-editor-dialog/project-editor-dialog.component';
import { StudyCourseModuleSelectionComponent } from './pages/study-course-module-selection/study-course-module-selection.component';
import { ConfirmDialogComponent } from '@modules/project/pages/confirm-dialog/confirm-dialog.component';

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
