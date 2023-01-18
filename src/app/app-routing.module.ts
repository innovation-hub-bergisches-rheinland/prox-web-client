import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContentLayoutComponent } from '@layout/content-layout/content-layout.component';
import { FeatureGuard } from './core/guard/feature.guard';

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
        title: 'PROX - Home',
        // loadChildren: () =>
        //   import('@modules/home/home.module').then(m => m.HomeModule)
        loadChildren: () => import('@modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: '',
        title: 'PROX',
        loadChildren: () => import('@modules/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'organizations',
        title: 'PROX - Unternehmen und Organisationen',
        loadChildren: () => import('@modules/organization/organization.module').then(m => m.OrganizationModule),
        canLoad: [FeatureGuard]
      },
      // Users is not good URL design for lecturers profiles, but it had existed before. We can't get rid of URLs that are already in use.
      // Therefore, we redirect to the new URL.
      {
        path: 'users',
        children: [
          {
            path: '',
            redirectTo: '/lecturers',
            pathMatch: 'full'
          },
          {
            path: ':id',
            redirectTo: '/lecturers/:id',
            pathMatch: 'full'
          },
          {
            path: ':id/edit',
            redirectTo: '/lecturers/:id',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'lecturers',
        title: 'PROX - Lehrende',
        loadChildren: () => import('@modules/lecturer/lecturer.module').then(m => m.LecturerModule),
        canLoad: [FeatureGuard]
      },
      {
        path: 'proposals',
        children: [
          {
            path: '',
            redirectTo: '/projects?s=PROPOSED',
            pathMatch: 'full'
          },
          {
            path: ':id',
            redirectTo: '/projects/:id',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'projects',
        title: 'PROX - Projekte',
        // loadChildren: () =>
        //   import('@modules/project/project.module').then(m => m.ProjectModule)
        loadChildren: () => import('@modules/project/project.module').then(m => m.ProjectModule),
        canLoad: [FeatureGuard]
      },
      {
        path: 'contact',
        title: 'PROX - Kontakt',
        // loadChildren: () =>
        //   import('@modules/contact/contact.module').then(m => m.ContactModule)
        loadChildren: () => import('@modules/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'faq',
        title: 'PROX - FAQ',
        loadChildren: () => import('@modules/faq/faq.module').then(m => m.FaqModule)
      },
      {
        path: 'imprint',
        title: 'PROX - Impressum',
        // loadChildren: () =>
        //   import('@modules/imprint/imprint.module').then(
        //     m => m.ImprintModule
        //   )
        loadChildren: () => import('@modules/imprint/imprint.module').then(m => m.ImprintModule)
      },
      {
        path: 'privacy',
        title: 'PROX - Datenschutz',
        // loadChildren: () =>
        //   import('@modules/privacy/privacy.module').then(m => m.PrivacyModule)
        loadChildren: () => import('@modules/privacy/privacy.module').then(m => m.PrivacyModule)
      },
      {
        path: 'disclaimer',
        title: 'PROX - Disclaimer',
        // loadChildren: () =>
        //   import('@modules/disclaimer/disclaimer.module').then(
        //     m => m.DisclaimerModule
        //   )
        loadChildren: () => import('@modules/disclaimer/disclaimer.module').then(m => m.DisclaimerModule)
      },
      {
        path: '404',
        title: 'PROX - 404',
        // loadChildren: () =>
        //   import('@modules/page-not-found/page-not-found.module').then(
        //     m => m.PageNotFoundModule
        //   )
        loadChildren: () => import('@modules/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
      },
      {
        path: '**',
        redirectTo: '/404'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: [FeatureGuard]
})
export class AppRoutingModule {}
