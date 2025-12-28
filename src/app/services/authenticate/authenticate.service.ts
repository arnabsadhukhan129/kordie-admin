import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  apiUrl: string = environment.api_url+environment.api_version;
  constructor(private __http:HttpClient) 
  { }

  isLoggedIn(){
    if(localStorage.getItem('portal_login_token')) 
    {
      return true;
    }
    return false;
  }

  login(data : any):Observable<any>{
    return this.__http.post(`${this.apiUrl}/auth/admin`,data);
  }

  sanaLogin(data:any):Observable<any>{
    return this.__http.post(`https://kordie-sandbox.sana.ai/api/token`,data);
  }


}
