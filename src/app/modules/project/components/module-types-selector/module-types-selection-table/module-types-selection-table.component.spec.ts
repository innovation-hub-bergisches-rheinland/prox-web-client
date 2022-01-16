import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTypesSelectionTableComponent } from './module-types-selection-table.component';

describe('ModuleTypesSeelctionTableComponent', () => {
  let component: ModuleTypesSelectionTableComponent;
  let fixture: ComponentFixture<ModuleTypesSelectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleTypesSelectionTableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTypesSelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
