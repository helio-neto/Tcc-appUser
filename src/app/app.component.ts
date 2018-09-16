import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';

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

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public storage: Storage, public events: Events) {
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
        {title: 'Welcome', component: "WelcomePage", icon: 'bookmark'},
        {title: 'About', component: "WelcomePage", icon: 'information-circle'},
    ];
 
      this.events.subscribe("PubPage", (pub)=>{
        this.nav.push("PubPage", {pub : pub});
      });

      this.events.subscribe("login", ()=>{
        this.isLoggedIn = true;
      });

  }

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
            this.rootPage = HomePage;
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

  // 
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.splashScreen.show();
  }
  // 
  logout(){
      this.storage.set('userdata',{
        pub: null,
        isLoggedIn: false
      });
      this.isLoggedIn = false;
      this.nav.setRoot("WelcomePage");
  }
}
