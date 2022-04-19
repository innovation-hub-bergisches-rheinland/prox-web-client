import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShimmerService {
  private readonly _state$: Subject<boolean>;
  private _lastState: boolean;

  constructor() {
    this._state$ = new Subject<boolean>();
    this._lastState = false;
    this._state$.next(false);
  }

  get state$(): Observable<boolean> {
    return this._state$.asObservable();
  }

  public pushState(v: boolean) {
    if (this._lastState !== v) {
      this._state$.next(v);
      this._lastState = v;
    }
  }
}
