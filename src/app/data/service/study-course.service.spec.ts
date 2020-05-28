import { TestBed } from '@angular/core/testing';

import { StudyCourseService } from './study-course.service';

describe('StudyCourseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudyCourseService = TestBed.get(StudyCourseService);
    expect(service).toBeTruthy();
  });
});
