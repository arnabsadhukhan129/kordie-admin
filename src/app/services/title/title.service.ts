import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');
  login_role: any = localStorage.getItem('login_role');

  constructor(private __http: HttpClient) { }

   //Add Title......
   createTitle(data: any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/title/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Title.........
  editTitle(id:any,data:any): Observable<any> {

    this.portal_login_token = localStorage.getItem('portal_login_token');

    return this.__http.put(`${this.apiUrl}/title/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Title List.........
  getTitleListWithParam(param: any, searchType:string='', searchVal:string=''): Observable<any> {
    const formData: URLSearchParams = new URLSearchParams();
    const portal_login_token = localStorage.getItem('portal_login_token');
    for (let key in param) {
      formData.set(key, param[key])
    }
    let url: string = `${this.apiUrl}/title/get-all`;
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


  //Get Details By Id.............
  getTitleDetail(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/title/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }
}
