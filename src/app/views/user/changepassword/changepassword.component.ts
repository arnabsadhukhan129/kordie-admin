import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormBuilder, Validators, FormsModule, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  editForm: any;
  displayMessage : string = '';
  errorMessage : string = '';

  constructor(private __user:UserService,private __fb: FormBuilder, private __route:Router, private __shared: SharedService) 
  { }

  ngOnInit(): void {

    this.editForm = this.__fb.group({
      old_password:['',Validators.required],
      new_password:['',[Validators.required,Validators.pattern (/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$€£%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?])[A-Za-z\d!@#$€£%^&*()_+\-=\[\]{}`~;':"\\|,.<>\/?]{8,}/)]],
      confirm_passwprd:['',[Validators.required]],
    },{
      validators:[
                  this.MustMatch('new_password', 'confirm_passwprd'),
                ]
    })

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

  changePassword()
  {
    let data : any = this.editForm.value;

    this.__user.changePassword(data)
                .subscribe((response)=>{

                  //console.log('response=====>>>',response.error);

                  if(response.error == false)
                  {
                      this.displayMessage = response.message;
                      this.editForm.reset();
                      this.errorMessage = '';

                      // localStorage.removeItem('portal_login_token');
                      // localStorage.removeItem('login_role');
                      // localStorage.removeItem('profile_pic');
                      // this.__route.navigate(['/login']);

                      //this.__shared.queryParamData.login.displayMessage = 'Your password has been changed successfully, Please login to continue';
                      this.__shared.toastSuccess('Your password has been changed successfully, Please login to continue');
                      this.__shared.logout();
                                       
                  }
                  else
                  {
                    this.__shared.toastError(response.message);
                    this.displayMessage = '';
                  }
                },
                (err)=>{
                  //console.log('error===>',err);
                  this.__shared.toastError(err.error.message);
                  this.displayMessage = '';
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                }
                )
  }

}
