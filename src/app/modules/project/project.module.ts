import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './pages/project/project.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { ProjectEditorDialogComponent } from './components/project-editor-dialog/project-editor-dialog.component';
import { ProjectEditorModuleComponent } from './components/project-editor/project-editor-module/project-editor-module.component';
import { ProjectEditorInformationComponent } from './components/project-editor/project-editor-information/project-editor-information.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectCardHeaderComponent } from './components/project-card/project-card-header/project-card-header.component';
import { ProjectSearchPanelComponent } from './components/project-search-panel/project-search-panel.component';
import { ProjectCardStatusActionsComponent } from './components/project-card/project-card-status-actions/project-card-status-actions.component';
import { ProjectEditorMiscComponent } from './components/project-editor/project-editor-misc/project-editor-misc.component';
import { ProjectCardIconAttributeComponent } from './components/project-card/project-card-icon-attribute/project-card-icon-attribute.component';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectCardComponent,
    ProjectCardHeaderComponent,
    ProjectCardStatusActionsComponent,
    ProjectSearchPanelComponent,
    ProjectEditorModuleComponent,
    ProjectEditorInformationComponent,
    ProjectEditorMiscComponent,
    ProjectEditorComponent,
    ProjectEditorDialogComponent,
    ProjectDetailsComponent,
    ProjectCardIconAttributeComponent
  ],
  imports: [SharedModule, ProjectRoutingModule, ScrollingModule]
})
export class ProjectModule {}
