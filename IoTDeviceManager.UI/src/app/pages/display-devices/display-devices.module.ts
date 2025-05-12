import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DisplayDevicesPageRoutingModule } from './display-devices-routing.module';
import { DisplayDevicesPage } from './display-devices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayDevicesPageRoutingModule
  ],
  declarations: [
    DisplayDevicesPage
  ]
})
export class DisplayDevicesPageModule {}