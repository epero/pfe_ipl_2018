import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  private geojson: GeoJsonObject;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const map = L.map('leafletMap').setView([50.8003396, 4.3517103], 12);

    //Debug for tiles were not shown
    map._onResize();

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Leaflet Map'
      //maxZoom: 18
    }).addTo(map);

    map.locate({ setView: true /*maxZoom: 16*/ });

    this.http
      .get<GeoJsonObject>('assets/latlong_icr.json')
      .toPromise()
      .then((json: any) => {
        console.log(json);
        this.geojson = json;

        var myStyle = {
          color: '#ff7800',
          weight: 5,
          opacity: 0.65
        };

        L.geoJSON(this.geojson, {
          style: myStyle
        }).addTo(map);
      });

    function onLocationFound(e) {
      var radius = e.accuracy / 2;

      L.marker(e.latlng)
        .addTo(map)
        .bindPopup('You are within ' + radius + ' meters from this point')
        .openPopup();

      L.circle(e.latlng, radius).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
      console.log('Unable to retrieve localisation');
    }

    map.on('locationerror', onLocationError);
  }
}
