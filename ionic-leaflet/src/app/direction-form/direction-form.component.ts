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
  loaderPromise: Promise<void>;

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
    /*this.startInput =
      '75, Rue François Gay, Woluwe-Saint-Pierre, Bruxelles-Capitale, 1150, Belgique';
    this.endInput =
      'Clos Chapelle-aux-Champs, Woluwe-Saint-Lambert, Bruxelles-Capitale, 1200, Belgique';
    this.startJSON = JSON.parse(
      '{"x":"4.42749990163728","y":"50.83802865","label":"75, Rue François Gay, Woluwe-Saint-Pierre, Bruxelles-Capitale, 1150, Belgique","bounds":[[50.8379692,4.4274554],[50.8380956,4.4275444]],"raw":{"place_id":"136891010","licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":"257308866","boundingbox":["50.8379692","50.8380956","4.4274554","4.4275444"],"lat":"50.83802865","lon":"4.42749990163728","display_name":"75, Rue François Gay, Woluwe-Saint-Pierre, Bruxelles-Capitale, 1150, Belgique","class":"building","type":"yes","importance":1.1309999999999998}}'
    );
    this.endJSON = JSON.parse(
      '{"x":"4.4495593","y":"50.8494209","label":"Clos Chapelle-aux-Champs, Woluwe-Saint-Lambert, Bruxelles-Capitale, 1200, Belgique","bounds":[[50.8490422,4.4494352],[50.8500216,4.4497562]],"raw":{"place_id":"132361542","licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":"236815569","boundingbox":["50.8490422","50.8500216","4.4494352","4.4497562"],"lat":"50.8494209","lon":"4.4495593","display_name":"Clos Chapelle-aux-Champs, Woluwe-Saint-Lambert, Bruxelles-Capitale, 1200, Belgique","class":"highway","type":"residential","importance":1.22}}'
    );
    this.onSearchRouteBtnClick();*/
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
      this.loaderPromise = this.afficheLoader();
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
    this.loaderPromise.then(() => this.loader.dismiss());
  }
}
