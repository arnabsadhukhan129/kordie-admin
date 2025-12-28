import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl: string = environment.api_url + environment.api_version;
  portal_login_token: any = localStorage.getItem('portal_login_token');

  constructor(
    private __http: HttpClient
  ) { }

    //List............
    getList(param: any, searchType:string='', searchVal:string=''): Observable<any> {
      console.log("GET LIST IN THE PRODUCT");
      
      const formData: URLSearchParams = new URLSearchParams();
      const portal_login_token = localStorage.getItem('portal_login_token');
      for (let key in param) {
        formData.set(key, param[key])
      }
      let url: string = `${this.apiUrl}/product/get-all`;
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
      return this.__http.delete(`${this.apiUrl}/product/delete/${id}`, {
        headers: { Authorization: 'Bearer ' + this.portal_login_token }
      });
    }
  
    //Add Data......
    create(data: any): Observable<any> {
  
      this.portal_login_token = localStorage.getItem('portal_login_token');
      return this.__http.post(`${this.apiUrl}/product/create`, data, {
        headers: {
          Authorization: 'Bearer ' + this.portal_login_token
        },
      });
    }
  
    //Edit Data.........
    edit(id:any,data:any): Observable<any> {
  
      this.portal_login_token = localStorage.getItem('portal_login_token');
  
      return this.__http.put(`${this.apiUrl}/product/update/${id}`,data,{
        headers:{Authorization: 'Bearer '+this.portal_login_token}
      });
    }
  
    //Get Details By Id.............
    getDetailById(id:any): Observable<any> {    
      this.portal_login_token = localStorage.getItem('portal_login_token');
      return this.__http.get(`${this.apiUrl}/product/get-single/${id}`,{
        headers:{Authorization: 'Bearer '+this.portal_login_token}
      });
    }

    //Get Details By Slug.............
    getDetailBySlug(slug:any): Observable<any> {    
      this.portal_login_token = localStorage.getItem('portal_login_token');
      return this.__http.get(`${this.apiUrl}/product/get-by-slug/${slug}`,{
        headers:{Authorization: 'Bearer '+this.portal_login_token}
      });
    }

    //upload file..........
     //Add Data......
     upload(data: any): Observable<any> {
      this.portal_login_token = localStorage.getItem('portal_login_token');
      return this.__http.post(`${this.apiUrl}/content/upload`, data, {
        headers: {
          Authorization: 'Bearer ' + this.portal_login_token
        },
      });
    }

  //sana course List............
  getSanaCourseList(): Observable<any> {
    return this.__http.get(`${this.apiUrl}/sana/get-all`,{
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
        // Authorization: 'Bearer ' + "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjFkNTRiMi0wNDcwLTRkNGMtYTBlYi1lMzJiNzMzMTAyNGYiLCJpc3MiOiJrb3JkaWUtc2FuZGJveC5zYW5hLmFpIiwiY2lkIjoiN010NWQxQUZ4aUtrIiwic2NwIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE3Mzk5NTAyNzJ9.meJ5_GiTDfuC_rOQYpdZYuNxYZb1-7YvSk75t9BDmQmIgSnof8SjZd5nUMewXnm0lJMpbFOTkdUo4I0s-kxSmw"
      },
    });
  }

  //Feature Status Update.........
  featureStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/product/${id}/toggle-feature`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }
  activeStatus(id:any,data:any=[]): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.put(`${this.apiUrl}/product/${id}/toggle-status`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }
}
