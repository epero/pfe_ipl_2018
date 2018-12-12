import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";

@Injectable({
  providedIn: "root"
})
export class MapService {
  TOKEN: string;

  couleur: string;
  resizeSubject: Subject<any>;
  positionSubject: Subject<Geoposition>;
  position: Geoposition;

  constructor(private geoloc: Geolocation) {
    this.TOKEN =
      "pk.eyJ1IjoieGRhcmthIiwiYSI6ImNqcGgxdXBobjByNHUza3BkbGtvMGY2eTUifQ.WuwZ_XI2zNxxObLi6moULg";

    const n = new Date().getHours();
    if (n >= 18 || n <= 6) {
      this.couleur = "dark";
    } else {
      this.couleur = "light";
    }

    this.resizeSubject = new Subject<any>();
    this.positionSubject = new Subject<Geoposition>();
    this.geoloc
      .getCurrentPosition({ enableHighAccuracy: true })
      .then(position => {
        this.position = position;
        this.watchLocation();
      })
      .catch(err => console.log("Localisation inactive"));
  }

  emitResize() {
    this.resizeSubject.next(1);
  }

  watchLocation() {
    this.geoloc.watchPosition().subscribe(position => {
      this.position = position;
      this.emitPosition();
    });
  }

  emitPosition() {
    this.positionSubject.next(this.position);
  }

  getPosition() {
    return this.position;
  }

  hasPosition() {
    return this.position !== undefined;
  }
}
