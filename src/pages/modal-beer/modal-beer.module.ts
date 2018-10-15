import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalBeerPage } from './modal-beer';

@NgModule({
  declarations: [
    ModalBeerPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalBeerPage),
  ],
})
export class ModalBeerPageModule {}
