import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');

  constructor(private __http: HttpClient) { }

   //Add Topic Data......
   createTopicData(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/topic/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Topic Data.........
  editTopicData(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/topic/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Add Time Data......
  createTimeData(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/time/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Time Data.........
  editTimeData(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/time/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

   //Add Goal Data......
   createGoalData(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/goal/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Goal Data.........
  editGoalData(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/goal/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

   //Add Type Data......
   createTypeData(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/type/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Type Data.........
  editTypeData(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/type/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Add Taught By......
  createTaughtByData(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/taughtby/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Taught By.........
  editTaughtByData(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/taughtby/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Add Industry By......
  createIndustryByData(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/industry/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Industry By.........
  ediIndustryByData(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/industry/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Add Industry By......
  createInterestByData(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/interest/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Industry By.........
  ediInterestByData(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/interest/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Add Blog Type......
  createBlogType(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/blogtype/create`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

  //Edit Blog Type.........
  editBlogType(id:any,data:any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/blogtype/update/${id}`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

}
