import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {
  private geojson: GeoJsonObject;
  map: L.Map;
  lat: number;
  lng: number;
  error: string;
  faCoffee: IconDefinition;
  marker: L.Marker;
  initialLoad: boolean;
  autocentre: boolean;
  autoCenterBtnStyle: string;
  autozoom: boolean;
  autoZoomBtnStyle: string;

  constructor(
    private http: HttpClient,
    private geoloc: Geolocation,
    private plateform: Platform
  ) {
    this.faCoffee = faCoffee;
    this.initialLoad = true;
    this.autocentre = true;
    this.autoCenterBtnStyle = 'solid';
    this.autozoom = true;
    this.autoZoomBtnStyle = 'solid';
  }

  ngOnInit() {
    //Geoloc Ionic  Natif
    this.map = L.map('leafletMap').setView([50.8003396, 4.3517103], 12);

    this.plateform.ready().then(() => {
      this.geoloc
        .getCurrentPosition()
        .then(resp => {
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
          this.watchLocation();
        })
        .catch(error => {
          console.log('La localisation est cassé');
        });
    });

    //Debug for tiles were not shown
    this.map['_onResize']();

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Leaflet Map'
    }).addTo(this.map);

    //map.locate({ setView: true, maxZoom: 16 });

    //Display Brussel's ICR routes
    this.http
      .get<GeoJsonObject>('assets/latlong_icr.json')
      .subscribe((json: any) => {
        //console.log(json);
        this.geojson = json;

        /*var myStyle = {
                "color": "#ff7800",
                "weight": 5,
                "opacity": 0.65
            };*/

        //Colorization of ICR routes
        L.geoJSON(this.geojson, {
          style: function(feature) {
            //console.log(feature.properties.icr);
            switch (feature.properties.icr) {
              case '1':
                return { color: '#00cc00' };
              case '2':
                return { color: '#99b3ff' };
              case '3':
                return { color: '#FF3232' };
              case '4':
                return { color: '#9932FF' };
              case '5':
                return { color: '#00510A' };
              case '6':
                return { color: '#00510A' };
              case '7':
                return { color: '#D12200' };
              case '8':
                return { color: '#00cc00' };
              case '9':
                return { color: '#9932FF' };
              case '10':
                return { color: '#FF3232' };
              case '11':
                return { color: '#187c00' };
              case '12':
                return { color: '#00510A' };
              case 'A':
                return { color: '#FF8205' };
              case 'B':
                return { color: '#FF8205' };
              case 'C':
                return { color: '#FF8205' };
              case 'CK':
                return { color: '#05AFFF' };
              case 'SZ':
                return { color: '#05AFFF' };
              case 'MM':
                return { color: '#00256B' };
              case 'PP':
                return { color: '#D12200' };
            }
          }
        }).addTo(this.map);
      });

    //Geolocalisation
    /*function onLocationFound(e) {
      var radius = e.accuracy / 2;

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
    }*/
  }

  watchLocation() {
    let watch = this.geoloc.watchPosition();
    watch.subscribe(data => {
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
      const latlng = L.latLng(this.lat, this.lng);
      this.map['_onResize']();
      if (this.initialLoad || this.autozoom) {
        this.map.setView(this.map.getCenter(), 18, { animate: true });
        this.initialLoad = false;
      }
      if (this.autocentre) {
        this.map.setView(latlng, this.map.getZoom(), { animate: true });
      }
      if (this.marker) {
        this.marker.setLatLng(latlng);
      } else {
        this.marker = L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'assets/marker/marker-icon.png',
            shadowUrl: 'assets/marker/marker-shadow.png'
          })
        }).addTo(this.map);
      }
    });
  }

  onAutoZoomBtnClick() {
    this.autozoom = !this.autozoom;
    if (this.autozoom) {
      this.autoZoomBtnStyle = 'solid';
    } else {
      this.autoZoomBtnStyle = 'outline';
    }
  }

  onAutoCentreBtnClick() {
    this.autocentre = !this.autocentre;
    if (this.autocentre) {
      this.autoCenterBtnStyle = 'solid';
    } else {
      this.autoCenterBtnStyle = 'outline';
    }
  }
}
