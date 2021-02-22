import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AuthGuard } from '@app/guard/auth.guard';

import { ContentLayoutComponent } from '@layout/content-layout/content-layout.component';

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
        // loadChildren: () =>
        //   import('@modules/home/home.module').then(m => m.HomeModule)
        loadChildren: () =>
          import('@modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'projects',
        // loadChildren: () =>
        //   import('@modules/project/project.module').then(m => m.ProjectModule)
        loadChildren: () =>
          import('@modules/project/project.module').then(m => m.ProjectModule)
      },
      {
        path: 'study-courses',
        // loadChildren: () =>
        //   import('@modules/study-course/study-course.module').then(
        //     m => m.StudyCourseModule
        //   )
        loadChildren: () =>
          import('@modules/study-course/study-course.module').then(
            m => m.StudyCourseModule
          )
      },
      {
        path: 'contact',
        // loadChildren: () =>
        //   import('@modules/contact/contact.module').then(m => m.ContactModule)
        loadChildren: () =>
          import('@modules/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'imprint',
        // loadChildren: () =>
        //   import('@modules/imprint/imprint.module').then(
        //     m => m.ImprintModule
        //   )
        loadChildren: () =>
          import('@modules/imprint/imprint.module').then(m => m.ImprintModule)
      },
      {
        path: 'privacy',
        // loadChildren: () =>
        //   import('@modules/privacy/privacy.module').then(m => m.PrivacyModule)
        loadChildren: () =>
          import('@modules/privacy/privacy.module').then(m => m.PrivacyModule)
      },
      {
        path: 'disclaimer',
        // loadChildren: () =>
        //   import('@modules/disclaimer/disclaimer.module').then(
        //     m => m.DisclaimerModule
        //   )
        loadChildren: () =>
          import('@modules/disclaimer/disclaimer.module').then(
            m => m.DisclaimerModule
          )
      },
      {
        path: 'lecturers',
        // loadChildren: () =>
        //   import('@modules/disclaimer/disclaimer.module').then(
        //     m => m.DisclaimerModule
        //   )
        loadChildren: () =>
          import('@modules/professor/professor-profile.module').then(
            m => m.ProfessorProfileModule
          )
      },
      {
        path: '404',
        // loadChildren: () =>
        //   import('@modules/page-not-found/page-not-found.module').then(
        //     m => m.PageNotFoundModule
        //   )
        loadChildren: () =>
          import('@modules/page-not-found/page-not-found.module').then(
            m => m.PageNotFoundModule
          )
      },
      {
        path: '**',
        redirectTo: '/404'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
