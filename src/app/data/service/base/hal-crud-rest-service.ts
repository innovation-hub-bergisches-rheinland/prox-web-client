import { CrudRestService } from './crud-rest-service';
import { Injectable, Injector } from '@angular/core';

import {
  HalOptions,
  Resource,
  RestService,
  SubTypeBuilder
} from 'angular4-hal';
import { Observable } from 'rxjs';

import { Project } from '@data/schema/project.resource';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';

export abstract class HalCrudRestService<T extends Resource>
  implements CrudRestService<T> {
  halRestService: RestService<T>;
  constructor(type: new () => T, resource: string, injector: Injector) {
    this.halRestService = new RestService<T>(type, resource, injector);
  }
  getAll(options?: HalOptions): Observable<T[]> {
    return this.halRestService.getAll(options);
  }
  create(element: T): Observable<T | any> {
    return this.halRestService.create(element);
  }
  update(element: T): Observable<T | any> {
    return this.halRestService.update(element);
  }
  delete(element: T): Observable<T | any> {
    return this.halRestService.delete(element);
  }
  get(id: string): Observable<T> {
    return this.halRestService.get(id);
  }
  search(
    query: string,
    options?: HalOptions,
    subtype?: SubTypeBuilder
  ): Observable<T[]> {
    return this.halRestService.search(query, options, subtype);
  }
}
