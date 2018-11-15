import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';
import { UserProvider } from './../../providers/user/user';
import { LoadingProvider } from './../../providers/loading/loading';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  userForm : FormGroup;
  submitAttempt: boolean = false;
  addressConfirm: boolean = false;
  user: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, 
              public toastCtrl: ToastController, public navParams: NavParams, 
              private formBuilder: FormBuilder,public googleMapsProvider: GoogleMapsProvider, 
              public userProvider:UserProvider, private storage: Storage, 
              public splashScreen: SplashScreen, public events: Events,
              public loadProvider: LoadingProvider ) {
    this.userForm = this.formBuilder.group({
      consumername: ['', Validators.required],
      location: formBuilder.group({
        street: [''],
        hood: [''],
        lat: [''],
        lng: [''],
        city: [''],
        uf: ['']
      }),
      phone: [''],
      celphone: ['', Validators.required],
      info: [''],
      email: ['',Validators.compose([Validators.required, Validators.email]) ],
      password:['',Validators.compose([Validators.required, Validators.minLength(8)])],
      photo: ['']
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
  save(){
    if(!this.userForm.valid){
        console.log("Formulário inválido");   
        this.submitAttempt = true; 
    }
    else {
      this.loadProvider.presentWithMessage("Cevando informações....");
      this.submitAttempt = false;
      console.log("Form success ->",this.userForm.value);
      this.userProvider.register(this.userForm.value).subscribe(
          (res)=>{
            this.loadProvider.dismiss().then(()=>{
              console.log("RESPONSE REGISTER ->",res);
              if(res.status == "success"){
                let message = `${res.message}`;
                this.presentToast(message,"success");
                this.storage.set('userdata',{
                  user: res.consumer,
                  isLoggedIn: true,
                  token: res.token
                });
                setTimeout(() => {
                  this.events.publish("login");
                    this.navCtrl.setRoot("ProfilePage");
                }, 4000);
              }else{
                let message = `${res.message}`;
                this.presentToast(message,"error");
              }
            })
          },
          (error)=>{
            this.loadProvider.dismiss().then(()=>{
              console.log("Error",error);
              let message = JSON.stringify(error);
              this.presentToast(message,"error");
            })
          }
        );
    }
  }

}
