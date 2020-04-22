import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Project } from '@data/schema/project.resource';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends RestService<Project> {
  constructor(injector: Injector) {
    super(Project, 'projects', injector);
  }
}
