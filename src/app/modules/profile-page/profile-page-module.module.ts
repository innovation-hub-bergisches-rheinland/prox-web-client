import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageInformationComponent } from './components/common/profile-page-information/profile-page-information.component';
import { ProfilePageBulletinListComponent } from './components/common/profile-page-bulletin-list/profile-page-bulletin-list.component';
import { ProfilePageVitaComponent } from './components/common/profile-page-vita/profile-page-vita.component';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { CompanyProfileComponent } from './pages/company/company-profile/company-profile.component';
import { ProfessorsOverviewComponent } from './pages/professor/professors-overview/professors-overview.component';
import { ProfessorProfileEditor } from './pages/professor/professor-profile-editor/professor-profile-editor.component';
import { ProfessorProfileComponent } from './pages/professor/professor-profile/professor-profile.component';
import { ProfessorPublicationsComponent } from './components/professor/professor-publications/professor-publications.component';
import { ProfilePageAvailableProjects } from './components/common/profile-page-available-projects/profile-page-available-projects.component';
import { ProfilePageProjectsHistoryComponent } from './components/common/profile-page-projects-history/profile-page-projects-history.component';
import { ProfilePageProjectsHistoryItemComponent } from './components/common/profile-page-projects-history/profile-page-projects-history-item/profile-page-projects-history-item.component';
import { SharedModule } from '@shared/shared.module';
import { ProfessorOverviewItemComponent } from './components/professor/professor-overview-item/professor-overview-item.component';
import { CompanyItemComponent } from './components/company/company-overview-item/company-overview-item.component';
import { CompanyOverviewComponent } from './pages/company/companies-overview/companies-overview.component';
import { CompanyProfileEditor } from './pages/company/company-profile-editor/company-profile-editor.component';
import { ProfilePageChipListComponent } from './components/common/profile-page-chip-list/profile-page-chip-list.component';
import { CompanyLanguageInformationComponent } from './components/company/company-language-information/company-language-information';
import { ProfileOverviewCardComponent } from './components/common/profile-overview-card/profile-overview-card.component';
import { ProfilePageJobOfferItemComponent } from '@modules/profile-page/components/common/profile-page-job-offer/profile-page-job-offer-item/profile-page-job-offer-item.component';
import { ProfilePageJobOffersComponent } from './components/common/profile-page-job-offer/profile-page-job-offers/profile-page-job-offers.component';

@NgModule({
  declarations: [
    ProfilePageInformationComponent,
    ProfilePageChipListComponent,
    ProfilePageBulletinListComponent,
    ProfilePageVitaComponent,
    ProfessorsOverviewComponent,
    ProfessorOverviewItemComponent,
    ProfessorProfileComponent,
    ProfessorProfileEditor,
    ProfessorPublicationsComponent,
    ProfilePageAvailableProjects,
    ProfilePageProjectsHistoryComponent,
    ProfilePageProjectsHistoryItemComponent,
    CompanyItemComponent,
    CompanyOverviewComponent,
    CompanyProfileComponent,
    CompanyProfileEditor,
    CompanyLanguageInformationComponent,
    ProfileOverviewCardComponent,
    ProfilePageJobOfferItemComponent,
    ProfilePageJobOffersComponent
  ],
  imports: [CommonModule, SharedModule, ProfilePageRoutingModule]
})
export class ProfilePageModule {}
