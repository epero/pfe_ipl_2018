import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { HttpClientModule } from '@angular/common/http';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DirectionFormComponent } from '../direction-form/direction-form.component';
import { SwipeUpDrawerComponent } from '../swipe-up-drawer/swipe-up-drawer.component';
import { TrajectoireComponent } from '../trajectoire/trajectoire.component';
import { MapBoxComponent } from '../map-box/map-box.component';
import { IcrIconComponent } from '../icr-icon/icr-icon.component';
import { InstructionTypeIconComponent } from '../instruction-type-icon/instruction-type-icon.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MapBoxComponent,
    TrajectoireComponent,
    IcrIconComponent,
    InstructionTypeIconComponent
  ],
  providers: [Geolocation]
})
export class HomePageModule {}
