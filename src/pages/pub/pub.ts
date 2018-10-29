import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-pub',
  templateUrl: 'pub.html',
})
export class PubPage {

  pub: any;
  isLoggedIn: boolean;
  isFavorite: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProv: UserProvider,
              public toastCtrl: ToastController, private storage: Storage) {
    this.pub = navParams.data.pub;
    console.log("Pub ID",this.pub);
    this.checkUser();
  }
  // 
  ionViewDidLoad() {
    console.log('ionViewDidLoad PubPage');
    this.navCtrl.getAllChildNavs();
  }
  // 
  openMenu(){
    this.navCtrl.push('PubBeerListPage', { 'beers': this.pub.beers });
  }
  // 
  checkUser(){
    this.storage.get("userdata").then((val)=>{
      console.log("STORAGE", val);
      if(val.isLoggedIn){
          this.isLoggedIn = true;
          let pubsFav = val.user.favorites.pubs;
          console.log("Check User",pubsFav);
          let isFav = pubsFav.filter(
            (pub) => {
              return pub._id === this.pub._id;
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
      }else{
        this.isLoggedIn = false;
      }
    })
  }
  // 
  doFavorites(action){
    let data = {
      action: action,
      type: "pubs",
      pubs:[{
          _id: this.pub._id,
          name: this.pub.pubname,
          photo: this.pub.photo
      }]
    }
    if(action == "delete"){
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
  // 
  openComments(){
    this.navCtrl.push("CommentsPage", {comments: this.pub.comments,pub_id:this.pub._id});
  }
}
