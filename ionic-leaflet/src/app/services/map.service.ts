import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class MapService {
  TOKEN: string;

  couleur: string;
  resizeSubject: Subject<any>;
  positionSubject: Subject<Geoposition>;
  position: Geoposition;

  constructor(private geolocation: Geolocation, private platform: Platform) {
    this.TOKEN =
      "pk.eyJ1IjoieGRhcmthIiwiYSI6ImNqcGgxdXBobjByNHUza3BkbGtvMGY2eTUifQ.WuwZ_XI2zNxxObLi6moULg";

    /*const n = new Date().getHours();
    if (n >= 18 || n <= 6) {
      this.couleur = "dark";
    } else {*/
      this.couleur = "light";
    //}

    this.resizeSubject = new Subject<any>();
    this.positionSubject = new Subject<Geoposition>();
    platform.ready().then(() => {
      this.geolocation
        .getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
        .then(pos => {
          this.position = pos;
          this.watch();
        });
    });
  }

  emitResize() {
    this.resizeSubject.next(1);
  }

  watch() {
    this.geolocation.watchPosition().subscribe(pos => {
      this.position = pos;
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
