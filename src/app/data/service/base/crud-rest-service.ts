import { Observable } from 'rxjs';

export interface CrudRestService<T> {
  getAll(): Observable<T[]>;
  get(id: any): Observable<T>;
  create(element: T): Observable<T | any>;
  update(element: T): Observable<T | any>;
  delete(element: T): Observable<T | any>;
}
