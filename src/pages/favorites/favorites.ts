import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, Navbar  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PubProvider } from './../../providers/pub/pub';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, 
              public modalCtrl: ModalController, private storage: Storage, private pubProv: PubProvider) {

      this.initFav();
  }
  // 
  initFav(){
    this.platform.ready().then(()=>{
      this.storage.get("userdata").then((val)=>{
        console.log("Favorites Val",val.user.favorites);
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
    this.pubProv.getPub(pub_id).subscribe((resp)=>{
      this.pub = resp['pub'];
      this.navCtrl.push("PubPage", {pub : this.pub});
    })
  }
  
  
}
