import { Injectable, Injector } from '@angular/core';
import { Tag } from '@prox/shared/hal-resources';
import { RestService } from 'angular4-hal';

@Injectable({
  providedIn: 'root'
})
export class TagService extends RestService<Tag> {
  constructor(injector: Injector) {
    super(Tag, 'tags', injector);
  }
}
