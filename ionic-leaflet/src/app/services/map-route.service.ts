import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { GeoJsonObject } from "geojson";
import { AlertController } from "@ionic/angular";
import { DisplayAlertService } from "./display-alert.service";

@Injectable({
  providedIn: "root"
})
export class MapRouteService {
  routeSubject: Subject<GeoJsonObject>;
  route: GeoJsonObject;

  constructor(
    private httpClient: HttpClient,
    private alertController: AlertController,
    private displayAlertService:DisplayAlertService
  ) {
    this.routeSubject = new Subject<GeoJsonObject>();
  }

  sendCoordinatesToServer(startLong, startLat, endLong, endLat) {
    let json = { coordinates: [[startLong, startLat], [endLong, endLat]] };

    return this.httpClient
      .post<GeoJsonObject>(
        "http://test-dockerfull-env-2.xgpz6fryfk.eu-west-1.elasticbeanstalk.com/api/directions",
        //"http://localhost:8081/api/directions",
        json
      )
      .toPromise()
      .then(response => {
        this.setRoute(response);
      })
      .catch(error => {
        //console.log(error);
        switch (error.status) {
          case 412:
            this.displayAlertService.presentAlert(
              "Itinéraire non trouvé",
              "L'itinéraire introduit n'existe pas ou est en dehors des limites de la zone de recherche."
            );
            break;
            case 404:
              this.displayAlertService.presentAlert("Erreur 404","");
            break;
          default:
            this.displayAlertService.presentAlert(
              "Service indisponible !",
              "Le service est temporairement indisponible, réessayez plus tard."
            );
        }
        return error;
      });
  }


  setRoute(route: GeoJsonObject) {
    this.route = route;
    this.emitRoute();
  }

  emitRoute() {
    this.routeSubject.next(this.route);
  }
}
