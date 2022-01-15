import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTypesSelectorComponent } from './module-types-selector.component';

describe('ModuleTypesSelectorComponent', () => {
  let component: ModuleTypesSelectorComponent;
  let fixture: ComponentFixture<ModuleTypesSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleTypesSelectorComponent]
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
