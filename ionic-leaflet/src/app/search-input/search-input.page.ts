import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, Searchbar } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { AddressesService } from "../services/addresses.service";
import { MapService } from "../services/map.service";
import { Geoposition } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.page.html",
  styleUrls: ["./search-input.page.scss"]
})
export class SearchInputPage implements OnInit {
  private slug: any;
  input: String;
  canSearch: boolean;
  addrList: Array<any>;
  point: String;
  position: any;
  communes: Map<any, any>;

  @ViewChild("searchbar") searchbar: Searchbar;

  constructor(
    private addressesService: AddressesService,
    private navController: NavController,
    private route: ActivatedRoute,
    private mapService: MapService
  ) {}

  ionViewWillEnter() {
    this.searchbar.setFocus();
  }

  ngOnInit() {
    console.log("ngOnInit()");
    this.addrList = [];
    this.slug = this.route.snapshot.paramMap.get("id");
    this.point = this.slug === "start" ? "de départ" : "d'arrivée";

    if (this.mapService.hasPosition()) {
      this.setPosition(this.mapService.getPosition());
    } else {
      this.mapService.positionSubject.subscribe(position => {
        this.setPosition(position);
      });
    }
    if (this.addressesService.address[this.slug]) {
      let addr = this.addressesService.address[this.slug];
      this.input = addr.label;
      if (addr.label !== "Votre position") {
        this.addrList.push(addr);
      }
    }
  }

  onInputChange() {
    if (this.canSearch && this.input) {
      this.addressesService.getAddresses(this.input).then(addresses => {
        this.addrList = Object.keys(addresses).map(key => addresses[key]);
        this.addrList.forEach(addr => {
          this.parseAddress(addr);
        });
      });
    }
  }

  onInputFocus() {
    this.canSearch = true;
  }

  onInputBlur() {
    this.canSearch = false;
  }

  onInputClear() {
    this.addrList = [];
    this.input = "";
    this.addressesService.setAddress(this.slug, undefined);
    this.searchbar.setFocus();
  }

  onAddrItemClick(addr: JSON) {
    this.addrList = [];
    this.addressesService.setAddress(this.slug, addr);
    this.navigateBack();
  }

  onPositionClick() {
    this.addressesService.setAddress(this.slug, this.position);
    this.navigateBack();
  }

  onBackButtonClick() {
    this.navigateBack();
  }

  navigateBack() {
    this.navController.navigateBack("/home", false);
  }

  parseAddress(addr) {
    let label = addr.label.split(",");
    if (addr.raw.address.house_number) {
      addr["numero"] = addr.raw.address.house_number;
      addr["rue"] = label[1];
    } else {
      addr["rue"] = label[0];
    }
    addr["commune"] = this.addressesService.getCommmune(
      addr.raw.address.postcode
    );
    addr["codePostal"] = addr.raw.address.postcode;
  }

  setPosition(position: Geoposition) {
    this.position = {
      x: "" + position.coords.longitude,
      y: "" + position.coords.latitude,
      label: "Votre position"
    };
  }
}
