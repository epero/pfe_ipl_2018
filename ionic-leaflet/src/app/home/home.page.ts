import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';
import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    private geojson: GeoJsonObject;

    constructor(private http: HttpClient) { }

    ngOnInit() {

        const map = L.map('leafletMap').setView([50.8003396, 4.3517103], 12);

        //Debug for tiles were not shown
        map._onResize();

        //Defining type of map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Leaflet Map',
            maxZoom: 18
        }).addTo(map);

        map.locate({setView: true, maxZoom: 16});

        //Display Brussel's ICR routes
        this.http.get<GeoJsonObject>('assets/latlong_icr.json').subscribe((json: any) => {
            console.log(json);
            this.geojson = json;

            /*var myStyle = {
                "color": "#ff7800",
                "weight": 5,
                "opacity": 0.65
            };*/

            //Colorization of ICR routes
            L.geoJSON(this.geojson, {
                style: function(feature) {
                    console.log(feature.properties.icr);
                    switch(feature.properties.icr){
                        case '1':
                            return {color: "#00cc00"};
                        case '2':
                            return {color: "#99b3ff"}
                        case '3':
                            return {color: "#FF3232"}
                        case '4':
                            return {color: "#9932FF"}
                        case '5':
                            return {color: "#00510A"}
                        case '6':
                            return {color: "#00510A"}
                        case '7':
                            return {color: "#D12200"}
                        case '8':
                            return {color: "#00cc00"}
                        case '9':
                            return {color: "#9932FF"}
                        case '10':
                            return {color: "#FF3232"}
                        case '11':
                            return {color: "#187c00"}
                        case '12':
                            return {color: "#00510A"}
                        case 'A':
                            return {color: "#FF8205"}
                        case 'B':
                            return {color: "#FF8205"}
                        case 'C':
                            return {color: "#FF8205"}
                        case 'CK':
                            return {color: "#05AFFF"}
                        case 'SZ':
                            return {color: "#05AFFF"}
                        case 'MM':
                            return {color: "#00256B"}
                        case 'PP':
                            return {color: "#D12200"}
                            
                    }
                }
            }).addTo(map);
        });

        //Geolocalisation
        function onLocationFound(e) {
            var radius = e.accuracy / 2;

            L.marker(e.latlng).addTo(map)
                .bindPopup("You are within " + radius + " meters from this point").openPopup();

            L.circle(e.latlng, radius).addTo(map);
        }

        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            console.log("Unable to retrieve localisation");
        }

        map.on('locationerror', onLocationError);
    }
}
