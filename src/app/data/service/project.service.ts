import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Id } from '@data/schema/id.resource';
import { Project } from '@data/schema/project.resource';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends RestService<Project> {
  constructor(injector: Injector) {
    super(Project, 'projects', injector);
  }

  findByStatus(status: string): Observable<Project[]> {
    const options: any = { params: [{ key: 'status', value: status }] };
    return this.search('findByStatus', options);
  }

  findBySupervisorName(supervisorName: string): Observable<Project[]> {
    const options: any = {
      params: [{ key: 'supervisorName', value: supervisorName }]
    };
    return this.search(
      'findBySupervisorName_SupervisorNameContaining',
      options
    );
  }

  findByIds(projectIds: Id[]): Observable<Project[]> {
    const idParam = projectIds.map(project => project.id).join(',');
    const options = { params: [{ key: 'projectIds', value: idParam }] };
    return this.search('findAllByIds', options);
  }
}
