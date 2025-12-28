import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AccessService } from '../../../../app/services/access/access.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-rolelist',
  templateUrl: './rolelist.component.html',
  styleUrls: ['./rolelist.component.scss']
})
export class RolelistComponent implements OnInit {

  userRoleData : any = [];
  activePage: number = 1;
  totalRecords!: number;
  recordsPerPage: number = environment.itemsPerPage;
  loginRights: any;

  constructor(private _access: AccessService,private __shared:SharedService,private __route:Router) 
  { 
    this.loginRights= JSON.parse(localStorage.getItem("login_rights") || "[]");
  }

  ngOnInit(): void {

    this.getUserRoleList();
  }


  getUserRoleList(page = 1, limit = this.recordsPerPage)
  {
    this.activePage = page;
    this.recordsPerPage = limit;
    const params = {
      limit,
      page: page
    }

    this._access.getRoleList(params)
                .subscribe((response)=>{
                  
                  if(response.error == false)
                  {
                      this.userRoleData = response.data.items;
                      this.totalRecords = response.data.totalCount;
                    
                  }
                  
                },
                (err)=>{
                  console.log(err);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                })

  }

  editRolePermission(roleId: any)
  {
       //this.__route.navigate(['/access/permission'],{queryParams:{role: roleId}});
       this.__route.navigate(['/access/addrole'], {queryParams : {role : roleId} });
  }

  delRole(roleId: any)
  {
        if (confirm("Are you sure to delete?") == true) 
        {
                  this._access.delRole(roleId)
                .subscribe((response)=>{
                  
                  if(response.error == false)
                  {
                    this.__shared.toastSuccess(response.message);
                  }
                  else
                  {
                    this.__shared.toastError(response.message);
                  }

                  this.getUserRoleList();
                  
                },
                (err)=>{
                  console.log(err);
                  this.__shared.toastError(err.error.message);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                })
        } 
        else 
        {
          
        } 
  }

  changeStatus(user_id:any, slug:string, index:number)
  {

    if(slug!='administrator' && slug!='student' && slug!='editor')
    {
            // this._access.changeStatus(user_id)
            // .subscribe((response)=>{
              
            //   if(response.error == false)
            //   {
            //       this.chapterList[index].status = response.data.status;
            //   }
            //   else
            //   {
            //     this.errorMessage = response.message;                    
            //   }
              
            // },
            // (err)=>{
            //   console.log(err);
            //   if(err.status == 403)
            //       {
            //             this.__shared.sessionExpired();
            //       }
            //   else
            //   {
            //     this.errorMessage = err.error.message;                    
            //   }    
            // })
    }

    
  }

}
