import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { SharedService } from 'src/app/services/shared/shared.service';
//import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EdituserComponent implements OnInit {

  editForm: any;
  user_id : any;
  role_slug : string = '';
  userData : any = {
    name : '',
    email : '',
    phone : '',
    roles : '',
    status : ''
  };
  displayMessage : string = '';
  errorMessage : string = '';
  slugValue : any;
  roleList: any = [];
  

  constructor(private __user:UserService,
              private __route:Router, 
              private formBuilder: FormBuilder,
              private __activatedRoute:ActivatedRoute,
              private __shared:SharedService,
              private location: Location
              //private __auth:AuthenticateService,
              ) 
  { }

  ngOnInit(): void {

    
     this.user_id = this.__activatedRoute.snapshot.queryParams['user'];
    //this.user_id = this.__activatedRoute.snapshot.queryParamMap.get('user_id');
     this.role_slug = this.__activatedRoute.snapshot.queryParams['role'];

    this.slugValue = [this.role_slug];

    this.editForm = this.formBuilder.group({
      name:["",[Validators.required,Validators.pattern(/^[^-\s!@#$%^&*(),.?":{}|<>0-9][a-zA-Z\s]*$/)]], 
      email: ["", [Validators.required]],
      //phone:["",[Validators.required,Validators.pattern("^[0-9]*$")]],
      phone:["",[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      roles : [this.slugValue, [Validators.required]]
    });

    //console.log('this.slugValue : ', this.slugValue);
    this.getRole();
    this.getUserDetail();

  }

  validation_messages = { 
    'name': [     
      { type: 'required', message: 'Please enter name.' },
      { type: 'pattern', message: 'Name should be only alphabet.' }
    ],
    'phone': [  
      { type: 'required', message: 'Please enter phone.' },
      { type: 'pattern', message: 'Phone should be only 10 digit number.' }
    ],
    'roles': [  
      { type: 'required', message: 'Please select role.' }
    ]     

  };

  checkMessage() 
  {    
    if (this.displayMessage!='') 
    {
      setTimeout(() => {
        this.displayMessage = '';
       
      }, 2000);

      return true;
    } 
    else if (this.errorMessage!='') 
    {
      setTimeout(() => {
        this.errorMessage = '';
       
      }, 2000);

      return true;
    } 
    else 
    {
      return false;
    }
  }

  
  getUserDetail()
  {
      this.__user.getUserDetail(this.user_id)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.userData = response.data;

            this.editForm.setValue({
              name : this.userData?.name,
              email : this.userData?.email,
              phone : this.userData?.phone,
              roles : this.userData?.roles[0]?.slug
            });
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


  editUser() 
  {
    //console.log(this.editForm.value);

    let data : any = this.editForm.value;
    data.status = this.userData.status;

    this.__user.editUser(this.user_id, data)
                .subscribe((response)=>{

                  //console.log('response=====>>>',response.error);

                  if(response.error == false)
                  {
                    this.displayMessage = response.message;

                    if(this.role_slug == 'student')
                    {
                      //this.__shared.queryParamData.studentlist.displayMessage = this.displayMessage;
                      this.__shared.toastSuccess(this.displayMessage);
                      this.__route.navigate(['/user/studentlist']);
                       //this.__route.navigate(['/user/studentlist'],{queryParams:{displayMessage: this.displayMessage}});
                      
                    }
                    else if(this.role_slug == 'editor')
                    {
                      //this.__shared.queryParamData.userlist.displayMessage = this.displayMessage;
                      this.__shared.toastSuccess(this.displayMessage);
                      this.__route.navigate(['/user/userlist']);
                       // this.__route.navigate(['/user/userlist'],{queryParams:{displayMessage: this.displayMessage}});
                    }
                                        
                  }
                  else
                  {
                    this.__shared.toastError(response.message);
                  }


                },
                (err)=>{
                  //console.log('error===>',err);
                  this.__shared.toastError(err.error.message);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                }
                )
  }

  backClicked() {
    this.__route.navigate(['/user/userlist']);
    }

  getRole(page = 0, limit = 0){
      
      const params = {
        limit,
        page: page
      }
      
      this.__user.getRoleList(params).subscribe((response:any) =>{
        if(response.error == false)
        {
          this.roleList = response?.data?.items;
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

}
