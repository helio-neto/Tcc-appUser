import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform, AlertController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';

import 'rxjs/add/operator/map';

declare var Connection;

@Injectable()
export class ConnectivityProvider {

  constructor(public platform: Platform, public network: Network, public alertCtrl: AlertController,
              private diagnostic: Diagnostic) {
    console.log('ConnectivityService Provider');
  }
  // Check if the app is running on a device or browser
  // True = device, False = Browser
  isDevice(): boolean {
    return this.platform.is('cordova');
  }
  // Check if we have internect connection
  isOnline(): boolean {
    if(this.isDevice() && this.network.type){
      // alert("Network Type :: "+this.network.type);
      return this.network.type !== Connection.NONE;
    } else {
      console.log("Browser online");
      return navigator.onLine;
    }
  }
  // Watch user get Online
  watchOnline(): any {
    return this.network.onConnect();
  }
  // Watch user get offline
  watchOffline(): any {
    return this.network.onDisconnect();
  }
  // Get Location Service
  getGps(): Promise<any>{
    return new Promise((resolve)=>{
      this.diagnostic.isLocationEnabled().then((gpsOn)=>{
        console.log("Is Gps On? ",gpsOn);
        if(gpsOn){
          resolve(gpsOn);
        }
        if(!gpsOn){
          this.diagnostic.switchToLocationSettings();
          let resumeListener = this.platform.resume.subscribe((event)=>{
            console.log("Voltou!");
            console.log("Event",event);
            this.diagnostic.getLocationMode().then((locationMode)=>{
              console.log("Location Mode ",locationMode);
              resumeListener.unsubscribe();
              resolve(locationMode);
            });
          })
        }
      })
    });
  }
  gpsStatus(){
    return this.diagnostic.isLocationEnabled();
  }
  
}
