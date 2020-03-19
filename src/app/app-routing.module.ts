import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@prox/components/home';
import { StudyCourseListComponent } from '@prox/components/study-course-list';
import { StudyCourseDetailsComponent } from '@prox/components/study-course-details';
import { ProjectListComponent } from '@prox/components/project-list';
import { ProjectDetailsComponent } from '@prox/components/project-details';
import { AuthGuard } from '@prox/core/guards/auth.guard';
import {
  ContactComponent,
  ImpressumComponent,
  DataProtectionComponent,
  LiabilityNoticeComponent
} from '@prox/components/legal-issues';
import { ProjectEditorComponent } from '@prox/components/project-editor';
import { ProjectEditorSiteComponent } from '@prox/components/project-editor-site';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'projects',
    component: ProjectListComponent
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent
  },
  {
    path: 'projecteditor',
    component: ProjectEditorComponent
  },
  {
    path: 'projecteditorsite',
    component: ProjectEditorSiteComponent
  },
  {
    path: 'study-courses',
    component: StudyCourseListComponent
  },
  {
    path: 'study-courses/:id',
    component: StudyCourseDetailsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'data-protection',
    component: DataProtectionComponent
  },
  {
    path: 'liability-notice',
    component: LiabilityNoticeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
