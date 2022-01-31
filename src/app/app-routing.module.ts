import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AuthGuard } from '@app/guard/auth.guard';

import { ContentLayoutComponent } from '@layout/content-layout/content-layout.component';
import { FeatureGuard } from './feature.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    loadChildren: () => import('@modules/profile/profile.module').then(m => m.ProfileModule)
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
        path: 'user',
        loadChildren: () => import('@modules/user/user.module').then(m => m.UserModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'user'
        }
      },
      {
        path: 'organizations',
        loadChildren: () => import('@modules/organization/organization.module').then(m => m.OrganizationModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'organizations'
        }
      },
      {
        path: 'jobs',
        loadChildren: () => import('@modules/jobs/jobs.module').then(j => j.JobModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'jobs'
        }
      },
      {
        path: 'projects',
        // loadChildren: () =>
        //   import('@modules/project/project.module').then(m => m.ProjectModule)
        loadChildren: () => import('@modules/project/project.module').then(m => m.ProjectModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'projects'
        }
      },
      {
        path: 'contact',
        // loadChildren: () =>
        //   import('@modules/contact/contact.module').then(m => m.ContactModule)
        loadChildren: () => import('@modules/contact/contact.module').then(m => m.ContactModule)
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [FeatureGuard]
})
export class AppRoutingModule {}
