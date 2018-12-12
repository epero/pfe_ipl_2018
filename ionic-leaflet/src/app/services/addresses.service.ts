import { Injectable } from "@angular/core";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Subject } from "rxjs";
import { config } from "./app-config.service";

@Injectable({
  providedIn: "root"
})
export class AddressesService {
  private provider: OpenStreetMapProvider;
  addresses: Array<any>;
  address: Object;
  addressSubject: Subject<Object>;
  communes: any;

  constructor() {
    this.address = {};
    this.provider = new OpenStreetMapProvider({
      params: {
        countrycodes: config.osm.countrycodes,
        addressdetails: config.osm.addressdetails,
        viewbox: config.osm.viewbox,
        bounded: config.osm.bounded
      }
    });
    this.addressSubject = new Subject<Object>();
    this.communes = this.initCommunes();
  }

  getAddresses(address) {
    return new Promise((resolve, reject) =>
      this.provider
        .search({ query: address, params: {} })
        .then(result => {
          this.addresses = [];
          result.forEach(element => {
            this.addresses.push(element);
          });
          resolve(this.addresses);
        })
        .catch(err => reject(err))
    );
  }

  setAddress(id, address: any) {
    this.address[id] = address;
    this.emitAddress();
  }

  getCommmune(codePostal) {
    return this.communes[codePostal];
  }

  emitAddress() {
    this.addressSubject.next(this.address);
  }

  initCommunes() {
    return config.communes;
  }
}
