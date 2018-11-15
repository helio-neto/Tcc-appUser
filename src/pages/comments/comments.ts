import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PubProvider } from '../../providers/pub/pub';
import { LoadingProvider } from './../../providers/loading/loading';
@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  comments: any;
  pub_id: any;
  message: string;
  userdata: any;
  userReady: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
              public toastCtrl: ToastController, public platform: Platform, private pubProv: PubProvider,
              public loadProvider: LoadingProvider) {
        this.comments = this.navParams.get('comments');
        this.pub_id = this.navParams.get('pub_id');
        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage 111');
    this.platform.ready().then(()=>{
      this.loadProfile();
    });
  }
  // 
  ionViewWillLeave(){
    this.navCtrl.getPrevious().data.pub.comments = this.comments;
  }
  // 
  loadProfile(){
    this.storage.get("userdata").then((val)=>{
      this.userdata = val;
      this.userReady = true;
      console.log("Profile User Data ->",this.userdata);
    });
  }
  // 
  sendComment(){
    this.loadProvider.presentWithMessage("Cevando comentários...");
    let data = {
      comment:[
        {
        user: this.userdata.user.consumername,
        message: this.message
        }
      ],
      pub_id: this.pub_id
    }
    console.log("Comments ->",this.comments);
    this.pubProv.addComment(data).then(
      (resp)=>{
      this.loadProvider.dismiss().then(()=>{
        console.log("Comment Add Response ->",resp);
        this.comments = (resp['pub']['comments']);
        console.log("Comments after",this.comments);
        this.presentToast(resp['message'],"success");
      }); 
    },
    (error)=>{
      this.loadProvider.dismiss().then(()=>{
        console.log("Comment Add ERROR ->",error);
        this.presentToast(JSON.stringify(error),"success");
      });
    }).catch((error)=>{
      this.loadProvider.dismiss().then(()=>{
        console.log("Comment Add ERROR ->",error);
        this.presentToast(JSON.stringify(error),"success");
      });
    });
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
}
