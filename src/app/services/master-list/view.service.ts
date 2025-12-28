import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');

  constructor(private __http: HttpClient) { }

   //Get Topic Details By Id.............
   getTopicDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/topic/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Time Details By Id.............
  getTimeDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/time/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Goal Details By Id.............
  getGoalDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/goal/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Goal Details By Id.............
  getTypeDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/type/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Taught By Details By Id.............
  getTaughtDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/taughtby/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Industry By Details By Id.............
  getIndustryDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/industry/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Industry By Details By Id.............
  getInterestDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/interest/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Get Blog Type By Details By Id.............
  getBlogTypeDetailById(id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/blogtype/get-single/${id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }
}
