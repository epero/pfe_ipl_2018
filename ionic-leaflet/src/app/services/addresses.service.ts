import { Injectable } from "@angular/core";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Subject } from "rxjs";

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
        countrycodes: "be",
        addressdetails: "1",
        viewbox:
          "4.259079821011285,50.763884731114281,4.481428372975057,50.914058111020985",
        bounded: "1"
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
    return {
      1000: "Bruxelles-Ville",
      1030: "Schaerbeek",
      1040: "Etterbeek",
      1050: "Ixelles",
      1060: "Saint-Gilles",
      1070: "Anderlecht",
      1080: "Molenbeek-St-Jean",
      1081: "Koekelberg",
      1082: "Berchem-Ste-Agathe",
      1083: "Ganshoren",
      1090: "Jette",
      1140: "Evere",
      1150: "Woluwé-St-Pierre",
      1160: "Auderghem",
      1170: "Watermael-Boitsfort",
      1180: "Uccle",
      1190: "Forest",
      1200: "Woluwé-St-Lambert",
      1210: "St Josse-ten-Noode"
    };
  }
}
