import { TestBed } from '@angular/core/testing';

import { ProjectModuleService } from './project-module.service';

describe('ProjectModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectModuleService = TestBed.get(ProjectModuleService);
    expect(service).toBeTruthy();
  });
});
