import { Injectable, Injector } from '@angular/core';

import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

import { Module } from '@data/schema/module.resource';
import { CrudRestService } from './base/crud-rest-service';
import { HalRestService } from './base/hal-crud-rest-service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends HalRestService<Module> {
  constructor(injector: Injector) {
    super(Module, 'modules', injector);
  }
}
