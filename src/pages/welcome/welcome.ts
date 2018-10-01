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
  gpsAvailable(){
    this.diagnostic.isLocationAvailable().then((isAvailable)=>{
      console.log("Is Available? ",isAvailable);
    }).catch((error)=>{
      console.log("Error Available",error);
    });
  }
  gpsOn(){
    this.diagnostic.isLocationEnabled().then((gpsOn)=>{
      console.log("Is Gps On? ",gpsOn);
      if(!gpsOn){
        this.diagnostic.switchToLocationSettings();
        let resumeListener = this.platform.resume.subscribe((event)=>{
          console.log("Voltou!");
          console.log("Event",event);
          this.diagnostic.getLocationMode().then((locationMode)=>{
            console.log("Location Mode ",locationMode);
            resumeListener.unsubscribe();
          });
        })
      }
    })
  }

}
