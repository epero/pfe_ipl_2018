import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MapRouteService } from "../services/map-route.service";
import { AddressesService } from "../services/addresses.service";

@Component({
  selector: "app-direction-form",
  templateUrl: "./direction-form.component.html",
  styleUrls: ["./direction-form.component.scss"]
})
export class DirectionFormComponent implements OnInit {
  startInput: String;
  startJSON: any;
  startSearch: boolean;
  endInput: String;
  endJSON: any;
  endSearch: boolean;
  startAddrList: Array<any>;
  endAddrList: Array<any>;

  constructor(
    private httpClient: HttpClient,
    private mapRouteService: MapRouteService,
    private addressesService: AddressesService
  ) {
    this.startAddrList = [];
    this.endAddrList = [];
  }

  ngOnInit() {}

  onStartInputChange() {
    if (this.startSearch) {
      this.addressesService.getAddresses(this.startInput).then(addresses => {
        this.startAddrList = Object.keys(addresses).map(key => addresses[key]);
      });
    }
  }

  onStartInputFocus() {
    this.startSearch = true;
  }

  onStartInputBlur() {
    this.startSearch = false;
  }

  onStartAddrItemClick(addr) {
    this.startAddrList = [];
    this.startJSON = addr;
  }

  onEndInputChange() {
    if (this.endSearch) {
      this.addressesService.getAddresses(this.endInput).then(addresses => {
        this.endAddrList = Object.keys(addresses).map(key => addresses[key]);
      });
    }
  }

  onEndInputFocus() {
    this.endSearch = true;
  }

  onEndInputBlur() {
    this.endSearch = false;
  }

  onEndAddrItemClick(addr) {
    this.endAddrList = [];
    this.endJSON = addr;
  }

  onSearchRouteBtnClick() {
    //send coordinates to backend

    if (this.startJSON !== undefined && this.endJSON !== undefined) {
      this.mapRouteService.sendCoordinatesToServer(
        this.startJSON["x"],
        this.startJSON["y"],
        this.endJSON["x"],
        this.endJSON["y"]
      );
    }
  }
}
