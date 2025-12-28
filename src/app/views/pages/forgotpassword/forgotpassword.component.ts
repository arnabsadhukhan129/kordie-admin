import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  passwordForm: any;
  resetPasswordForm: any;
  displayMessage : string = '';
  errorMessage : string = '';
  email : string = '';

  constructor(private formBuilder: FormBuilder, 
              private __user:UserService,
              private __route:Router,
              private __shared:SharedService,
              ) 
  { }

  ngOnInit(): void {

    this.passwordForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });

  }

  validation_messages = { 
    'username': [     
      { type: 'required', message: 'Please enter email.' },
      { type: 'email', message: 'Please enter a valid email.' },
    ]     

  };


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

  sendotp()
  {
    let data : any = this.passwordForm.value;
    this.__user.forgotPassword(data)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    localStorage.setItem('x-reset-token',response?.data?.token);
                    this.displayMessage = "Reset password link send your email";
                    this.errorMessage = '';
                    setTimeout(() => {
                      this.__route.navigate(['/login']);
                    }, 2000);
                  }
                  else
                  {
                    this.errorMessage = "No user found!";
                    this.displayMessage = '';
                  }
                },
                (err)=>{
                  //console.log('error===>',err);
                  this.errorMessage = "No user found!";
                  // this.errorMessage = err.error.message;
                  this.displayMessage = '';
                })
  }


}
