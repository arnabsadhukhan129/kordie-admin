import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');

  constructor(private __http: HttpClient) { }

   //Topic List.........
   tpicList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/topic/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

  //Time To Complete List.........
  timeList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/time/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

  //Goal List.........
  goalList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/goal/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

  //Type List.........
  typeList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/type/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

  //Taught by................
  taughtList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/taughtby/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

  //Industry................
  industryList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/industry/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

   //Interest................
   interestList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/interest/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

   //Blog Type................
   blogTypeList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/blogtype/get-all`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }
}
