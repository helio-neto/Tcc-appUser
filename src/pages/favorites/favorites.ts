import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, Navbar  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PubProvider } from './../../providers/pub/pub';
import { LoadingProvider } from './../../providers/loading/loading';
@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  @ViewChild(Navbar) navBar: Navbar;
  favorites: string = "pubs";
  pubs: any;
  beers: any;
  selectedBeer: any;
  pub: any;
  token: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, 
              public modalCtrl: ModalController, private storage: Storage, private pubProv: PubProvider,
              public loadProvider: LoadingProvider) {

      this.initFav();
  }
  // 
  initFav(){
    this.platform.ready().then(()=>{
      this.storage.get("userdata").then((val)=>{
        console.log("Favorites Val",val.user.favorites);
        this.token = val.token;
        this.pubs = val.user.favorites.pubs;
        this.beers = val.user.favorites.beers;
      });
    });
  }
  // 
  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }
  // 
  ionViewDidEnter(){
   this.initFav();
  }
  // 
  beerTapped(event, beer) {
    // That's right, we're pushing to ourselves!
   this.selectedBeer = beer;
  }
  // 
  openModal(beer) {
    console.log("MODAL CREATE", beer);
    
    let modal = this.modalCtrl.create("ModalBeerPage", {beer});
    modal.present();
  }
  // 
  goToPub(pub_id){
    this.loadProvider.presentWithMessage("Cevando informações...");
    let payload = {
      pub_id : pub_id,
      token: this.token
    }
    this.pubProv.getPub(payload).subscribe((resp)=>{
      console.log("RESP",resp);
      
      this.loadProvider.dismiss().then(()=>{
        this.pub = resp['pub'];
        this.navCtrl.push("PubPage", {pub : this.pub});
      });
    },
    (error)=>{
      this.loadProvider.dismiss().then(()=>{
        console.log("Error loading",error);
        
      });
    });
  }
  
  
}
