import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Project } from '@data/schema/project.resource';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { CrudRestService } from './base/crud-rest-service';
import { HalRestService } from './base/hal-crud-rest-service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends HalRestService<Project> {
  constructor(injector: Injector) {
    super(Project, 'projects', injector);
  }
}
