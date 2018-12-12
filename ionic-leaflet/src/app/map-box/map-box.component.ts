import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';
import { FormGroup, FormControl } from '@angular/forms';
import { MapRouteService } from '../services/map-route.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {
  private geojson: GeoJsonObject;
  form: FormGroup;
  map: any;
  icrLayerID: string;
  routeLayerID: string;
  startpoint: any;
  endpoint: any;
  coordinatesBrussels:any;
  locationMarker: any;

  constructor(
    private http: HttpClient,
    private mapRouteService: MapRouteService,
    private mapService: MapService
  ) {
    this.form = new FormGroup({
      mapStyle: new FormControl('basic')
    });
  }

  ngOnInit() {
    this.icrLayerID = 'all_icr';
    this.routeLayerID = 'route';
  this.coordinatesBrussels=[[4.481428372975057,50.79274292403498],[4.259079821011285,50.8165248694234],[4.415007260283637,50.914058111020985]/*,[4.375405604421133, 50.84326187013847]*/]

    mapboxgl.accessToken = this.mapService.TOKEN;

    //Display map style according to time
    this.initializingMap(this.mapService.couleur); 
    this.addGeolocalisation();
    this.addNavigation();

    this.addResizeSubscription();
    this.addRouteSubscription();
  }
  /**
   * if icr layer exists show it else create it
   */
  showICR() {
    if(this.map.getLayer(this.icrLayerID) !== undefined){
      this.map.setLayoutProperty(this.icrLayerID, 'visibility', 'visible');
    }else{
      this.map.createAndDisplayICRLayer();
    }
  }

  displayICROnly(){
    this.removeRoute();
    this.showICR();
    this.zoomToCoordinates(this.coordinatesBrussels,20);
  }

  /**
   * Hide ICR Layer
   */
  hideICR() {
    this.map.setLayoutProperty(this.icrLayerID, 'visibility', 'none');
  }

  removeRoute() {
    if (this.map.getLayer(this.routeLayerID) !== undefined) {
      this.map.removeLayer(this.routeLayerID).removeSource(this.routeLayerID);
    }
    if (this.startpoint !== undefined) this.startpoint.remove();
    if (this.endpoint !== undefined) this.endpoint.remove();
  }

  addRoute(geojson: GeoJsonObject) {
    this.createAndDisplayGeojsonLayer(geojson, this.routeLayerID);
  }

  /**
   * Subscribe to map-route.service to display route when
   * a new route is available or route changes
   */
  addRouteSubscription() {
    this.mapRouteService.routeSubject.subscribe(geojson => {
      this.hideICR();
      //check if current route layer exists and remove if exists
      this.removeRoute();
      //display new route layer
      this.createAndDisplayGeojsonLayer(geojson, this.routeLayerID);

      if (this.startpoint !== undefined) this.startpoint.remove();
      if (this.endpoint !== undefined) this.endpoint.remove();

      let features = geojson['features'];
      let coordinatesFirstFeature = features[0]['geometry']['coordinates'];
      let coordinatesLastFeature =
        features[features['length'] - 1]['geometry']['coordinates'];
      let lengthLF = coordinatesLastFeature['length'];

      let latStart = coordinatesFirstFeature[0][1];
      let longStart = coordinatesFirstFeature[0][0];
      let latEnd = coordinatesLastFeature[lengthLF - 1][1];
      let longEnd = coordinatesLastFeature[lengthLF - 1][0];
      this.startpoint = this.addPointToMap(
        latStart,
        longStart,
        '../assets/marker/start.png'
      );
      this.endpoint = this.addPointToMap(
        latEnd,
        longEnd,
        'assets/marker/end.png'
      );

      // Zoom to route
      let coordinates = [[longStart, latStart], [longEnd, latEnd]];
      this.zoomToCoordinates(coordinates,100);
    });
  }

  addResizeSubscription() {
    this.mapService.resizeSubject.subscribe(() => {
      this.resizeMap();
    });
  }

  addNavigation() {
    //NavigationMap
    let nav = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: false
    });

    this.map.addControl(nav, 'top-right');
  }

  addGeolocalisation() {
    //GeolocalisationMap
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });

    this.map.addControl(geolocate, 'top-right');

    this.map.on('load', () => {
      geolocate.trigger();
    });
  }

  // Debug display of map for ionic
  resizeMap() {
    let mapDiv = document.getElementById('map');
    let mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
    mapDiv.style.width = '100%';
    mapCanvas['style'].width = '100%';
    this.map.resize();
  }

  initializingMap(mapStyle) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/' + mapStyle + '-v9',
      zoom: 11,
      center: [4.3517103, 50.8603396],
      showUserLocation: true
    });

    this.map.on('load', () => {
      this.resizeMap();
      this.createAndDisplayICRLayer();
    });
  }

  zoomToCoordinates(coordinates, padding) {
    /*var bounds = coordinates.reduce(function(bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    this.map.fitBounds(bounds, {
      padding: 200
    });*/
    this.map.fitBounds(coordinates, {
      padding: padding
    });
  }

  addPointToMap(lat: number, long: number, iconUrl: string) {
    /*let el =document.createElement('div');
    el.style.backgroundImage=iconUrl;*/
    let marker = new mapboxgl.Marker(/*el*/)
      .setLngLat([long, lat])
      //.setColor("red")
      .addTo(this.map);
    return marker;
  }

  createAndDisplayGeojsonLayer(geojson: GeoJsonObject, layerID) {

      if(geojson['features'][0].properties.icr === 'ors') {
        geojson['features'][0].properties.color = 'rgba(255, 255, 255, 0)';
        geojson['features'][geojson['features'].length-1].properties.color = "rgba(255, 255, 255, 0)"
      }

    this.map.addLayer({
      id: layerID,
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 2,
      },
      visibility: 'visible'
    });

    this.displayORSWithDot(geojson);
  }

  displayORSWithDot(geojson) {

    if(geojson['features'][0].properties.icr === 'ors') {
        var ors = geojson['features'][0];
        var ors2 = geojson['features'][geojson['features'].length-1];

    this.map.addLayer({
      id: 'ors',
      type: 'line',
      source: {
        type: 'geojson',
        data: ors
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'white',
        'line-width': 2,
        'line-dasharray': [0, 2]
      },
      visibility: 'visible'
    });

    this.map.addLayer({
      id: 'ors2',
      type: 'line',
      source: {
        type: 'geojson',
        data: ors2
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'white',
        'line-width': 2,
        'line-dasharray': [0, 2]
      },
      visibility: 'visible'
    });
    }
  }

  createAndDisplayICRLayer() {
    //if layer with this id exists remove it
    if(this.map.getLayer(this.icrLayerID)!== undefined){
      this.map.removeLayer(this.icrLayerID);
    }
    this.http
      .get<any>('assets/icr-with-colors.json')
      .toPromise()
      .then(geojson => {
        //if no route has been entered yet, display ICRs
        if (this.map.getLayer(this.routeLayerID) === undefined) {
          this.createAndDisplayGeojsonLayer(geojson, this.icrLayerID);
        }
      });
  }
}
//exactement exactement