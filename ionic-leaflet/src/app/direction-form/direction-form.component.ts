import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { and } from '@angular/router/src/utils/collection';
import { MapRouteService } from '../services/map-route.service';

@Component({
  selector: 'app-direction-form',
  templateUrl: './direction-form.component.html',
  styleUrls: ['./direction-form.component.scss']
})
export class DirectionFormComponent implements OnInit {
  startpoint:String;
  endpoint:String;
  url:string; 

  constructor(private httpClient: HttpClient, private mapRouteService:MapRouteService) {
    this.url="http://localhost:3030/api/ors-directions"
   }

  ngOnInit() {
  }

  onSearchRouteBtnClick(){
    //console.log("onSearchRouteBtnClick")
    //send coordinates to backend
    this.mapRouteService.routeSubject.subscribe(data=>{console.log("direction-form"); console.log(data);})
    if(this.startpoint!==undefined && this.endpoint!==undefined){
      this.mapRouteService.sendCoordinatesToServer(this.startpoint,this.endpoint)
    }
  }



  
}
