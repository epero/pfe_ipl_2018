import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  TOKEN: string;

  couleur: string;
  resizeSubject: Subject<any>;

  constructor() {
    this.TOKEN =
      'pk.eyJ1IjoieGRhcmthIiwiYSI6ImNqcGgxdXBobjByNHUza3BkbGtvMGY2eTUifQ.WuwZ_XI2zNxxObLi6moULg';

    const n = new Date().getHours();
    if (n >= 18 || n <= 6) {
      this.couleur = 'dark';
    } else {
      this.couleur = 'light';
    }

    this.resizeSubject = new Subject<any>();
  }

  emitResize() {
    this.resizeSubject.next(1);
  }
}
