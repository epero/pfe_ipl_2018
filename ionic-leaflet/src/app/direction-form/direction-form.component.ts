import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { and } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-direction-form',
  templateUrl: './direction-form.component.html',
  styleUrls: ['./direction-form.component.scss']
})
export class DirectionFormComponent implements OnInit {
  startpoint:String;
  endpoint:String;
  url:string; 

  constructor(private httpClient: HttpClient) {
    this.url="http://localhost:3030/api/ors-directions"
   }

  ngOnInit() {
  }
  sendCoordinatesToServer(start,end){
    //console.log("sendCoordinatesToServer")
    var json ={"coordinates":"[["+start+"],["+end+"]]"}
      this.httpClient
      .post('http://localhost:3030/api/ors-directions',json)
      .toPromise()
      .then(response => {console.log(response)})
      .catch(error=>{console.log(error)})
  }


  onSearchRouteBtnClick(){
    //console.log("onSearchRouteBtnClick")
    //send coordinates to backend
    if(this.startpoint!==undefined && this.endpoint!==undefined){
      this.sendCoordinatesToServer(this.startpoint,this.endpoint)
    }
  }



  
}
