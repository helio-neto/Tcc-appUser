import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { UserProvider } from './../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-pub-beer-list',
  templateUrl: 'pub-beer-list.html',
})
export class PubBeerListPage {
  beers: any;
  beersFav: any;
  selectedItem: any;
  isLoggedIn: boolean;
  isFavorite: boolean;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public splashScreen: SplashScreen,
    public toastCtrl: ToastController, private storage: Storage, private userProv: UserProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.beers = navParams.get('beers');
    console.log("Beers .:.",this.beers);
    this.checkUser();
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
    // this.checkUser();
  }
  // 
  checkUser(){
    this.storage.get("userdata").then((val)=>{
      console.log("STORAGE", val);
      console.log("Beer .:.",this.selectedItem);
      if(val.isLoggedIn){
          this.isLoggedIn = true;
          this.beersFav = val.user.favorites.beers;
          console.log("Check beersfav",this.beersFav);
          if(this.selectedItem){
            let isFav = this.beersFav.filter(
              (beer) => {
                return beer.name === this.selectedItem.name;
              }
            );
            console.log("ISFAV",isFav);
            if(isFav.length>0){
              this.isFavorite = true;
              console.log("Is Favorite",isFav);
            }else{
              this.isFavorite = false;
              console.log("Not Favorite",isFav);
            }
          }
          
      }else{
        this.isLoggedIn = false;
      }
    })
  }
  // 
  doFavorites(action){
    if(action == "delete"){
      let beer = this.beersFav.filter(
        (beer) => {
          return beer.name === this.selectedItem.name;
        }
      );
      let data = {
        action: action,
        type: "beers",
        beers:beer
      }
      console.log("FAVORITES DELETE",data);
      this.userProv.removeFavorite(data).then((resp)=>{
        console.log("DELETE FAV Return",resp);
        if(resp['status'] == "success"){
            this.storage.get("userdata").then((val)=>{
              val.user.favorites = resp["favorites"];
              this.storage.set("userdata",val);
              this.isFavorite = false;
            });
            this.presentToast(resp['message'],"success");
        }else{
          this.presentToast(resp['message'],"error");
        }
      });
    }else if (action == "put"){
      let data = {
        action: action,
        type: "beers",
        beers:[{
            name: this.selectedItem.name,
            style: this.selectedItem.style,
            ibu: this.selectedItem.ibu,
            abv: this.selectedItem.abv
        }]
      }
      console.log("FAVORITES ADD",data)
      this.userProv.addFavorite(data).then((resp)=>{
        console.log("ADD FAV Return",resp);
        if(resp['status'] == "success"){
            this.storage.get("userdata").then((val)=>{
              val.user.favorites = resp["favorites"];
              this.storage.set("userdata",val);
              this.isFavorite = true;
            });
            this.presentToast(resp['message'],"success");
        }else{
          this.presentToast(resp['message'],"error");
        }
      });
    }
  }
  // 
  // 
  presentToast(message,cssStyle) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      cssClass: cssStyle
    });
  
    toast.onDidDismiss(() => {
      
    });
  
    toast.present();
  }
}
