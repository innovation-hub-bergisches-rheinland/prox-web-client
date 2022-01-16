import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerOverviewPageComponent } from './lecturer-overview-page.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfessorProfileService } from '@data/service/professor-profile.service';

describe('LecturerOverviewPageComponent', () => {
  let component: LecturerOverviewPageComponent;
  let fixture: ComponentFixture<LecturerOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LecturerOverviewPageComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
