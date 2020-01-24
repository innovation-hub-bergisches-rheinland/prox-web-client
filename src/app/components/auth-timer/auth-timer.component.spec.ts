import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTimerComponent } from './auth-timer.component';

describe('AuthTimerComponent', () => {
  let component: AuthTimerComponent;
  let fixture: ComponentFixture<AuthTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthTimerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
