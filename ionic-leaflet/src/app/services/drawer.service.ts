import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  toolbarHeight: number;

  constructor() {
    this.toolbarHeight = 0;
  }
}
