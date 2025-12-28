import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');
  login_role: any = localStorage.getItem('login_role');

  constructor(private __http: HttpClient) { }

  getResourcesList(): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');

    return this.__http.get(`${this.apiUrl}${this.login_role}/resources?limit=50&page=1`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }

    });
  }


  getRoleList(param: any = null,): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');
    let url: string = `${this.apiUrl}${this.login_role}/roles`;
    const formData: URLSearchParams = new URLSearchParams();

    if(param!=null)
    {
            for (let key in param) {
              formData.set(key, param[key])
            }
            
            if (formData) {
              url = url + '?' + formData.toString()
            }
    }

    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }

    });
  }

  getRoleDetail(id: any): Observable<any> {

    let portal_login_token = localStorage.getItem('portal_login_token');
    let login_role = localStorage.getItem('login_role');

    return this.__http.get(`${this.apiUrl}${login_role}/role/${id}`, {
      headers: { Authorization: 'Bearer ' + portal_login_token }

    });
  }

  editRole(id: any, data: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');

    return this.__http.post(`${this.apiUrl}${this.login_role}/role-permission-update/${id}`, data, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }


  addRole(data: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');

    console.log(data);

    return this.__http.post(`${this.apiUrl}${this.login_role}/role`, data, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  delRole(id: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');

    return this.__http.delete(`${this.apiUrl}${this.login_role}/role/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  // changeStatus(id:any): Observable<any> {

  //   const portal_login_token = localStorage.getItem('portal_login_token');
  //   const login_role = localStorage.getItem('login_role');
  //   let data : any = {};
    
  //   return this.__http.patch(`${this.apiUrl}${login_role}/role/${id}`, data, {
  //     headers: {
  //       Authorization: 'Bearer '+portal_login_token
  //     },
  //   });    
  // }


}
