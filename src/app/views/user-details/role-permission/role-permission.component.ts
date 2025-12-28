import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../../services/user-details/user.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnInit {
  displayMessage : string = '';
  errorMessage : string = '';
  detailsId:string | null = null;
  addEditForm!: FormGroup;
  getData:any;
  
  constructor(
    private __activatedRoute:ActivatedRoute,
    private __fb: FormBuilder,
    private __shared:SharedService,
    private __route:Router,
    private __spinner: NgxSpinnerService,
    private __user: UserService,
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {}
    });
   }

  ngOnInit(): void {
    this.createForm();
    if(this.detailsId){
      this.getDetail();
    }
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      user_type: ['',[Validators.required]]
    })
  }


  checkMessage() {
    if (this.displayMessage != '') {
      setTimeout(() => {
        this.displayMessage = '';

      }, 2000);

      return true;
    }
    else if (this.errorMessage != '') {
      setTimeout(() => {
        this.errorMessage = '';

      }, 2000);

      return true;
    }
    else {
      return false;
    }
  }

  add(){
    const data: any = this.addEditForm?.value;
    const params: any = {
      'userId': this.detailsId,
      'user_type': data?.user_type ? data?.user_type : ''
    }
    console.log("params=====",params);
    // Make the API call
    const apiCall = this.__user.edit(this.detailsId, params) // Edit existing Data
  
    apiCall.subscribe(
      (response: any) => {
        if (!response.error) {
          this.displayMessage = "Data has been updated successfully";
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/user/list']); // Navigate after success (optional)
        } else {
          this.handleError(response.message);
        }
      },
      (err:any) => this.handleApiError(err)
    );
  }

  // Common error handler for API responses
  private handleError(message: string): void {
    this.errorMessage = message;
    this.__shared.toastError(this.errorMessage);
  }
  
  // Common API error handler
  private handleApiError(err: any): void {
    this.errorMessage = err.error?.message || "An error occurred";
  
    if (err.status === 403) {
      this.__shared.sessionExpired();
    } else {
      this.__shared.toastError(this.errorMessage);
    }
  }

  //get details............
  getDetail(){
    this.__user.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response.data;
            this.patchData();
            // console.log('app-->', this.titleData );
        }
        else{
          this.__shared.toastError(response.message);
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

  patchData(){
    this.addEditForm.patchValue({
      user_type: this.getData.user_type ? this.getData.user_type : '',
    });
  }

}
