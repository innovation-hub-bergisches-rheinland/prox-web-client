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
        // loadChildren: () =>
        //   import('@modules/home/home.module').then(m => m.HomeModule)
        loadChildren: () => import('@modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'organizations',
        loadChildren: () => import('@modules/organization/organization.module').then(m => m.OrganizationModule),
        canLoad: [FeatureGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('@modules/user/user.module').then(m => m.UserModule),
        canLoad: [FeatureGuard]
      },
      // Redirect for old URLs
      {
        path: 'lecturers',
        children: [
          {
            path: '',
            redirectTo: '/users',
            pathMatch: 'full'
          },
          {
            path: ':id',
            redirectTo: '/users/:id',
            pathMatch: 'full'
          },
          {
            path: ':id/edit',
            redirectTo: '/users/:id',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'projects',
        // loadChildren: () =>
        //   import('@modules/project/project.module').then(m => m.ProjectModule)
        loadChildren: () => import('@modules/project/project.module').then(m => m.ProjectModule),
        canLoad: [FeatureGuard]
      },
      {
        path: 'contact',
        // loadChildren: () =>
        //   import('@modules/contact/contact.module').then(m => m.ContactModule)
        loadChildren: () => import('@modules/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'faq',
        loadChildren: () => import('@modules/faq/faq.module').then(m => m.FaqModule)
      },
      {
        path: 'imprint',
        // loadChildren: () =>
        //   import('@modules/imprint/imprint.module').then(
        //     m => m.ImprintModule
        //   )
        loadChildren: () => import('@modules/imprint/imprint.module').then(m => m.ImprintModule)
      },
      {
        path: 'privacy',
        // loadChildren: () =>
        //   import('@modules/privacy/privacy.module').then(m => m.PrivacyModule)
        loadChildren: () => import('@modules/privacy/privacy.module').then(m => m.PrivacyModule)
      },
      {
        path: 'disclaimer',
        // loadChildren: () =>
        //   import('@modules/disclaimer/disclaimer.module').then(
        //     m => m.DisclaimerModule
        //   )
        loadChildren: () => import('@modules/disclaimer/disclaimer.module').then(m => m.DisclaimerModule)
      },
      {
        path: '404',
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
