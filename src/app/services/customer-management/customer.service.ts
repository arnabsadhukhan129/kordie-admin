import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
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
    let url: string = `${this.apiUrl}/customer`;
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
   delete(customer_id: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');

    return this.__http.delete(`${this.apiUrl}/customer/${customer_id}`, {
      headers: { Authorization: 'Bearer ' + this.portal_login_token }
    });
  }

  //Add Data......
  create(data: any): Observable<any> {
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.post(`${this.apiUrl}/customer`, data, {
      headers: {
        Authorization: 'Bearer ' + this.portal_login_token
      },
    });
  }

   //Edit Data.........
   edit(customer_id:any,data:any): Observable<any> {
    // data.forEach((value:any, key:any) => {
    //   console.log(`${key}:`, value);
    // });
    this.portal_login_token = localStorage.getItem('portal_login_token');

    return this.__http.put(`${this.apiUrl}/customer`,data,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

   //Get Details By Id.............
   getDetailById(customer_id:any): Observable<any> {    
    this.portal_login_token = localStorage.getItem('portal_login_token');
    return this.__http.get(`${this.apiUrl}/customer/${customer_id}`,{
      headers:{Authorization: 'Bearer '+this.portal_login_token}
    });
  }

  //Change Status Update.........
  changeStatus(customer_id:any,data:any=[]): Observable<any> {
  this.portal_login_token = localStorage.getItem('portal_login_token');
  return this.__http.patch(`${this.apiUrl}/customer/${customer_id}`,data,{
    headers:{Authorization: 'Bearer '+this.portal_login_token}
  });
  }

  //Edit Data.........
createComment(data:any): Observable<any> {
  this.portal_login_token = localStorage.getItem('portal_login_token');
  return this.__http.put(`${this.apiUrl}/customer/comment`,data,{
    headers:{Authorization: 'Bearer '+this.portal_login_token}
  });
  }

//Private Comment List............
getCommentList(param: any, customer_id:any, searchType:string='', searchVal:string=''): Observable<any> {
  const formData: URLSearchParams = new URLSearchParams();
  const portal_login_token = localStorage.getItem('portal_login_token');
  for (let key in param) {
    formData.set(key, param[key])
  }
  let url: string = `${this.apiUrl}/customer/comment/${customer_id}`;
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

//Export Newsletter Customer.......
exportData() {
  this.portal_login_token = localStorage.getItem('portal_login_token');
  return this.__http.get(`${this.apiUrl}/customer/newsletter/list`, {
    headers: {
      Authorization: 'Bearer ' + this.portal_login_token
    },
    responseType: 'arraybuffer'  // 👈 This tells Angular to return binary data
  });
}

//Customer List............
getnonCustomer(param: any, searchType:string='', searchVal:string=''): Observable<any> {
  const formData: URLSearchParams = new URLSearchParams();
  const portal_login_token = localStorage.getItem('portal_login_token');
  for (let key in param) {
    formData.set(key, param[key])
  }
  let url: string = `${this.apiUrl}/customer/non-customer/list`;
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



}
