import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})


export class UserlistComponent implements OnInit {

  userList: any = [];
 
  // visible = [true, true];
  // dismissible = true;
  //public liveDemoVisible = false;
  activePage: number = 1;
  totalRecords!: number;
  recordsPerPage: number = environment.itemsPerPage;
  searchByValue : any = [
    {value:'name', name:'Name'}, 
    {value:'phone', name:'Phone'},
    {value:'email', name:'Email'},
    {value:'status', name:'Status'},
  ];
  searchType : string = '';
  searchVal : string = '';
  display_error : boolean = false;
  loaded_data : boolean = false;
  statusData: any = [
    {value:'active', name:'Active'}, 
    {value:'inactive', name:'Inactive'}
  ];
  loginRights: any;

  constructor(private __auth:AuthenticateService, 
              private __user:UserService,private __route:Router,
              private __activatedRoute:ActivatedRoute,
              private __shared:SharedService,
              ) 
  {
    this.loginRights= JSON.parse(localStorage.getItem("login_rights") || "[]");
   }

  ngOnInit(): void { 
    this.getList();
  }

 

  getList(page = 1, limit = this.recordsPerPage) {

    if(this.searchType=='' && this.searchVal!='')
    {
          this.display_error = true;
    }
    else
    {
          this.display_error = false;
    }

    // Pagination variables
    this.activePage = page;
    this.recordsPerPage = limit;
    const params = {
      role: 'subAdmin',
      limit, 
      page: page
    }

    this.loaded_data = false;
    
    this.__user.listAdminUser(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    this.userList = response.data.items;
                    this.totalRecords = response.data.total[0]?.count;
                    this.loaded_data = true;
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


  deleteUser(user_id: any) 
  {

    if (confirm("Are you sure to delete?") == true) 
    {
              this.__user.delUser(user_id)
            .subscribe((response)=>{
              
              if(response.error == false)
              {
                this.__shared.toastSuccess(response.message);
              }
              else
              {
                this.__shared.toastError(response.message);
              }

              this.getList();
              
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

  editUser(user_id: any, role_slug: string) 
  {
    this.__route.navigate(['/user/edituser'],{queryParams:{user: user_id, role: role_slug}});
  }

  viewUser(user_id:any)
  {
       this.__route.navigate(['/user/viewuser'],{queryParams:{user: user_id}});
  }

  changeSearchType(event : any, type:any)
  {
      //  console.log('event------->',event.data, event.type, event.target.value);

        if(type == 'searchby')
        {
              this.searchType = event.target.value;
              this.searchVal = '';
        }
        else if(type == 'searchval')
        {
              this.searchVal = event.target.value;
        }

        // console.log('search------->',this.searchType, this.searchVal);

        this.getList(1, this.recordsPerPage);

  }

  changeStatus(user_id:any, index:number)
  {
    this.__user.changeStatus(user_id)
                .subscribe((response)=>{
                  
                  if(response.error == false)
                  {
                      this.userList[index].status = response.data.status;
                  }
                  else
                  {
                    this.__shared.toastError(response.message);                    
                  }
                  
                },
                (err)=>{
                  console.log(err);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                  else
                  {
                    this.__shared.toastError(err.error.message);                    
                  }   
                })
  }


  downloadData()
  {

      let excelDataList: any = [];
      let userList: any = [];

      const params = {
        // role: 'editor',
        role: 'subAdmin',
        limit:this.recordsPerPage, 
        page: 0
      }


      this.__user.listAdminUser(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  
                  if(response.error == false)
                  {
                    userList = response.data.items;
                    console.log("userList====>",userList)
                       userList.forEach( function (value:any, key:number) {
                          console.log("Key====>",key);
                          console.log("value===>",value);

                          excelDataList.push({
                                              '#' : key+1, 
                                              'Name' : value?.name,
                                              'Email' : value?.email,
                                              'Phone' : value?.phone,
                                              // 'Date of Birth' : value?.profile?.dob,
                                              // 'Gender' : value?.profile?.gender,
                                              // 'City' : value?.userCity?.name,
                                              // 'State' : value?.userState?.name,
                                              // 'Country' : value?.userCountry?.name,
                                              'Status' : value?.status ? 'Active' : 'Inactive'
                                            });


                        });

                        

                       this.__shared.exportAsExcelFile(excelDataList, 'AdminUser');
                  }
                  
                },
                (err)=>{
                  console.log(err);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                });

        
  }

  checkVideoFile() {    

    setTimeout(() => {
      alert('wsdwe');
      return false;
     
    }, 1000);

    // if (this.amazonFeatureVideo) {
    //   return true;
    // } else {
    //   return false;
    // }


  }

}
