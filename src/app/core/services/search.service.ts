import { Injectable, Injector } from '@angular/core';
import { Project } from '@prox/shared/hal-resources/';
import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';
import { Id } from '@prox/shared/hal-resources/id';

@Injectable({
  providedIn: 'root'
})
export class SearchService extends RestService<Id> {
  constructor(injector: Injector) {
    super(Id, 'search/projects', injector);
  }
}
