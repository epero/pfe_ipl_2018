import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { GeoJsonObject } from "geojson";

@Injectable({
  providedIn: "root"
})
export class MapRouteService {
  routeSubject: Subject<GeoJsonObject>;
  route: GeoJsonObject;

  constructor(private httpClient: HttpClient) {
    this.routeSubject = new Subject<GeoJsonObject>();
  }

  sendCoordinatesToServer(startLong, startLat, endLong, endLat) {
    let json = { coordinates: [[startLong, startLat], [endLong, endLat]] };

    this.httpClient
      .post<GeoJsonObject>(
        //'http://test-dockerfull-env-2.xgpz6fryfk.eu-west-1.elasticbeanstalk.com/api/ors-directions',
        "http://localhost:8081/api/ors-directions",
        json
      )
      .toPromise()
      .then(response => {
        this.setRoute(response);
      })
      .catch(error => {
        console.log(error);
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
