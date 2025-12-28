import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { environment } from 'src/environments/environment';
//import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  editForm: any;
  user_id : any;
  //role_slug : string = '';
  // userData : any = {
  //   name : '',
  //   email : '',
  //   phone : '',
  //   roles : '',
  //   status : ''
  // };
  displayMessage : string = '';
  errorMessage : string = '';
  roleList: any = [];
  recordsPerPage: number = environment.itemsPerPage;
  activePage: number = 1;

  //slugValue : any;

  constructor(private __user:UserService,
              private __route:Router, 
              private __fb: FormBuilder,
              private __activatedRoute:ActivatedRoute,
              private __shared:SharedService,
              //private __auth:AuthenticateService,
              ) 
  { }

  ngOnInit(): void {
    this.editForm = this.__fb.group({
      name:['',[Validators.required,Validators.pattern(/^[^-\s!@#$%^&*(),.?":{}|<>0-9][a-zA-Z\s]*$/)]], 
      //email:['',[Validators.required, Validators.email]],   
      email:['',[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
      //phone:['',[Validators.required,Validators.pattern("^[0-9]*$")]],
      phone:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      //phone:['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      password:['',[Validators.required,Validators.pattern (/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$€£%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?])[A-Za-z\d!@#$€£%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]{8,}/)]],
      confirm_password:['',Validators.required],
      roles : ['',Validators.required]
      // roles : [["editor"]]
    },{
      validators:[
                  this.MustMatch('password', 'confirm_password'),
                ]
    })

    this.getRole();
  }



MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

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

  addUser() 
  {
    //console.log(this.editForm.value);

    let data : any = this.editForm.value;

    this.__user.createUser(data)
                .subscribe((response)=>{

                  //console.log('response=====>>>',response.error);

                  if(response.error == false)
                  {
                      this.displayMessage = response.message;
                      //this.__shared.queryParamData.userlist.displayMessage = this.displayMessage;
                      this.__shared.toastSuccess(this.displayMessage);
                      this.__route.navigate(['/user/userlist']);
                      //this.__route.navigate(['/user/userlist'],{queryParams:{displayMessage: this.displayMessage}});
                  
                                        
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

  /**Using for active role list */
  getRole(page = 0, limit = 0){
    // this.activePage = page;
    // this.recordsPerPage = limit;
    const params = {
      limit,
      page: page
    }
    // const params = {
    //   status : true
    // }
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
