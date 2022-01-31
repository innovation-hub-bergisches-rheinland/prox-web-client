import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEditorPageComponent } from './organization-editor-page.component';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule } from 'keycloak-angular';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OrganizationEditorPageComponent', () => {
  let component: OrganizationEditorPageComponent;
  let fixture: ComponentFixture<OrganizationEditorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationEditorPageComponent],
      imports: [KeycloakAngularModule, RouterTestingModule, HttpClientTestingModule, SharedModule, BrowserAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEditorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
