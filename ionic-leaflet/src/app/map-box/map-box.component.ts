<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';
import { FormGroup, FormControl } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
=======
import { Component, OnInit } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { HttpClient } from "@angular/common/http";
import { GeoJsonObject } from "geojson";
import { FormGroup, FormControl } from "@angular/forms";
import { MapRouteService } from "../services/map-route.service";
import { layer } from "@fortawesome/fontawesome-svg-core";
>>>>>>> 6613010cfa9bdbcf7a60b24944fd9bbfd8659dac

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {
  private geojson: GeoJsonObject;
  form: FormGroup;
  map: any;
  icrLayerID:string;
  routeLayerID:string;
  startpoint:any;
  endpoint:any;

<<<<<<< HEAD
  constructor(
    private http: HttpClient,
    private geolocation: Geolocation,
    private plateform: Platform
  ) {
=======
  constructor(private http: HttpClient, private mapRouteService: MapRouteService) {
>>>>>>> 6613010cfa9bdbcf7a60b24944fd9bbfd8659dac
    this.form = new FormGroup({
      mapStyle: new FormControl('basic')
    });

  }

  ngOnInit() {
    this.icrLayerID="all_icr";
    this.routeLayerID="route"
    mapboxgl.accessToken =
      'pk.eyJ1IjoieGRhcmthIiwiYSI6ImNqcGgxdXBobjByNHUza3BkbGtvMGY2eTUifQ.WuwZ_XI2zNxxObLi6moULg';

    //Display map style according to time
    const d = new Date();
    const n = d.getHours();
    if (n >= 18 || n <= 6) {
      this.map = this.initializingMap('dark');
    } else {
      this.map = this.initializingMap('basic');
    }

    this.plateform.ready().then(() => {
      this.geolocation
        .getCurrentPosition()
        .then(resp => {
          this.map.flyTo({
            center: [resp.coords.longitude, resp.coords.latitude],
            zoom: 18
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  initializingMap(mapStyle) {
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/' + mapStyle + '-v9',
      zoom: 11,
      center: [4.3517103, 50.8303396]
    });

    //Showing ICR routes
    map.on('load', () => {
      //Debug display of map for ionic
      let mapDiv = document.getElementById('map');
      let mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
      mapDiv.style.width = '100%';
      mapCanvas['style'].width = '100%';
      map.resize();

      map=this.displayICRWithColors(map);
    });

    // Display route
    this.mapRouteService.routeSubject.subscribe(geojson => {
        //hide ICR layer
        this.map.setLayoutProperty(this.icrLayerID,'visibility','none');
        //check if current route layer exists and remove if exists
        if(this.map.getLayer(this.routeLayerID) !== undefined){
            this.map.removeLayer(this.routeLayerID).removeSource(this.routeLayerID);
        }
        //display new route layer
        this.displayGeoJson(geojson,this.map,this.routeLayerID);
  
        //if (this.startpoint !== undefined) this.startpoint.removeFrom(this.map);
        //if (this.endpoint !== undefined) this.endpoint.removeFrom(this.map);
  
        /*var features = geojson["features"];
        var coordinatesFirstFeature = features[0]["geometry"]["coordinates"];
        var coordinatesLastFeature =
          features[features["length"] - 1]["geometry"]["coordinates"];
        var lengthLF = coordinatesLastFeature["length"];
  
        this.startpoint = this.displayPoint(
          coordinatesFirstFeature[0][1],
          coordinatesFirstFeature[0][0],
          "assets/marker/start.png"
        );
        this.endpoint = this.displayPoint(
          coordinatesLastFeature[lengthLF - 1][1],
          coordinatesLastFeature[lengthLF - 1][0],
          "assets/marker/end.png"
        );*/
    });
    

    return map;
  }

  displayPoint(lat:number,long:number,iconUrl:string){
    var marker = new mapboxgl.Marker()
    .setLngLat([30.5, 50.5])
    .addTo(this.map);
  }

  displayGeoJson(geojson: GeoJsonObject, map, layerID){
    map.addLayer({
        id: layerID,
        type: "line",
        source: {
          type: "geojson",
          data: geojson
        },
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2
        },
        visibility:'visible'
      });
  }

  //TODO mettre id layer en param
  displayICRWithColors(map) {
    this.http
<<<<<<< HEAD
      .get<any>('assets/latlong_icr.json')
      .toPromise()
      .then(data => {
        var color = null;
        data.features.forEach(element => {
          switch (element.properties.icr) {
            case '1':
              color = '#00cc00';
              break;
            case '2':
              color = '#99b3ff';
              break;
            case '3':
              color = '#FF3232';
              break;
            case '4':
              color = '#9932FF';
              break;
            case '5':
              color = '#00510A';
              break;
            case '6':
              color = '#00510A';
              break;
            case '7':
              color = '#D12200';
              break;
            case '8':
              color = '#00cc00';
              break;
            case '9':
              color = '#9932FF';
              break;
            case '10':
              color = '#FF3232';
              break;
            case '11':
              color = '#187c00';
              break;
            case '12':
              color = '#00510A';
              break;
            case 'A':
              color = '#FF8205';
              break;
            case 'B':
              color = '#FF8205';
              break;
            case 'C':
              color = '#FF8205';
              break;
            case 'CK':
              color = '#05AFFF';
              break;
            case 'SZ':
              color = '#05AFFF';
              break;
            case 'MM':
              color = '#00256B';
              break;
            case 'PP':
              color = '#D12200';
              break;
          }
          element.properties['color'] = color;
        });

        map.addLayer({
          id: 'all_icr',
          type: 'line',
          source: {
            type: 'geojson',
            data: data
=======
      .get<any>("assets/icr-with-colors.json")
      .toPromise()
      .then(geojson => this.displayGeoJson(geojson,map,this.icrLayerID)
      /*{
        map.addLayer({
          id: this.icrLayerID ,
          type: "line",
          source: {
            type: "geojson",
            data: geojson
>>>>>>> 6613010cfa9bdbcf7a60b24944fd9bbfd8659dac
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
<<<<<<< HEAD
            'line-color': ['get', 'color'],
            'line-width': 2
          }
=======
            "line-color": ["get", "color"],
            "line-width": 2
          },
          visibility:'visible'
>>>>>>> 6613010cfa9bdbcf7a60b24944fd9bbfd8659dac
        });
      }*/);

     return map; 
  }
}
