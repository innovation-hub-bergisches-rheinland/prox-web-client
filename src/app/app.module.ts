import { BrowserModule } from '@angular/platform-browser';
import { AngularHalModule } from 'angular4-hal';
import { AppRoutingModule } from '@prox/app-routing.module';
import { AppComponent } from '@prox/app.component';
import { StudyCourseListComponent } from '@prox/components/study-course-list';
import { StudyCourseDetailsComponent } from '@prox/components/study-course-details';
import { HeaderComponent } from '@prox/core/header';
import { HomeComponent } from '@prox/components/home';
import { FooterComponent } from '@prox/core/footer';
import { ProjectListComponent } from '@prox/components/project-list';
import { ProjectDetailsComponent } from '@prox/components/project-details';
import { ProjectEditorComponent } from '@prox/components/project-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@prox/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { UserComponent } from '@prox/components/user';
import { MatConfirmDialogComponent } from '@prox/shared/components/mat-confirm-dialog';
import {
  ContactComponent,
  DataProtectionComponent,
  ImpressumComponent,
  LiabilityNoticeComponent
} from '@prox/components/legal-issues';
import { StudyCourseModuleSelectionComponent } from '@prox/components/study-course-module-selection';
import { ProjectListItemComponent } from '@prox/components/project-list-item';
import { ProjectEditorDialogComponent } from '@prox/components/project-editor-dialog';
import { AuthTimerComponent } from '@prox/components/auth-timer';
import { ProjectEditorSiteComponent } from '@prox/components/project-editor-site';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {
  ExternalConfigurationService,
  KeyCloakUserService
} from '@prox/core/services';
import { keycloakInitializer } from '@prox/core/utils';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { KeycloakBearerInterceptor } from '@prox/core/interceptors';

@NgModule({
  declarations: [
    AppComponent,
    StudyCourseListComponent,
    StudyCourseDetailsComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectEditorComponent,
    UserComponent,
    MatConfirmDialogComponent,
    ContactComponent,
    ImpressumComponent,
    DataProtectionComponent,
    LiabilityNoticeComponent,
    StudyCourseModuleSelectionComponent,
    ProjectListItemComponent,
    ProjectEditorDialogComponent,
    AuthTimerComponent,
    ProjectEditorSiteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularHalModule.forRoot(),
    KeycloakAngularModule,
    MaterialModule,
    AppRoutingModule
  ],
  entryComponents: [ProjectEditorDialogComponent, MatConfirmDialogComponent],
  providers: [
    {
      provide: 'ExternalConfigurationService',
      useClass: ExternalConfigurationService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    },
    KeyCloakUserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
