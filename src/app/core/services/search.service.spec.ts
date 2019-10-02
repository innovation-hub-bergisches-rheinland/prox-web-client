import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import { SearchService } from '@prox/core/services/search.service';

describe('SearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchService = TestBed.get(SearchService);
    expect(service).toBeTruthy();
  });
});
