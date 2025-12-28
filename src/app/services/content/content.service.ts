import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  apiUrl: string = environment.api_url + environment.api_version;

  constructor(private __http: HttpClient) 
  { }

  getContentList(param: any = null, searchType:string='', searchVal:string=''): Observable<any> {

    let portal_login_token = localStorage.getItem('portal_login_token');
    let login_role = localStorage.getItem('login_role');
    let url: string = `${this.apiUrl}${login_role}/contents`;
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

    if(searchType!='' && searchVal!='')
    {
        url = url+'&'+searchType+'='+searchVal;
    }

    return this.__http.get(url, {
      headers: { Authorization: 'Bearer ' + portal_login_token }

    });
  }


  createContent(data: any): Observable<any> {

    let portal_login_token = localStorage.getItem('portal_login_token');
    let login_role = localStorage.getItem('login_role');

    return this.__http.post(`${this.apiUrl}${login_role}/content`, data, {
      headers: {
        Authorization: 'Bearer ' + portal_login_token
      },
    });
  }


  getContentDetail(id: any): Observable<any> {

    let portal_login_token = localStorage.getItem('portal_login_token');
    let login_role = localStorage.getItem('login_role');

    return this.__http.get(`${this.apiUrl}${login_role}/content/${id}`, {
      headers: { Authorization: 'Bearer ' + portal_login_token }

    });
  }


  delContent(id: any): Observable<any> {

    let portal_login_token = localStorage.getItem('portal_login_token');
    let login_role = localStorage.getItem('login_role');

    return this.__http.delete(`${this.apiUrl}${login_role}/content/${id}`, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }


  editContent(id: any, data: any): Observable<any> {

    let portal_login_token = localStorage.getItem('portal_login_token');
    let login_role = localStorage.getItem('login_role');

    return this.__http.put(`${this.apiUrl}${login_role}/content/${id}`, data, {
      headers: { Authorization: 'Bearer ' + portal_login_token }
    });
  }

  changeStatus(id:any): Observable<any> {

    const portal_login_token = localStorage.getItem('portal_login_token');
    const login_role = localStorage.getItem('login_role');
    let data : any = {};
    
    return this.__http.patch(`${this.apiUrl}${login_role}/content/${id}`, data, {
      headers: {
        Authorization: 'Bearer '+portal_login_token
      },
    });    
  }


  getContentDetailBySlug(slug: string): Observable<any> {

    return this.__http.get(`${this.apiUrl}content-detail?slug=${slug}`);
  }



}
