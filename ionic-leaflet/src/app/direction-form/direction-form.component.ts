import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MapRouteService } from "../services/map-route.service";

import { OpenStreetMapProvider } from "leaflet-geosearch";

@Component({
  selector: "app-direction-form",
  templateUrl: "./direction-form.component.html",
  styleUrls: ["./direction-form.component.scss"]
})
export class DirectionFormComponent implements OnInit {
  startAddr: String;
  endAddr: String;
  url: string;
  startAddrList: Array<String>;
  endAddrList: Array<String>;
  startCoord: String;
  endCoord: String;
  private provider: OpenStreetMapProvider;

  constructor(
    private httpClient: HttpClient,
    private mapRouteService: MapRouteService
  ) {
    this.url = "http://localhost:3030/api/ors-directions";
    this.provider = new OpenStreetMapProvider();
    this.startAddrList = [];
    this.endAddrList = [];
  }

  ngOnInit() {}

  onStartAddrChange() {
    //TODO delay to not DDOS the server on every keystroke.
    this.provider.search({ query: this.startAddr }).then(result => {
      this.startAddrList = [];
      result.forEach(element => {
        this.startAddrList.push(element);
      });
    });
  }

  onEndAddrChange() {
    //TODO delay to not DDOS the server on every keystroke.
    this.provider.search({ query: this.endAddr }).then(result => {
      this.endAddrList = [];
      result.forEach(element => {
        this.endAddrList.push(element);
      });
    });
  }

  onSearchRouteBtnClick() {
    //send coordinates to backend
    if (this.startAddr !== undefined && this.endAddr !== undefined) {
      this.mapRouteService.sendCoordinatesToServer(
        this.startAddrList[0]["x"],
        this.startAddrList[0]["y"],
        this.endAddrList[0]["x"],
        this.endAddrList[0]["y"]
      );
    }
  }
}
