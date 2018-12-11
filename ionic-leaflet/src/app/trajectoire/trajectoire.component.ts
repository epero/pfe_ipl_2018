import { Component, OnInit } from '@angular/core';
import { MapRouteService } from '../services/map-route.service';
import { GeoJsonObject } from 'geojson';

@Component({
  selector: 'app-trajectoire',
  templateUrl: './trajectoire.component.html',
  styleUrls: ['./trajectoire.component.scss']
})
export class TrajectoireComponent implements OnInit {
  orsa: Array<Object>;
  orsb: Array<Object>;
  icrs: Array<Object>;

  constructor(private mapRouteService: MapRouteService) {}

  ionViewDidEnter() {
    console.log('didenter');
  }

  ngOnInit() {
    this.mapRouteService.routeSubject.subscribe(route => {
      const features = route['features'];
      /*const orsa = features[0];
      this.addORSFeaturesToTrajet(orsa, false);
      let i = 1;
      this.icrs = [];
      while (i < features.length - 1) {
        const etape = features[i];
        const obj = {
          distance: -1,
          icr: true,
          icrName: etape['properties']['icr'],
          color: etape['properties']['color']
        };
        this.icrs.push(obj);
        i++;
      }
      const orsb = features[i];
      this.addORSFeaturesToTrajet(orsb, true);*/
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        if (feature.id) {
          if (!this.orsa) {
            this.addORSFeaturesToORSObj(feature, false, true);
          } else if (!this.orsb) {
            this.addORSFeaturesToORSObj(feature, true, false);
          }
        } else {
          console.log('icr');
        }
      }
      console.log(this.orsa);
      console.log(this.orsb);
    });
  }

  addORSFeaturesToORSObj(ors: any, end: boolean, first: boolean) {
    if (first) {
      this.orsa = [];
    } else {
      this.orsb = [];
    }
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
        let step = steps[j];
        step.icr = false;
        if (first) {
          this.orsa.push(step);
        } else {
          this.orsb.push(step);
        }
      }
    }
  }
}
