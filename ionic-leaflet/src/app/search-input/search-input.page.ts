import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { AddressesService } from "../services/addresses.service";

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

  constructor(
    private addressesService: AddressesService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.addrList = [];
    this.slug = this.route.snapshot.paramMap.get("id");
    this.point = this.slug === "start" ? "de départ" : "d'arrivée";
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
    this.navController.navigateBack("/home", true);
  }
}
