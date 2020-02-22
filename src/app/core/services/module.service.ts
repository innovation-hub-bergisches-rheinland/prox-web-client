import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { Module } from '@prox/shared/hal-resources';

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends RestService<Module> {
  constructor(injector: Injector) {
    super(Module, 'modules', injector);
  }
}
