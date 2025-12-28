import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');

  constructor(
    private __http: HttpClient
  ) { }

   //Add Data......
   create(data: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/focus/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //List............
  getList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/focus/list`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

   //Delete data...........
   delete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/focus/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  //Get Details By Id.............
  getDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/focus/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Edit Data.........
  edit(id:any,data:any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');

    return this.__http.put(`${this.apiUrl}/focus/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }
}
