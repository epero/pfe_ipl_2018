import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DirectionModalComponent } from '../direction-modal/direction-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async onFabIteneraireClick() {
    const modal = await this.modalController.create({
      component: DirectionModalComponent
    });
    return await modal.present();
  }
}
