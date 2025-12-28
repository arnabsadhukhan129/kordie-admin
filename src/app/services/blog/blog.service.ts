import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');

  constructor(
    private __http: HttpClient
  ) { }

   //List............
   getList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/blog/get-all`;
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

  //Delete data...........
  delete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');

    return this.__http.delete(`${this.apiUrl}/blog/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  //Add Data......
  create(data: any): Observable<any> {
    // console.log("data111111......",data);
    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/blog/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Data.........
  edit(id:any,data:any): Observable<any> {
    // console.log("data111111......");
    data.forEach((value:any, key:any) => {
      console.log(`${key}:`, value);
    });
    this.portal_login_token = localStorage.getItem('portal_login_token');

    return this.__http.put(`${this.apiUrl}/blog/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Details By Id.............
  getDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/blog/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Feature Status Update.........
  featureStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/blog/${id}/toggle-feature`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }
  
}
