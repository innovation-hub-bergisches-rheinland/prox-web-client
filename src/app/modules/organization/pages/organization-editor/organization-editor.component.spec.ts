import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEditorComponent } from './organization-editor.component';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule } from 'keycloak-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@shared/shared.module';
import { ProjectService } from '@data/service/project.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OrganizationEditorComponent', () => {
  let component: OrganizationEditorComponent;
  let fixture: ComponentFixture<OrganizationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationEditorComponent],
      imports: [KeycloakAngularModule, HttpClientTestingModule, SharedModule, RouterTestingModule, BrowserAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
