import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-beer',
  templateUrl: 'modal-beer.html',
})
export class ModalBeerPage {

  beer: any;

  constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {
    
    this.beer = this.params.get('beer');
    console.log("BEER MODAL",this.beer);
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
