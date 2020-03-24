import { NgModule } from '@angular/core';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './page/project/project.component';
import { SharedModule } from '@shared/shared.module';
import { ProjectItemComponent } from './page/project-item/project-item.component';
import { ProjectDetailsComponent } from './page/project-details/project-details.component';
import { ProjectEditorComponent } from './page/project-editor/project-editor.component';
import { ProjectEditorDialogComponent } from './page/project-editor-dialog/project-editor-dialog.component';
import { StudyCourseModuleSelectionComponent } from './page/study-course-module-selection/study-course-module-selection.component';
import { MatConfirmDialogComponent } from '@modules/project/page/mat-confirm-dialog/mat-confirm-dialog.component';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectDetailsComponent,
    ProjectEditorComponent,
    ProjectEditorDialogComponent,
    ProjectItemComponent,
    StudyCourseModuleSelectionComponent,
    MatConfirmDialogComponent
  ],
  imports: [SharedModule, ProjectRoutingModule],
  entryComponents: [ProjectEditorDialogComponent, MatConfirmDialogComponent]
})
export class ProjectModule {}
