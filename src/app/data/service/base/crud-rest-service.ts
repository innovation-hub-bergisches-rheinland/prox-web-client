import { Observable } from 'rxjs';

/**
 * Interface used for CRUD Operations on REST-Service
 */
export interface CrudRestService<T> {
  getAll(): Observable<T[]>;
  get(id: any): Observable<T>;
  create(element: T): Observable<T | any>;
  update(element: T): Observable<T | any>;
  delete(element: T): Observable<T | any>;
}
