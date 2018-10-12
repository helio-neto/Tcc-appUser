import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  
  userdata: any;
  userReady: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    public platform: Platform) {
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfilePage');
      this.platform.ready().then(()=>{
        this.loadProfile();
      });
    }
    // 
    loadProfile(){
      this.storage.get("userdata").then((val)=>{
        this.userdata = val;
        this.userReady = true;
        console.log("User Data ->",this.userdata);
      });
    }
    goEdit(){
      this.navCtrl.setRoot("EditPage");
    }
    
  }
  