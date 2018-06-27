import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share';

@Injectable()
export class SpinnerService {
  status: Subject<Object> = new Subject();
  _type: number = 0; // default spinner
  _active: boolean = false;

  public set_active(v: boolean, t: number) {
    this._active = v;
    this._type = t;
    this.status.next({status: v, type: t});
  }

  public start(type: number = 0): void {
    this.set_active(true, type);
  }

  public stop(): void {
    this.set_active(false, 0);
  }
}
