import { Component, OnInit } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { HttpClient } from "@angular/common/http";
import { GeoJsonObject } from "geojson";
import { FormGroup, FormControl } from "@angular/forms";
import { MapRouteService } from "../services/map-route.service";
import { layer } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: "app-map-box",
  templateUrl: "./map-box.component.html",
  styleUrls: ["./map-box.component.scss"]
})
export class MapBoxComponent implements OnInit {
  private geojson: GeoJsonObject;
  form: FormGroup;
  map: any;
  icrLayer:any;
  routeLayer:any;

  constructor(private http: HttpClient, private mapRouteService: MapRouteService) {
    this.form = new FormGroup({
      mapStyle: new FormControl("basic")
    });
  }

  ngOnInit() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoieGRhcmthIiwiYSI6ImNqcGgxdXBobjByNHUza3BkbGtvMGY2eTUifQ.WuwZ_XI2zNxxObLi6moULg";

    //Display map style according to time
    const d = new Date();
    const n = d.getHours();
    if (n >= 18 || n <= 6) {
      this.map = this.initializingMap("dark");
    } else {
      this.map = this.initializingMap("basic");
    }
  }

  initializingMap(mapStyle) {
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/" + mapStyle + "-v9",
      zoom: 11,
      center: [4.3517103, 50.8303396]
    });

    //Showing ICR routes
    map.on("load", () => {
      //Debug display of map for ionic
      let mapDiv = document.getElementById("map");
      let mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
      mapDiv.style.width = "100%";
      mapCanvas["style"].width = "100%";
      map.resize();

      this.icrLayer=this.displayICRWithColors(map);
    });

    // Display route
    this.mapRouteService.routeSubject.subscribe(geojson => {
        //if (this.mapLayer !== undefined) this.map.removeLayer(this.mapLayer);
        this.map.setLayoutProperty(this.icrLayer,'visibility','none');
        this.routeLayer = this.displayGeoJson(geojson,this.map,"route");
  
        /*if (this.startpoint !== undefined) this.startpoint.removeFrom(this.map);
        if (this.endpoint !== undefined) this.endpoint.removeFrom(this.map);
  
        var features = geojson["features"];
        var coordinatesFirstFeature = features[0]["geometry"]["coordinates"];
        var coordinatesLastFeature =
          features[features["length"] - 1]["geometry"]["coordinates"];
        var lengthLF = coordinatesLastFeature["length"];
  
        this.startpoint = this.printPoint(
          coordinatesFirstFeature[0][1],
          coordinatesFirstFeature[0][0],
          "assets/marker/start.png"
        );
        this.endpoint = this.printPoint(
          coordinatesLastFeature[lengthLF - 1][1],
          coordinatesLastFeature[lengthLF - 1][0],
          "assets/marker/end.png"
        );*/
    });
    

    return map;
  }

  displayGeoJson(geojson: GeoJsonObject, map, layerID){
    var layer = map.addLayer({
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
      return layer;
  }

  //TODO mettre id layer en param
  displayICRWithColors(map) {
    this.http
      .get<any>("assets/latlong_icr.json")
      .toPromise()
      .then(data => {
        var color = null;
        data.features.forEach(element => {
          switch (element.properties.icr) {
            case "1":
              color = "#00cc00";
              break;
            case "2":
              color = "#99b3ff";
              break;
            case "3":
              color = "#FF3232";
              break;
            case "4":
              color = "#9932FF";
              break;
            case "5":
              color = "#00510A";
              break;
            case "6":
              color = "#00510A";
              break;
            case "7":
              color = "#D12200";
              break;
            case "8":
              color = "#00cc00";
              break;
            case "9":
              color = "#9932FF";
              break;
            case "10":
              color = "#FF3232";
              break;
            case "11":
              color = "#187c00";
              break;
            case "12":
              color = "#00510A";
              break;
            case "A":
              color = "#FF8205";
              break;
            case "B":
              color = "#FF8205";
              break;
            case "C":
              color = "#FF8205";
              break;
            case "CK":
              color = "#05AFFF";
              break;
            case "SZ":
              color = "#05AFFF";
              break;
            case "MM":
              color = "#00256B";
              break;
            case "PP":
              color = "#D12200";
              break;
          }
          element.properties["color"] = color;
        });

        var layer=map.addLayer({
          id: "all_icr",
          type: "line",
          source: {
            type: "geojson",
            data: data
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
      });

     return layer; 
  }
}
