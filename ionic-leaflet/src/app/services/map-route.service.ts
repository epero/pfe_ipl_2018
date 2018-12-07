import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { GeoJsonObject } from "geojson";
import { EnhancedRoute } from "../shared/models/enhancedRoute";

@Injectable({
  providedIn: "root"
})
export class MapRouteService {
  routeSubject: Subject<EnhancedRoute>;
  route: EnhancedRoute;

  constructor(private httpClient: HttpClient) {
    this.routeSubject = new Subject<EnhancedRoute>();
  }

  sendCoordinatesToServer(startLong, startLat, endLong, endLat) {
    let json = { coordinates: [[startLong, startLat], [endLong, endLat]] };

    this.httpClient
      .post<EnhancedRoute>("http://localhost:8081/api/ors-directions", json)
      .toPromise()
      .then(response => {
        this.setRoute(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  setRoute(route: EnhancedRoute) {
    this.route = route;
    this.emitRoute();
  }

  emitRoute() {
    this.routeSubject.next(this.route);
  }
}
