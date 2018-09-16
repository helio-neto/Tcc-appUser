import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {
  data : any;
  //private urlAPI = "https://hasbeerv1.herokuapp.com/api/pub";
  private urlAPI2 = "https://tcchasbeeer.herokuapp.com/api/pubs";

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  // 
  register(user){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");

    return this.http.post(this.urlAPI2+"/register",user,{headers:headers})
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }
  // 
  login(user){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");

    return this.http.post(this.urlAPI2+"/login", user,{headers:headers})
    .map(res => <any[]>res)
    .catch((erro:any)=>Observable.throw(erro));
  }
}
