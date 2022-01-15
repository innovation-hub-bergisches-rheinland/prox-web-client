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
import { ModuleTypesSelectorComponent } from '@modules/project/components/module-types-selector/module-types-selector.component';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectDetailsComponent,
    ProjectEditorComponent,
    ProjectEditorDialogComponent,
    ProjectItemComponent,
    ModuleTypesSelectorComponent
  ],
  imports: [SharedModule, ProjectRoutingModule, ScrollingModule, FlexModule],
  entryComponents: [ProjectEditorDialogComponent]
})
export class ProjectModule {}
