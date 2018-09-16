import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-pub-beer-list',
  templateUrl: 'pub-beer-list.html',
})
export class PubBeerListPage {
  beers: any;
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public splashScreen: SplashScreen) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.beers = navParams.get('beers');
    console.log("Beers .:.",this.beers);
  }
  // 
  ionViewDidEnter() {
    this.splashScreen.hide()
  }
  // 
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(PubBeerListPage, {
      item: item
    });
  }
}
