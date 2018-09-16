import { Component, ViewChild, ElementRef } from '@angular/core';
import { Tabs, Events } from 'ionic-angular';
import { NavController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PubProvider } from '../../providers/pub/pub';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root: any = "MapPage";
  tab2Root: any = "ListPage";
  
  searchON: boolean = false;

  constructor(public platform: Platform, public navCtrl: NavController, public splashScreen: SplashScreen, 
              public pubProvider: PubProvider, public googleMaps: GoogleMapsProvider, public event: Events) {
                this.event.subscribe("searchHome",(search)=>{
                  this.searchON = search;
                });
    }
    // 
    ionViewDidLoad(){
      
    }
   searchBar(){
      if(this.searchON){
        this.searchON = false;
      }else{
        this.searchON = true;
      }
      this.event.publish("search",this.searchON);
   }

  }