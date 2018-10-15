import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';
import { UserProvider } from './../../providers/user/user';

import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
  userForm : FormGroup;
  submitAttempt: boolean = false;
  addressConfirm: boolean = false;
  user: any;
  formReady: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, 
    public toastCtrl: ToastController, public navParams: NavParams, 
    private formBuilder: FormBuilder,public googleMapsProvider: GoogleMapsProvider, 
    public userProvider:UserProvider, private storage: Storage, 
    public splashScreen: SplashScreen, public events: Events, public platform: Platform ) {
      this.platform.ready().then(()=>{
        this.storage.get("userdata").then((val)=>{
          this.user = val.user;
          console.log("User Data ->",this.user);
          this.userForm = this.formBuilder.group({
            id:[this.user._id],
            consumername: [this.user.consumername, Validators.required],
            location: formBuilder.group({
              street: [this.user.location.street],
              hood: [this.user.location.hood],
              lat: [this.user.location.lat],
              lng: [this.user.location.lng],
              city: [this.user.location.city],
              uf: [this.user.location.uf]
            }),
            phone: [this.user.phone],
            celphone: [this.user.celphone, Validators.required],
            info: [this.user.info],
            email: [this.user.email,Validators.compose([Validators.required, Validators.email]) ],
            photo: [this.user.photo]
          });
          this.formReady = true;
        });
      });
      
  }
// 
presentConfirmAddress(address) {
  let alert = this.alertCtrl.create({
    title: 'Você confirma este endereço?',
    message:  `<p>Endereço: ${address.street}</p>
                <p>Bairro: ${address.hood}</p>
                <p>Cidade: ${address.city}</p>
                <p>Uf: ${address.uf}</p>`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          this.userForm.get("location.street").setErrors({
            'incorrect': true
          });
          this.addressConfirm = false;
        }
      },
      {
        text: 'Confirmar',
        handler: () => {
          this.addressConfirm = true;
          this.userForm.get("location.street").updateValueAndValidity();
          this.userForm.get("location").setValue({ 
              street: address.street,
              hood: address.hood,
              lat: address.lat,
              lng: address.lng,
              city: address.city,
              uf: address.uf    
          });
        }
      }
    ]
  });
  alert.present();
}
// 
presentConfirmEdit() {
  let alert = this.alertCtrl.create({
    title: 'Você confirma estes dados?',
    message:  `<p>Nome Completo: ${this.userForm.get("consumername").value}</p>
                <p>Telefone: ${this.userForm.get("phone").value}</p>
                <p>Celular: ${this.userForm.get("celphone").value}</p>
                <p>Info: ${this.userForm.get("info").value}</p>
                <p>Email: ${this.userForm.get("email").value}</p>
                <p>Foto: ${this.userForm.get("photo").value}</p>
                <p>Endereço: ${this.userForm.get("location.street").value}</p>`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
         
        }
      },
      {
        text: 'Confirmar',
        handler: () => {
          this.edit();
        }
      }
    ]
  });
  alert.present();
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
ionViewDidLoad() {
  this.splashScreen.hide();
}
// 
getUserAddress(){
  let address = this.userForm.get("location.street").value;
  console.log("Address ->",address)
  this.googleMapsProvider.getAddressGeoCode(address).then((result)=>{
    this.presentConfirmAddress(result);
    console.log("Get Address ->",result);
  }).catch((error)=>{
    console.log("Erro coletando endereço ->",error);
  });
}
// 
edit(){
  if(!this.userForm.valid){
      console.log("Formulário inválido");   
      this.submitAttempt = true; 
  }
  else {
    this.submitAttempt = false;
    console.log("success!")
    console.log("Form ->",this.userForm.value);
    this.userProvider.edit(this.userForm.value).then((resp)=>{
      console.log("Response Edit ->",resp);
      if(resp['status']=="success"){
        delete resp["consumer"]['hash'];
        delete resp["consumer"]['salt'];
        this.presentToast(resp["message"], "success");
        setTimeout(() => {
          this.storage.get("userdata").then((val)=>{
            val.user = resp["consumer"];
            this.storage.set("userdata",val);
            this.navCtrl.setRoot("ProfilePage"); 
          })
        }, 3000);
        
      }else{
        this.presentToast(resp["message"], "error");
      }
    }).catch((error)=>{
      this.presentToast(error.statusText, "error");
      console.log("ERROR ERROR",error)
    })
  }
}

}
