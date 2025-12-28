import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from '../../../../app/services/customer-management/customer.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { ValidationService } from '../../../../app/services/validator/validation.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {

   addEditForm!: FormGroup;
    displayMessage: string = '';
    errorMessage: string = '';
    detailsId: string | null = null;
    getData: any;
    isLoading = false;

  constructor(
    private __fb: FormBuilder,
    private __customer: CustomerService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private __validationService: ValidationService,
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
  }

  //Initalize Form......
  createForm()
  {
    this.addEditForm = this.__fb.group({
      subject:['',[Validators.required]],
      comment: ['',[Validators.required]],
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
      
  //Save Data..................
  add(){
    const data: any = this.addEditForm.value;
    if (!data.subject) {
      this.__shared.toastError("Please enter subject!");
      return;
    }
    if (!data.comment) {
      this.__shared.toastError("Please enter comment!");
      return;
    }
    
    const params: any = {
      'subject': data?.subject ? data?.subject : '',
      'comment': data?.comment ? data?.comment : '',
    }

    if(this.detailsId){
      params['customer_id'] = this.detailsId
    }
    this.showLoader();
    // Make the API call
      const apiCall = 
        this.__customer.createComment(params); // Create new Data

  apiCall.subscribe(
    (response: any) => {
      this.hideLoader();
      if (!response.error) {
        this.displayMessage = "Data has been Created successfully";
        this.__shared.toastSuccess(this.displayMessage);
        this.__route.navigate(['/customer-management/comment-logs/'+this.detailsId]); // Navigate after success (optional)
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

  //Hide loader........
  hideLoader() {
    if(this.isLoading){
      this.isLoading = false;
      this.__spinner.hide();
    }
  }
  //Show loader........
  showLoader(){
    if(!this.isLoading){
      this.isLoading = true;
      this.__spinner.show();
    }
  }

}
