import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapRouteService } from '../services/map-route.service';
import { AddressesService } from '../services/addresses.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-direction-form',
  templateUrl: './direction-form.component.html',
  styleUrls: ['./direction-form.component.scss']
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
  deployed: boolean;
  haveRoute: boolean;
  loader: HTMLIonLoadingElement;

  constructor(
    private httpClient: HttpClient,
    private mapRouteService: MapRouteService,
    private addressesService: AddressesService,
    private loadingController: LoadingController
  ) {
    this.startAddrList = [];
    this.endAddrList = [];
    this.deployed = true;
    this.haveRoute = false;
  }

  ngOnInit() {
    this.mapRouteService.routeSubject.subscribe(() => {
      this.deployed = false;
      this.haveRoute = true;
      this.removeLoader();
    });
    this.startInput =
      '75, Rue François Gay, Woluwe-Saint-Pierre, Bruxelles-Capitale, 1150, Belgique';
    this.endInput =
      'Clos Chapelle-aux-Champs, Woluwe-Saint-Lambert, Bruxelles-Capitale, 1200, Belgique';
  }

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
        this.startJSON['x'],
        this.startJSON['y'],
        this.endJSON['x'],
        this.endJSON['y']
      );
      this.afficheLoader();
    }
  }

  onChangerBtnClick() {
    this.deployed = true;
  }

  onAnnulerBtnClick() {
    this.deployed = false;
  }

  async afficheLoader() {
    this.loader = await this.loadingController.create({
      spinner: 'dots',
      message: 'Chargement de la route',
      animated: true,
      id: 'routeLoader',
      showBackdrop: true,
      translucent: true
    });
    return await this.loader.present();
  }

  async removeLoader() {
    await this.loader.dismiss();
  }
}
