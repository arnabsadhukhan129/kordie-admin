import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
//import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';
import { UserService } from '../../../../app/services/user/user.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  displayMessage : string = '';
  errorMessage : string = '';
  editForm : any;
  login_role : any = localStorage.getItem('login_role');
  profileData:any = {
    first_name : '',
    last_name : '',
    email : '',
    phone : '',
    notify_email: ''
  }

  constructor(//private __auth:AuthenticateService,
              private __route:Router,
              private __user:UserService,
              private __fb: FormBuilder,
              private __shared: SharedService
              ) 
  { }

  ngOnInit(): void {

       this.getProfileDetail();

       this.createForm();   
   
    
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

  createForm(){
    this.editForm = this.__fb.group({
      first_name:['',Validators.required],
      last_name:['',Validators.required],
      email:['',Validators.required],
      notify_email: ['',Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10,12}$/)
 
        ],
      ],
      roles : [[this.login_role]]
    })
  }

  getProfileDetail()
  {
      this.__user.detailsUser()
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.profileData = response.data;
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

  updateUser()
  {
    let data : any = this.editForm.value;

    this.__user.updateProfile(data)
                .subscribe((response)=>{
                  
                  if(response.error == false)
                  {
                      this.displayMessage = "Profile Update Successfully!";     
                      this.__route.navigate(['/dashboard']);
                      this.__shared.toastSuccess(this.displayMessage);
                                        
                  }
                  else
                  {
                    this.errorMessage = "Profile Update Failed!";
                    this.__shared.toastError(this.errorMessage);
                  }


                },
                (err)=>{
                  //console.log('error===>',err);
                  this.errorMessage = err.error.message;
                  this.__shared.toastError(this.errorMessage);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                }
                )
  }

}
