import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, Searchbar } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { AddressesService } from "../services/addresses.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.page.html",
  styleUrls: ["./search-input.page.scss"]
})
export class SearchInputPage implements OnInit {
  private slug: String;
  input: String;
  canSearch: boolean;
  addrList: Array<any>;
  point: String;
  position: any;

  @ViewChild("searchbar") searchbar: Searchbar;

  constructor(
    private addressesService: AddressesService,
    private navController: NavController,
    private route: ActivatedRoute,
    private geolocation: Geolocation
  ) {}

  ionViewWillEnter() {
    this.searchbar.setFocus();
    this.geolocation
      .getCurrentPosition({ enableHighAccuracy: true })
      .then(resp => {
        this.position = {
          x: "" + resp.coords.longitude,
          y: "" + resp.coords.latitude,
          label: "Votre position"
        };
      })
      .catch(error => {
        console.log("Error getting location", error); //TODO gérer erreur
      });
  }

  ngOnInit() {
    this.addrList = [];
    this.slug = this.route.snapshot.paramMap.get("id");
    this.point = this.slug === "start" ? "de départ" : "d'arrivée";
    if (this.addressesService.address["" + this.slug]) {
      this.input = this.addressesService.address["" + this.slug].label;
    }
  }

  onInputChange() {
    if (this.canSearch && this.input) {
      this.addressesService.getAddresses(this.input).then(addresses => {
        this.addrList = Object.keys(addresses).map(key => addresses[key]);
      });
    }
  }

  onInputFocus() {
    this.canSearch = true;
  }

  onInputBlur() {
    this.canSearch = false;
  }

  onAddrItemClick(addr: JSON) {
    this.addrList = [];
    this.addressesService.setAdress(this.slug, addr);
    this.navigateBack();
  }

  onPositionClick() {
    this.addressesService.setAdress(this.slug, this.position);
    this.navigateBack();
  }

  onBackButtonClick() {
    this.navigateBack();
  }

  navigateBack() {
    this.navController.navigateBack("/home", true);
  }
}
