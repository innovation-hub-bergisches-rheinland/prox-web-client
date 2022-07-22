import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { CoreModule } from '@app/core.module';
import { SharedModule } from '@shared/shared.module';
import { ContentLayoutComponent } from '@layout/content-layout/content-layout.component';
import { FooterComponent } from '@layout/footer/footer.component';
import { UserComponent } from '@layout/user/user.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BASE_PATH } from '@data/service/openapi/variables';
import { environment } from '@env';
import { ToastModule } from '@modules/toast/toast.module';
import { MainContentComponent } from '@layout/main-content/main-content.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ShimmerComponent } from './layout/shimmer/shimmer.component';
import { FeatureDirectiveModule } from '@app/directive/feature-directive.module';

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    FooterComponent,
    UserComponent,
    MainContentComponent,
    NavbarComponent,
    SidebarComponent,
    ShimmerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    ToastModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    {
      provide: BASE_PATH,
      useValue: environment.apiUrl
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
