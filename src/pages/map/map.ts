import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PubProvider } from '../../providers/pub/pub';
import { LocationProvider } from '../../providers/location/location';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  
  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchON: boolean;
  saveDisabled: boolean;
  location: any; 
  cancelText: string = "Cancelar";

  constructor(public platform: Platform, public navCtrl: NavController, public splashScreen: SplashScreen, 
              public pubProvider: PubProvider, public googleMaps: GoogleMapsProvider, public events: Events, 
              public navParams: NavParams, public locationProv: LocationProvider) {
                
  }
  
  // On View Load
  // Check Platform, Load GoogleMaps, Load Pubs, Pin User, Pin Pubs
  ionViewDidLoad() {
      console.log('ionViewDidLoad MapPage');
      this.platform.ready().then(() => { 
        this.events.subscribe("search",(search)=>{
          this.searchON = search;
        });
        let mapLoaded = this.googleMaps.init(this.mapElement, this.pleaseConnect).then((data) => {
          this.splashScreen.hide();
          let locationsLoaded = this.locationProv.loadPubs().then((data)=>{
            console.log("Locations ->",data);
            this.googleMaps.pinPubs(data);
            //this.googleMaps.loadPlaces();
          }).catch((error)=>{
            console.log(error)
          });
        });
      });
  }
  // 
  getUserPosition(){
    this.locationProv.getUserLocation().then(result=>{
      console.log("Result ->",result);
      alert("User ->"+JSON.stringify(result));
    });
  }
  // SearchBar Input Event     
  onInput(event){
      this.googleMaps.removeMarker();
      setTimeout(() => {
        this.locationProv.searchMap(this.query).then((data)=>{
          console.log("DATA SEARCH MAP -> ",data);
          this.googleMaps.pinPubs(data);
        });
      }, 1000);    
    //console.log(event);
  }
  // SearchBar Cancel Event
  onCancel(event){
      console.log(event);
  }
  searchBarMap(){
    if(this.searchON){
      this.searchON = false;
    }else{
      this.searchON = true;
    }
    this.events.publish("searchHome",this.searchON);
 }
  
}
  