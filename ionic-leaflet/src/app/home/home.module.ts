import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { HttpClientModule } from '@angular/common/http';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DirectionFormComponent } from '../direction-form/direction-form.component';
import { SwipeUpDrawerComponent } from '../swipe-up-drawer/swipe-up-drawer.component';
import { TrajectoireComponent } from '../trajectoire/trajectoire.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    LeafletMapComponent,
    DirectionFormComponent,
    SwipeUpDrawerComponent,
    TrajectoireComponent
  ],
  providers: [Geolocation]
})
export class HomePageModule {}
