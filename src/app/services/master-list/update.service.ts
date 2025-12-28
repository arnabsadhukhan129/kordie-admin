import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');

  constructor(
    private __http: HttpClient
  ) { }

  //Topic Status Update.........
  topicStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/topic/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Topic data delete.........
  topicByDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/topic/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  //Time To Complete Status Update.........
  timeStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/time/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Time To Complete data delete.........
  timeByDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/time/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  //Goal Status Update.........
  goalStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/goal/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

   //Goal data delete.........
   goalDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/goal/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

   //Type Status Update.........
   typeStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/type/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Type data delete.........
  typeDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/type/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

   //Taught By Status Update.........
   taughtByStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/taughtby/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Taught By data delete.........
  taughtByDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/taughtby/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  //Industry Status Update.........
  industryStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/industry/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Industry data delete............
  industryDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/industry/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }


  //Interest Status Update.........
  interestStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/interest/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Interest data delete............
  interestDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/interest/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  //Blog Type Status Update.........
  blogTypeStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/blogtype/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Blog Type data delete............
  blogTypeDelete(id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.delete(`${this.apiUrl}/blogtype/delete/${id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }
  
}
