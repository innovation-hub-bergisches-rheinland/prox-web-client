import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guard/auth.guard';

import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('@modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('@modules/project/project.module').then(m => m.ProjectModule)
      },
      {
        path: 'study-courses',
        loadChildren: () =>
          import('@modules/study-course/study-course.module').then(
            m => m.StudyCourseModule
          )
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('@modules/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'impressum',
        loadChildren: () =>
          import('@modules/impressum/impressum.module').then(
            m => m.ImpressumModule
          )
      },
      {
        path: 'privacy',
        loadChildren: () =>
          import('@modules/privacy/privacy.module').then(m => m.PrivacyModule)
      },
      {
        path: 'disclaimer',
        loadChildren: () =>
          import('@modules/disclaimer/disclaimer.module').then(
            m => m.DisclaimerModule
          )
      },
      {
        path: 'page-not-found',
        loadChildren: () =>
          import('@modules/page-not-found/page-not-found.module').then(
            m => m.PageNotFoundModule
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
