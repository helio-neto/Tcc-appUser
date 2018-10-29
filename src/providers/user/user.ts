import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {
  data : any;
  //private urlAPI = "https://hasbeerv1.herokuapp.com/api/pub";
  // private urlAPI = "http://localhost:8080/api/consumer";
  private urlAPI = "https://tcchasbeeer.herokuapp.com/api/consumer";

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello UserProvider Provider');
  }
  async getStorageData(){
    let data = await this.storage.get("userdata");
    if(data){
      return data
    }
    return null
  }
  // 
  register(user){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");

    return this.http.post(this.urlAPI+"/registerAuth",user,{headers:headers})
          .map(res => <any[]>res)
          .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  login(user){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");

    return this.http.post(this.urlAPI+"/loginAuth", user,{headers:headers})
          .map(res => <any[]>res)
          .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  async edit(user){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");
    console.log("Editando consumidor",user);
    let userStorage = await this.getStorageData();
    user.token = userStorage.token;
    return new Promise((resolve, reject)=>{
      this.http.put(`${this.urlAPI}/${user.id}`, user,{headers:headers})
        .subscribe(result =>{
          resolve(result);
        },
        error=>{
          console.log("ERRO na requisiçao",error);
          reject(error);
        });
    });
  }
  // 
  async addFavorite(data){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");
    console.log("Adicionando favorito",data);
    let userStorage = await this.getStorageData();
    data.token = userStorage.token;
    data.consumer_id = userStorage.user._id;
    return new Promise((resolve, reject)=>{
      this.http.put(`${this.urlAPI}/favorites/${data.type}/${data.consumer_id}`, data,{headers:headers})
        .subscribe(result =>{
          resolve(result);
        },
        error=>{
          console.log("ERRO na requisiçao",error);
          reject(error);
        });
        
    });
  }
  // 
  async removeFavorite(data){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");
    console.log("REMOVENDO favorito",data);
    let userStorage = await this.getStorageData();
    data.token = userStorage.token;
    data.consumer_id = userStorage.user._id;
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data,
    };
    return new Promise((resolve, reject)=>{
      this.http.delete(`${this.urlAPI}/favorites/${data.type}/${data.consumer_id}`, options)
        .subscribe(result =>{
          resolve(result);
        },
        error=>{
          console.log("ERRO na requisiçao",error);
          reject(error);
        });
    });
    
  }
  // 
  
}
