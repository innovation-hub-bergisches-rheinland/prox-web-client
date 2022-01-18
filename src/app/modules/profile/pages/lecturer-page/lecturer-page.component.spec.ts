import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerPageComponent } from './lecturer-page.component';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule } from 'keycloak-angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { JobService } from '@data/service/job.service';
import { ProjectService } from '@data/service/project.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';

describe('LecturerPageComponent', () => {
  let component: LecturerPageComponent;
  let fixture: ComponentFixture<LecturerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LecturerPageComponent],
      imports: [
        KeycloakAngularModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
