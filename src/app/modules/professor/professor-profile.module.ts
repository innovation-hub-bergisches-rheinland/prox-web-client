import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ProfessorProfileRoutingModule } from './professor-profile-routing.module';
import { ProfessorInformationComponent } from './components/professor-information/professor-information.component';
import { ProfessorProfileComponent } from './pages/professor-profile/professor-profile.component';
import { ProfessorVitaComponent } from './components/professor-vita/professor-vita.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfessorResearchComponent } from './components/professor-research/professor-research.component';
import { ProfessorPublicationsComponent } from './components/professor-publications/professor-publications.component';
import { ProfessorProjectsHistoryComponent } from './components/professor-projects-history/professor-projects-history.component';
import { ProfessorProjectsHistoryItemComponent } from './components/professor-projects-history/professor-projects-history-item/professor-projects-history-item.component';
import { ProfessorRunningProjectsComponent } from './components/professor-running-projects/professor-running-projects.component';
import { ProfessorProfileEditor } from './pages/professor-profile-editor/professor-profile-editor.component';

@NgModule({
  declarations: [
    ProfessorInformationComponent,
    ProfessorProfileComponent,
    ProfessorProfileEditor,
    ProfessorVitaComponent,
    ProfessorResearchComponent,
    ProfessorPublicationsComponent,
    ProfessorProjectsHistoryComponent,
    ProfessorProjectsHistoryItemComponent,
    ProfessorRunningProjectsComponent
  ],
  imports: [SharedModule, ProfessorProfileRoutingModule, FlexLayoutModule],
  entryComponents: []
})
export class ProfessorProfileModule {}
