import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PubBeerListPage } from './pub-beer-list';

@NgModule({
  declarations: [
    PubBeerListPage,
  ],
  imports: [
    IonicPageModule.forChild(PubBeerListPage),
  ],
})
export class PubBeerListPageModule {}
