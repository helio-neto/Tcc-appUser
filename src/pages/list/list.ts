import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { PubProvider } from '../../providers/pub/pub';
import { LocationProvider } from '../../providers/location/location';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  afterSearch: any = [];
  originData: any = [];
  pubs: any;
  erro: any;
  query: string = '';
  places: any = [];
  searchON: boolean = false;
  cancelText: string = "Cancelar";
  searching: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,
              public pubProvider: PubProvider, public locationProv: LocationProvider) {
    
  }

  // 
  ionViewDidLoad() {
    console.log('ionViewDidLoad List2pagePage');
    this.events.subscribe("search",(search)=>{
        this.searchON = search;
    });
    this.pubs = this.locationProv.pubsAfter;
    this.originData = this.pubs;
    console.log(this.pubs);
  }
  //
  openPubDetails(pub) {
    console.log(pub);
    this.events.publish("PubPage",pub);
  }
  
  onInput(event){
    //console.log("Search Event",event);
    //console.log("Query",this.query);
    if(this.query == ''){
      this.pubs = this.originData;
    }else{
      this.pubProvider.searchByBeer(this.query).subscribe(
        (data) => {
          this.places = data.result;
          this.afterSearch = [];
          this.pubs.forEach((e1)=>this.places.forEach((e2)=> {
            if(e1.pubname.toLowerCase() == e2.pubname.toLowerCase()){
              console.log(e1.pubname);
              this.afterSearch.push(e1);
            }
          }));
          this.pubs = this.afterSearch;
          //console.log("SEARCH RESULT ->",this.afterSearch);
          
        },
        (erro) => this.erro = erro
      );
    }
    
  }
  onCancel(event){
    this.pubs = this.originData;
    console.log("Cancel Event",event);
  }
  searchBarList(){
    if(this.searchON){
      this.searchON = false;
    }else{
      this.searchON = true;
    }
    this.events.publish("searchHome",this.searchON);
 }
}
