import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddDevicePageRoutingModule } from './add-device-routing.module';
import { AddDevicePage } from './add-device.page';
import { NameSelectComponent } from 'src/app/components/app-name-select/app-name-select';
import { share } from 'rxjs';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddDevicePageRoutingModule,
    SharedModule
    
  ],
  declarations: [
    AddDevicePage,
  ]
})
export class AddDevicePageModule {}