import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GeoJsonObject } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class MapRouteService {
  
  routeSubject:Subject<GeoJsonObject>;
  route:GeoJsonObject;
  
  constructor(private httpClient:HttpClient) {
    this.routeSubject=new Subject<GeoJsonObject>()
  }

  sendCoordinatesToServer(start,end){
    //console.log("sendCoordinatesToServer")
    var json ={"coordinates":"[["+start+"],["+end+"]]"}
      this.httpClient
      .post<GeoJsonObject>('http://localhost:3030/api/ors-directions',json)
      .toPromise()
      .then(response => {
        this.setRoute(response); console.log(response)
      })
      .catch(error=>{console.log(error)})
  }

  setRoute(route:GeoJsonObject){
    this.route=route
    this.emitRoute()
  }

  emitRoute(){
    this.routeSubject.next(this.route)
  }

}
