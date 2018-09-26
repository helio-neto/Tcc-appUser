import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {
  data : any;
  //private urlAPI = "https://hasbeerv1.herokuapp.com/api/pub";
  //private urlAPI = "http://localhost:8080/api/consumer";
  private urlAPI = "https://tcchasbeeer.herokuapp.com/api/consumer";

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  // 
  register(user){
    let headers = new HttpHeaders();
    headers.append("Content-type","application/json");

    return this.http.post(this.urlAPI+"/register",user,{headers:headers})
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
}
