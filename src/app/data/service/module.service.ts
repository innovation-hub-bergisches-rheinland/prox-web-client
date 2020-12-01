import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  constructor(injector: Injector) {}
}
