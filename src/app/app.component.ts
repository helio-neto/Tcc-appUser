import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  rootPage: any;
  isLoggedIn: boolean = false;
  
  pages: Array<{title: string, component: any, icon: string}>;
  accountMenuItems: Array<{title: string, component: any, icon: string}>;
  helpMenuItems: Array<{title: string, component: any, icon: string}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, public storage: Storage, 
              public events: Events, public alertCtrl: AlertController,
              public connectProv: ConnectivityProvider) {

      this.initializeApp();
      
      this.pages = [
        { title: 'Bem-Vindo', component: "WelcomePage", icon: 'images' },
        { title: 'Cervejas / Pubs', component: HomePage, icon: 'map' }
      ];
      
      this.accountMenuItems = [
        {title: 'Cadastro', component: "RegisterPage", icon: 'ios-contact'},
        {title: 'Login', component: "LoginPage", icon: 'log-in'},
      ];
      
      this.helpMenuItems = [
        {title: 'Info', component: "WelcomePage", icon: 'bookmark'},
        {title: 'About', component: "WelcomePage", icon: 'information-circle'},
      ];
      
      this.events.subscribe("PubPage", (pub)=>{
        this.nav.push("PubPage", {pub : pub});
      });
      
      this.events.subscribe("login", ()=>{
        this.isLoggedIn = true;
        this.pages = [
          { title: 'Perfil', component: "ProfilePage", icon: 'images' },
          { title: 'Cervejas / Pubs', component: HomePage, icon: 'map' }
        ];
      });
      
    }
    // Initializing the App 
    // Checking the storage for login status and user data
    initializeApp() {
      this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.storage.get('userdata').then((val)=>{
          if(val){
            console.log("Storage ->",val);
            if(val.isLoggedIn){
              this.isLoggedIn = true;
              this.rootPage = "ProfilePage";
              this.pages = [
                { title: 'Perfil', component: "ProfilePage", icon: 'images' },
                { title: 'Cervejas / Pubs', component: HomePage, icon: 'map' }
              ];
              this.splashScreen.hide();
            }else{
              this.rootPage = "WelcomePage";
              this.splashScreen.hide();
            }      
          }else{ 
            console.log("Sem registro prévio no sistema");
            this.rootPage = "WelcomePage";
            this.splashScreen.hide();
          }
        })
      });
    }
    
    // Open Page Handler 
    // Check for Gps status if entering Home/Map Page
    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      if(page.component == HomePage){
        this.connectProv.gpsStatus().then((status)=>{
          console.log("Status",status);
          if(status){
            let gpsType = "gps";
            this.nav.setRoot(page.component,gpsType);
            this.splashScreen.show();
          }else{
            return new Promise((resolve, reject) => {
              let confirm = this.alertCtrl.create({
                title: 'Gps desabilitado',
                message: 'Deseja habilitar gps?',
                buttons: [{
                  text: 'Sim',
                  handler: () => {
                    this.connectProv.getGps().then((gps)=>{
                      let gpsType = (gps == "location_off") ? "fixed" : "gps";
                      console.log("getgpsreturn",gpsType);
                      this.nav.setRoot(page.component,gpsType);
                      this.splashScreen.show();
                      resolve(true);
                    })
                    
                  },
                }, {
                  text: 'Não',
                  role: 'cancel',
                  handler: () => {
                    let gpsType = "fixed";
                    confirm.onDidDismiss(()=>{
                      this.nav.setRoot(page.component,gpsType);
                      this.splashScreen.show();
                      resolve(true);
                    })
                  }
                }],
              });
              confirm.present();
            }) 
          }
        });
        
      }else{
        this.nav.setRoot(page.component);
      }
    }
    // Logout Event Handler
    logout(){
      this.storage.set('userdata',{
        user: null,
        isLoggedIn: false
      });
      this.isLoggedIn = false;
      this.pages = [
        { title: 'Bem-Vindo', component: "WelcomePage", icon: 'images' },
        { title: 'Cervejas / Pubs', component: HomePage, icon: 'map' }
      ];
      this.nav.setRoot("WelcomePage");
    }
  }
  