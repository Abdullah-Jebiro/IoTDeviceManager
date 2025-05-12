import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayDevicesPage } from './display-devices.page';

const routes: Routes = [
  {
    path: '',
    component: DisplayDevicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayDevicesPageRoutingModule {}
