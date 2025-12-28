import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthenticateService } from '../../../../app/services/authenticate/authenticate.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../../../app/services/shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  loginErrorMessage : string = '';
  displayMessage: string = '';
  errorMessage: string = '';
  token: string|undefined;

  public aFormGroup: any;
  public siteKey: any = environment.recaptcha.siteKey; 

  constructor(private __auth:AuthenticateService, private __route:Router, private formBuilder: FormBuilder,
              private __activatedRoute:ActivatedRoute, private __shared:SharedService,) 
  {
    this.token = undefined;

  }


  ngOnInit(): void {   

    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      device_id : [""],
      device_type : [""],
      fcm_token : [""],
      recaptcha: ["", [Validators.required]]
    });

  // this.aFormGroup = this.formBuilder.group({
  //   recaptcha: ["", [Validators.required]]
  // });

      // this.displayMessage = this.__shared.queryParamData.login.displayMessage;
      // this.__shared.queryParamData.login.displayMessage = '';
      // this.errorMessage = this.__shared.queryParamData.login.errorMessage;
      // this.__shared.queryParamData.login.errorMessage = '';
 

    if(this.__auth.isLoggedIn())
    {
          this.__route.navigate(['/dashboard']);
    }
    else
    {

    }
    
  }

  validation_messages = { 
    'username': [     
      { type: 'required', message: 'Please enter a valid email.' },
      { type: 'email', message: 'Please enter email.' },
    ],
    'password': [  
      { type: 'required', message: 'Please enter password.' }
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
    else if (this.loginErrorMessage!='') 
    {
      setTimeout(() => {
        this.loginErrorMessage = '';
       
      }, 2000);

      return true;
    }
    else 
    {
      return false;
    }
  }

  login()
  {
    console.log(this.loginForm.value);

    let loginData : any = this.loginForm.value;

    this.__auth.login(loginData)
                .subscribe((response)=>{
                  // console.log("response.data.....",response.data);
                  
                  if(response.error == false)
                  {
                    // this.sanaLogin();
                    localStorage.setItem('portal_login_token',response.data.accessToken);
                    localStorage.setItem('login_role',response.data.user.user_type[0]);
                  //   if(response.data.user.profile)
                  //   {
                  //       localStorage.setItem('profile_pic',response.data.user.profile.avatar);
                  //   }
                    
                  //   //localStorage.setItem('portal_login_data',JSON.stringify(response.data))
                    this.__route.navigate(['/dashboard']);
                    this.__shared.toastSuccess("Login Successfully");
                  }
                  else
                  {
                    this.loginErrorMessage = "Invalid Credentials!";
                    this.displayMessage = '';
                  //   //this.loginErrorMessage = response.message;
                    this.__shared.toastError("Invalid Credentials!");
                  }


                },
                (err)=>{
                  //console.log('error===>',err);
                  this.loginErrorMessage = "Invalid Credentials!";
                  this.displayMessage = '';
                  // this.loginErrorMessage = err.error.message;
                  this.__shared.toastError("Invalid Credentials!");
                }
                )

  }

  sanaLogin(){
    const params ={
      grant_type: "client_credentials",
      client_id: "7Mt5d1AFxiKk",
      client_secret: "abf5bed399a470b462c4fca0e919e381",
      scope: "read,write"
    }
    this.__auth.sanaLogin(params)
    .subscribe((response)=>{
      if(response.error == null){
        localStorage.setItem('sana_login_token',response.data.accessToken);
      }
      else
      {
        this.loginErrorMessage = "Sana Credentials Invalid!";
        this.__shared.toastError(this.loginErrorMessage);
      }
    },
    (err)=>{
      this.loginErrorMessage = "Sana Credentials Invalid!";
      this.__shared.toastError(this.loginErrorMessage);
    }
  )
  }


  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    console.debug(`Token [${this.token}] generated`);
  }

  

}
