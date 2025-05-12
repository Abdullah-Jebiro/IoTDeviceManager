import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NameSelectComponent } from './components/app-name-select/app-name-select';

@NgModule({
  declarations: [
    NameSelectComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    NameSelectComponent
  ]
})
export class SharedModule { }