import { Component, OnInit } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { HttpClient } from "@angular/common/http";
import { GeoJsonObject } from "geojson";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-map-box",
  templateUrl: "./map-box.component.html",
  styleUrls: ["./map-box.component.scss"]
})
export class MapBoxComponent implements OnInit {
  private geojson: GeoJsonObject;
  form: FormGroup;
  map: any;

  constructor(private http: HttpClient) {
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

      this.displayICRWithColors(map);
    });

    return map;
  }

  displayICRWithColors(map) {
    this.http
      .get<any>("assets/icr-with-colors.json")
      .toPromise()
      .then(data => {
        map.addLayer({
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
          }
        });
      });
  }
}
