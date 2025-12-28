import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../../services/user-details/user.service';

@Component({
  selector: 'app-subscribed-user-view',
  templateUrl: './subscribed-user-view.component.html',
  styleUrls: ['./subscribed-user-view.component.scss']
})
export class SubscribedUserViewComponent implements OnInit {
  detailsId:string | null = null;
  userPlanId:string | null = null;
  getData:any;
  addEditForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';

  constructor(
    private __fb: FormBuilder,
    private __user: UserService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
  ) { 
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {}
    });

    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.userPlanId = params.get('user_associated_plan_id');
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

   //Initalize Form......
  createForm()
  {
    this.addEditForm = this.__fb.group({
      first_name:[''],
      last_name: [''],
      email:[''],
      subscription_date:[''],
      subscription_end_date:['',[Validators.required]]
    });
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

  //get details............
  getDetail(){
    const params={
      // id: this.detailsId,
      user_associated_plan_id: this.userPlanId
    };
    this.__user.subscribedUserDetails(this.detailsId,params)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response?.data;
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
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // Get 'YYYY-MM-DD'
    };
    this.addEditForm.patchValue({
      first_name: this.getData?.USER?.first_name ? this.getData?.USER?.first_name : '',
      last_name: this.getData?.USER?.last_name ? this.getData?.USER?.last_name : '',
      email: this.getData?.USER?.email ? this.getData?.USER?.email : '',
      subscription_date: formatDate(this.getData?.subscription_date),
      subscription_end_date: formatDate(this.getData?.subscription_end_date),
    });
  }
 
  add(){
    const data: any = this.addEditForm.value;
    const params: any = {
      user_associated_plan_id: this.userPlanId,
      subscription_end_date: data?.subscription_end_date,
    }

    // Make the API call
      const apiCall = this.__user.editSubscribedUser(params) // Edit existing 
    // Make the API call
    // const apiCall = this.__user.edit(this.detailsId, params) // Edit existing Data

  apiCall.subscribe(
    (response: any) => {
      if (!response.error) {
        this.displayMessage = "Data has been updated successfully";
        this.__shared.toastSuccess(this.displayMessage);
        this.__route.navigate(['/subscription/subscribed-user-list/'+this.detailsId]); // Navigate after success (optional)
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

}
