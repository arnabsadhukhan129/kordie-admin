import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string = environment.api_url+environment.api_version;
  portal_login_token : any = localStorage.getItem('portal_login_token');
  login_role : any = localStorage.getItem('login_role');

  constructor(private __http:HttpClient) 
  { }

  listAdminUser(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    const login_role = localStorage.getItem('login_role');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}${login_role}/users`;
    if (formData) {
      url = url + '?' + formData.toString()
    }

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }
    
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token },
    });
  }

  getRoleList(param:any){
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    const login_role = localStorage.getItem('login_role');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}${login_role}/acive-roles`;
    if (formData) {
      url = url + '?' + formData.toString()
    }
    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token },
    });
  }
  
  // detailsUser(id:any): Observable<any> {
    
  //   return this.__http.get(`${this.apiUrl}/user/detailsUser/${id}`,{
      
  //   });
  // }

  getUserDetail(id:any): Observable<any> {    
    
    this.portal_login_token = localStorage.getItem('portal_login_token');

    return this.__http.get(`${this.apiUrl}${this.login_role}/user/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
      
    });
  }

  editUser(id:any,data:any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');
    
    return this.__http.put(`${this.apiUrl}${this.login_role}/user/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  delUser(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');

    return this.__http.delete(`${this.apiUrl}${this.login_role}/user/${id}`, {
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  createUser(data: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    this.login_role = localStorage.getItem('login_role');

    return this.__http.post(`${this.apiUrl}${this.login_role}/user`, data, {
      headers: {
        Authorization: 'Bearer '+this.portal_login_token
      },
    });
  }

  detailsUser(): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    
    return this.__http.get(`${this.apiUrl}/auth/profile`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  updateProfile(data: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    
    return this.__http.put(`${this.apiUrl}/auth/profile`, data, {
      headers: {
        Authorization: 'Bearer '+this.portal_login_token
      },
    });    
  }

  forgotPassword(data: any): Observable<any> {

    return this.__http.post(`${this.apiUrl}/auth/forget-password`, data);    
  }

  resetPassword(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-reset-token': token
    });
    return this.__http.post(`${this.apiUrl}/auth/reset-password`, data, {headers});    
  }

  changePassword(data: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    
    return this.__http.post(`${this.apiUrl}/auth/change-password`, data, {
      headers: {
        Authorization: 'Bearer '+this.portal_login_token
      },
    });    
  }

  getUserCount(): Observable<any> {
    const portal_login_token = localStorage.getItem('portal_login_token');
    const login_role = localStorage.getItem('login_role');
    let data = {};
    
    return this.__http.get(`${this.apiUrl}${login_role}/usercount`,  {
      headers: {
        Authorization: 'Bearer '+portal_login_token
      },
    });  
  }

  changeStatus(id:any): Observable<any> {

    const portal_login_token = localStorage.getItem('portal_login_token');
    const login_role = localStorage.getItem('login_role');
    let data : any = {};
    
    return this.__http.patch(`${this.apiUrl}${login_role}/user/${id}`, data, {
      headers: {
        Authorization: 'Bearer '+portal_login_token
      },
    });    
  }

  dashboard(): Observable<any>{
    const portal_login_token = localStorage.getItem('portal_login_token');
    const login_role = localStorage.getItem('login_role');
    let data : any = {};

   return this.__http.get(`${this.apiUrl}/auth/admin/dashboard`, {
      headers: {
        Authorization: 'Bearer '+ portal_login_token
      },
    });   
  }
}
