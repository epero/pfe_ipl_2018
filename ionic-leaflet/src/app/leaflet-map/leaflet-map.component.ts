import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { MapRouteService } from '../services/map-route.service';
import { Title } from '@angular/platform-browser';

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
  afficherICR:Boolean;
  mapLayer:L.GeoJSON<any>;

  constructor(
    private http: HttpClient,
    private geoloc: Geolocation,
    private plateform: Platform,
    private mapRouteService: MapRouteService,
  ) {
    this.faCoffee = faCoffee;
    this.afficherICR=true;
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
    console.log("afficher icr?"+this.afficherICR)
      this.http
      .get<GeoJsonObject>('assets/latlong_icr.json')
      .subscribe((json: any) => {
        this.mapLayer=this.printGeoJson(json); 
      })        
        
        /*this.geojson = json;

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

    this.mapRouteService.routeSubject.subscribe(json =>{
      this.map.removeLayer(this.mapLayer);

      this.mapLayer=this.printGeoJson(json);
      

    });
  }

  printGeoJson(jsonCoordinates:GeoJsonObject):L.GeoJSON{
    console.log("printGeoJson");
    console.log(jsonCoordinates);
    this.geojson = jsonCoordinates;

    var myStyle = {
            "color": "#0000FF",
            "weight": 5,
            "opacity": 0.65
    };
    //Colorization of ICR routes
    var layer=L.geoJSON(this.geojson, {
      style: function(feature) {
        //console.log(feature.properties.icr);
        if (feature.properties.icr){
          console.log("properties icr existe")
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
        }else{
          console.log("properties icr nexiste pas")
          return myStyle
        }
      }
    }).addTo(this.map);
    //myLayer.addData(geojsonFeature);
    return layer
  }

  watchLocation() {
    let watch = this.geoloc.watchPosition();
    watch.subscribe(data => {
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
      L.marker(L.latLng(this.lat, this.lng), {
        icon: L.divIcon({
          html: '<fa-icon [icon]="faCoffee"></fa-icon>',
          iconSize: [20, 20],
          className: 'myDivIcon'
        })
      }).addTo(this.map);
    });
  }
}
