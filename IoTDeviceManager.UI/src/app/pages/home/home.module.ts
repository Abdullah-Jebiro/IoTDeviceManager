import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { SharedModule } from "../../shared.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    
],
  declarations: [HomePage]
})
export class HomePageModule {}
