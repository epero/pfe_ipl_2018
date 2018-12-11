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

    mapboxgl.accessToken = this.mapService.TOKEN;

    //Display map style according to time
    this.initializingMap(this.mapService.couleur);
    this.displayICRWithColors();
    this.addGeolocalisation();
    this.addNavigation();

    this.addResizeSubscription();
    this.addRouteSubscription();
  }

  showICR() {
    this.map.setLayoutProperty(this.icrLayerID, 'visibility', 'visible');
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
  }

  addRoute(geojson: GeoJsonObject) {
    this.displayGeoJson(geojson, this.routeLayerID);
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
      this.displayGeoJson(geojson, this.routeLayerID);

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
      this.zoomToCoordinates(coordinates);
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
    });
  }

  zoomToCoordinates(coordinates) {
    /*var bounds = coordinates.reduce(function(bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    this.map.fitBounds(bounds, {
      padding: 200
    });*/
    this.map.fitBounds(coordinates, {
      padding: 100
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

  displayGeoJson(geojson: GeoJsonObject, layerID) {
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
        'line-width': 2
      },
      visibility: 'visible'
    });
  }

  displayICRWithColors() {
    this.http
      .get<any>('assets/icr-with-colors.json')
      .toPromise()
      .then(geojson => {
        //if no route has been entered yet, display ICRs
        if (this.map.getLayer(this.routeLayerID) === undefined) {
          this.displayGeoJson(geojson, this.icrLayerID);
        }
      });
  }
}
