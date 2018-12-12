import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DisplayAlertService {

  constructor(private alertController:AlertController) { }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
