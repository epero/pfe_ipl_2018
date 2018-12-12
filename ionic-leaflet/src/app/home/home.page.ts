import { Component, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  interval: number;

  constructor(
    private mapService: MapService,
    private drawerService: DrawerService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    setTimeout(() => this.mapService.emitResize(), 500);
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.drawerService.toolbarHeight = document.getElementById(
        'appheader'
      ).clientHeight;
    }, 500);
  }
}
