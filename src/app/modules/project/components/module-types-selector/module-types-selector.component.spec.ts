import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTypesSelectorComponent } from './module-types-selector.component';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule } from 'keycloak-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@shared/shared.module';

describe('ModuleTypesSelectorComponent', () => {
  let component: ModuleTypesSelectorComponent;
  let fixture: ComponentFixture<ModuleTypesSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleTypesSelectorComponent],
      imports: [KeycloakAngularModule, HttpClientTestingModule, SharedModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTypesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
