import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GeoJsonObject } from 'geojson';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MapRouteService {
  routeSubject: Subject<GeoJsonObject>;
  route: GeoJsonObject;

  constructor(private httpClient: HttpClient,private alertController:AlertController) {
    this.routeSubject = new Subject<GeoJsonObject>();
  }

  sendCoordinatesToServer(startLong, startLat, endLong, endLat) {
    let json = { coordinates: [[startLong, startLat], [endLong, endLat]] };

    return this.httpClient
      .post<GeoJsonObject>(
        'http://test-dockerfull-env-2.xgpz6fryfk.eu-west-1.elasticbeanstalk.com/api/ors-directions',
        //"http://localhost:8081/api/ors-directions",
        json
      )
      .toPromise()
      .then(response => {
        this.setRoute(response);
      })
      .catch(error => {
        console.log(error);
        switch(error.status){
          case 404:
          this.presentAlert("Itinéraire non trouvé", "L'itinéraire introduit n'existe pas ou est en dehors des limites de la zone de recherche.");
          break;
          default:
          this.presentAlert("Service indisponible !", "Le service est temporairement indisponible, réessayez plus tard.");

        }
        return error;
      });
  }

  async presentAlert(title,message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  setRoute(route: GeoJsonObject) {
    this.route = route;
    this.emitRoute();
  }

  emitRoute() {
    this.routeSubject.next(this.route);
  }
}
