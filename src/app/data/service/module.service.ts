import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { Module } from '../schema/module.resource';

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends RestService<Module> {
  constructor(injector: Injector) {
    super(Module, 'modules', injector);
  }
}
