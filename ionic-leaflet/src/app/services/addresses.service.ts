import { Injectable } from '@angular/core';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private provider: OpenStreetMapProvider;
  addresses: Array<any>;
  address: Object;
  addressSubject: Subject<Object>;

  constructor() {
    this.address = {};
    this.provider = new OpenStreetMapProvider({
      params: { countrycodes: 'be' }
    });
    this.addressSubject = new Subject<Object>();
  }

  getAddresses(address) {
    return new Promise((resolve, reject) =>
      this.provider
        .search({ query: address })
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

  setAdress(id, address: any) {
    this.address[id] = address;
    this.emitAdress();
  }

  emitAdress() {
    this.addressSubject.next(this.address);
  }
}
