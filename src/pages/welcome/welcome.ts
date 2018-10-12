import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Diagnostic } from '@ionic-native/diagnostic';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public platform: Platform, 
              public splashScreen: SplashScreen, private diagnostic: Diagnostic) {
  }

  ionViewDidLoad() {
    this.splashScreen.hide()
    console.log('ionViewDidLoad WelcomePage');
  }

}
