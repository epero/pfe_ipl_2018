import { Component, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  constructor(
    private mapService: MapService,
    private drawerService: DrawerService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.mapService.emitResize();
    this.drawerService.toolbarHeight = document.getElementById(
      'appheader'
    ).clientHeight;
  }
}
