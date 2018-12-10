import { Component, OnInit } from '@angular/core';
import { MapRouteService } from '../services/map-route.service';
import { GeoJsonObject } from 'geojson';

@Component({
  selector: 'app-trajectoire',
  templateUrl: './trajectoire.component.html',
  styleUrls: ['./trajectoire.component.scss']
})
export class TrajectoireComponent implements OnInit {
  trajet: Array<any>;

  constructor(private mapRouteService: MapRouteService) {}

  ngOnInit() {
    this.mapRouteService.routeSubject.subscribe(route => {
      this.trajet = [];
      const features = route['features'];
      const ors1 = features[0];
      this.addORSFeaturesToTrajet(ors1, false);
      let i = 1;
      while (i < features.length - 1) {
        const etape = features[i];
        const instruction = "Suivre l'ICR " + etape['properties']['name'];
        const obj = { instruction, distance: -1 };
        this.trajet.push(obj);
        i++;
      }
      const ors2 = features[i];
      this.addORSFeaturesToTrajet(ors2, true);
    });
  }

  addORSFeaturesToTrajet(ors: any, end: boolean) {
    let fin: number;
    if (end) {
      fin = 0;
    } else {
      fin = 1;
    }
    const orsSegments = ors['properties']['segments'];
    for (let i = 0; i < orsSegments.length; i++) {
      const steps = orsSegments[i]['steps'];
      for (let j = 0; j < steps.length - fin; j++) {
        const step = steps[j];
        this.trajet.push(step);
      }
    }
  }
}
