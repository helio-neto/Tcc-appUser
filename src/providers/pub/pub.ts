import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class PubProvider {
  
  data : any;
  //private urlAPI = "https://hasbeerv1.herokuapp.com/api/pub";
  // private urlAPI = "http://localhost:8080/api/pubs";
  private urlAPI = "https://tcchasbeeer.herokuapp.com/api/pubs";

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('PubProvider Brewing!');
    this.getStorageData();
  }
  // 
  async getStorageData(){
    let data = await this.storage.get("userdata");
    if(data){
      this.data = data;
      return data;
    }
    return null;
  }
  // 
  getPubs(): Observable<any[]>{
    return this.http.get(this.urlAPI)
      .map(res => <any[]>res)
      .catch((erro:any)=>Observable.throw(erro));
  }
  getPub(pub_id): Observable<any[]>{
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.data.token}`
      }),
      body: pub_id
    };
    return this.http.get(`${this.urlAPI}/${pub_id}`,options)
      .map(res => <any[]>res)
      .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  searchByBeer(beer_name){
    return this.http.get(this.urlAPI+"/search/"+beer_name)
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }


}
