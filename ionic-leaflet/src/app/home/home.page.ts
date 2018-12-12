import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  constructor(
    private modalController: ModalController,
    private mapService: MapService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.mapService.emitResize();
  }
}
