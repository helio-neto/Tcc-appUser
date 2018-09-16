import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PubPage } from './pub';

@NgModule({
  declarations: [
    PubPage,
  ],
  imports: [
    IonicPageModule.forChild(PubPage),
  ],
})
export class PubPageModule {}
