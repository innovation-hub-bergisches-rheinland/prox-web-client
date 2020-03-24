import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { Id } from '../schema/id.resource';

@Injectable({
  providedIn: 'root'
})
export class SearchService extends RestService<Id> {
  constructor(injector: Injector) {
    super(Id, 'search/projects', injector);
  }
}
