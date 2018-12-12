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
  depart: Object;
  arriver: Object;
  orsatoggle: boolean;
  orsbtoggle: boolean;

  constructor(private mapRouteService: MapRouteService) {
    this.orsatoggle = false;
    this.orsbtoggle = false;
  }

  onOrsaDivClick() {
    this.orsatoggle = !this.orsatoggle;
  }

  onOrsbDivClick() {
    this.orsbtoggle = !this.orsbtoggle;
  }

  ngOnInit() {
    this.mapRouteService.routeSubject.subscribe(route => {
      if (route === null) {
        this.orsa = null;
        this.orsb = null;
        this.icrs = [];
        this.depart = {};
        this.arriver = {};
        this.orsatoggle = false;
        this.orsbtoggle = false;
        return;
      }
      const features = route['features'];
      this.icrs = [];
      this.orsa = null;
      this.orsb = null;
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        if (feature.id) {
          if (!this.orsa) {
            this.addORSFeaturesToORSObj(feature, false, true);
          } else if (!this.orsb) {
            this.addORSFeaturesToORSObj(feature, true, false);
          }
        } else {
          const obj = {
            distance: feature['properties']['distance'],
            icr: true,
            icrName: feature['properties']['icr'],
            color: feature['properties']['color'],
            duration: feature['properties']['duration'] * 60
          };
          this.icrs.push(obj);
        }
      }
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
    if (first) {
      this.depart = orsSegments[0]['steps'][0];
    }
    for (let i = 0; i < orsSegments.length; i++) {
      const steps = orsSegments[i]['steps'];
      this.arriver = steps[steps.length - 2];
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
