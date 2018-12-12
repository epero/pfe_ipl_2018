import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkCheckService {
  connectedSubject:Subject<boolean>
  connected:boolean;

  constructor(private platform:Platform, private network:Network) {  
    this.connectedSubject=new Subject<boolean>()  
    if (this.platform.is('cordova')){
      this.network.onDisconnect().subscribe(() => {
        this.setConnected(false)
      });
      
      // watch network for a connection
      this.network.onConnect().subscribe(() => {
        this.setConnected(true)

      });
    }else{
      
      window.addEventListener('offline',()=> { 
         this.setConnected(false)
      });
      window.addEventListener('online', ()=> { 
        this.setConnected(true);
      });
    } 
  }
  setConnected(connected){
    this.connected=connected;
    this.emitConnectivity();
  }

  emitConnectivity(){
    this.connectedSubject.next(this.connected);
  }
  
}
