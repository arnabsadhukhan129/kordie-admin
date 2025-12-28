import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: any;
  displayMessage : string = '';
  errorMessage : string = '';
  passwordResettoken: any;

  constructor(
    private formBuilder: FormBuilder, 
    private __user:UserService,
    private __route:Router,
    private __shared:SharedService,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.activatedRoute.paramMap.subscribe({
      next: params => {
        this.passwordResettoken = params.get('token');
      },
      error: err => {}
    });
  }

  ngOnInit(): void {
    this.resetPasswordForm  = this.formBuilder.group({
      new_password : ["",[Validators.required,Validators.pattern (/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$€£%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?])[A-Za-z\d!@#$€£%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]{8,}/)]],
      confirm_password : ["", [Validators.required]],
    },{
      validators:[
                  this.MustMatch('new_password', 'confirm_password'),
                ]
    });
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

  resetPassword(){
    let data : any = this.resetPasswordForm.value;
    const resetToken = this.passwordResettoken ? this.passwordResettoken : localStorage.getItem('x-reset-token') || '';
    if (!resetToken) {
      this.__shared.toastError('Reset token is missing!');
      return;
    }
    this.__user.resetPassword(data,resetToken)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                      this.displayMessage = "Password Changed Successfully!";
                      this.errorMessage = '';
                      this.__shared.toastSuccess(this.displayMessage);
                      this.__route.navigate(['/login']);     
                      localStorage.removeItem('x-reset-token');               
                  }
                  else
                  {
                    // this.__shared.toastError("Password Change failed!");
                    this.errorMessage = "Password Change failed!";
                    this.displayMessage = '';
                  }
                },
                (err)=>{
                  // this.__shared.toastError(err.error.message);
                  this.errorMessage = err.error.message;
                  this.displayMessage = '';
                })
  }

}
