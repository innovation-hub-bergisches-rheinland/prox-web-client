import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProposalComponent } from './pages/proposal/proposal.component';
import { ProposalRoutingModule } from './proposal-routing.module';
import { ProposalEditorComponent } from './components/proposal-editor/proposal-editor.component';
import { ProposalEditorDialogComponent } from './components/proposal-editor-dialog/proposal-editor-dialog.component';
import { ProposalEditorInformationComponent } from './components/proposal-editor/proposal-editor-information/proposal-editor-information.component';
import { ProposalEditorModuleComponent } from './components/proposal-editor/proposal-editor-module/proposal-editor-module.component';
import { ProposalEditorTagComponent } from './components/proposal-editor/proposal-editor-tag/proposal-editor-tag.component';
import { ProposalCardComponent } from './components/proposal-card/proposal-card.component';
import { ProposalDetailsComponent } from './pages/proposal-details/proposal-details.component';
import { ProposalItemComponent } from './components/proposal-item/proposal-item.component';
import { ProposalIconsComponent } from './components/proposal-card/proposal-icons/proposal-icons.component';

@NgModule({
  declarations: [
    ProposalComponent,
    ProposalEditorComponent,
    ProposalEditorDialogComponent,
    ProposalEditorInformationComponent,
    ProposalEditorModuleComponent,
    ProposalEditorTagComponent,
    ProposalCardComponent,
    ProposalDetailsComponent,
    ProposalItemComponent,
    ProposalIconsComponent
  ],
  imports: [SharedModule, ProposalRoutingModule, ScrollingModule]
})
export class ProposalModule {}
