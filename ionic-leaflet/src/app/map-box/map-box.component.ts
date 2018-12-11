import { Component, OnInit } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { HttpClient } from "@angular/common/http";
import { GeoJsonObject } from "geojson";
import { FormGroup, FormControl } from "@angular/forms";
import { MapRouteService } from "../services/map-route.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-map-box",
  templateUrl: "./map-box.component.html",
  styleUrls: ["./map-box.component.scss"]
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
    private geolocation: Geolocation
  ) {
    this.form = new FormGroup({
      mapStyle: new FormControl("basic")
    });
  }

  ngOnInit() {
    this.icrLayerID = "all_icr";
    this.routeLayerID = "route";

    mapboxgl.accessToken =
      "pk.eyJ1IjoieGRhcmthIiwiYSI6ImNqcGgxdXBobjByNHUza3BkbGtvMGY2eTUifQ.WuwZ_XI2zNxxObLi6moULg";

    //Display map style according to time
    const d = new Date();
    const n = d.getHours();
    if (n >= 18 || n <= 6) {
      this.map = this.initializingMap("dark");
    } else {
      this.map = this.initializingMap("light");
    }

    //GeolocalisationMap
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });

    this.map.addControl(geolocate, "top-right");

    this.map.on("load", function() {
      geolocate.trigger();
    });

    //NavigationMap
    var nav = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: false
    });

    this.map.addControl(nav, "top-right");
  }

  initializingMap(mapStyle) {
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/" + mapStyle + "-v9",
      zoom: 11,
      center: [4.3517103, 50.8603396],
      showUserLocation: true
    });

    //Showing ICR routes
    map.on("load", () => {
      //Debug display of map for ionic
      let mapDiv = document.getElementById("map");
      let mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
      mapDiv.style.width = "100%";
      mapCanvas["style"].width = "100%";
      map.resize();

      this.map = this.displayICRWithColors(map);
    });

    /**
     * Subscribe to map-route.service to display route when
     * a new route is available or route changes
     */

    this.mapRouteService.routeSubject.subscribe(geojson => {
      //hide ICR layer
      this.map.setLayoutProperty(this.icrLayerID, "visibility", "none");
      //check if current route layer exists and remove if exists
      if (this.map.getLayer(this.routeLayerID) !== undefined) {
        this.map.removeLayer(this.routeLayerID).removeSource(this.routeLayerID);
      }
      //display new route layer
      this.displayGeoJson(geojson, this.map, this.routeLayerID);

      if (this.startpoint !== undefined) this.startpoint.remove();
      if (this.endpoint !== undefined) this.endpoint.remove();

      var features = geojson["features"];
      var coordinatesFirstFeature = features[0]["geometry"]["coordinates"];
      var coordinatesLastFeature =
        features[features["length"] - 1]["geometry"]["coordinates"];
      var lengthLF = coordinatesLastFeature["length"];

      var latStart = coordinatesFirstFeature[0][1];
      var longStart = coordinatesFirstFeature[0][0];
      var latEnd = coordinatesLastFeature[lengthLF - 1][1];
      var longEnd = coordinatesLastFeature[lengthLF - 1][0];
      this.startpoint = this.addPointToMap(
        latStart,
        longStart,
        "../assets/marker/start.png"
      );
      this.endpoint = this.addPointToMap(
        latEnd,
        longEnd,
        "assets/marker/end.png"
      );

      // Zoom to route
      var coordinates = [[longStart, latStart], [longEnd, latEnd]];
      this.zoomToCoordinates(coordinates);
    });

    return map;
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
    /*var el =document.createElement('div');
    el.style.backgroundImage=iconUrl;*/
    var marker = new mapboxgl.Marker(/*el*/)
      .setLngLat([long, lat])
      //.setColor("red")
      .addTo(this.map);
    return marker;
  }

  displayGeoJson(geojson: GeoJsonObject, map, layerID) {
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
      visibility: "visible"
    });
  }

  displayICRWithColors(map) {
    this.http
      .get<any>("assets/icr-with-colors.json")
      .toPromise()
      .then(geojson => {
        //if no route has been entered yet, display ICRs
        if (this.map.getLayer(this.routeLayerID) === undefined) {
          this.displayGeoJson(geojson, map, this.icrLayerID);
        }
      });
    return map;
  }
}
