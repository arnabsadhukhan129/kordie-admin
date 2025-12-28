import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnquiryService } from '../../../services/course-enquiry/enquiry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from '../../../services/validator/validation.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  addEditForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';
  detailsId:string | null = null;
  getData:any;

  constructor(
    private __fb: FormBuilder,
    private __enquiry: EnquiryService,
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
    if(this.detailsId){
      this.getDetail();
    }
  }

  //Initalize Form......
      createForm()
      {
        this.addEditForm = this.__fb.group({
          full_name:['',[Validators.required]],
          email: ['',[Validators.required, this.__validationService.isEmail]],
          company: ['',[Validators.required]],
          messageDetails: ['',[Validators.required]],
          linkedin: [''],
          totalAmount: [''],
          discount: [''],
          paidAmount: [''],
          amountToBePaid: [''],
          paymentStatus: ['']
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
        if (!data.full_name) {
          this.__shared.toastError("Please enter name!");
          return;
        }
        if (!data.email) {
          this.__shared.toastError("Please enter email!");
          return;
        }
        if (!data.company) {
          this.__shared.toastError("Please enter company!");
          return;
        }
        if (!data.messageDetails) {
          this.__shared.toastError("Please enter message!");
          return;
        }

        if(this.detailsId && !data.totalAmount){
          this.__shared.toastError("Please enter total amount!");
          return;
        }

        if(this.detailsId && (data.discount === '' || data.discount === null || data.discount === undefined)){
          this.__shared.toastError("Please enter discount!");
          return;
        }

        if(this.detailsId && !data.paidAmount){
          this.__shared.toastError("Please enter paid amount!");
          return;
        }

        if(this.detailsId && !data.amountToBePaid){
          this.__shared.toastError("Please enter amount to be paid!");
          return;
        }

        if(this.detailsId && !data.paymentStatus){
          this.__shared.toastError("Please select payment status!");
          return;
        }

        const params: any = {
          'full_name': data?.full_name ? data?.full_name : '',
          'email': data?.email ? data?.email : '',
          'company': data?.company ? data?.company : '',
          'messageDetails': data?.messageDetails ? data?.messageDetails : '',
          'linkedin': data?.linkedin ? data?.linkedin : '',
        }
        if (this.detailsId) {
          params['enquiry_id'] = this.detailsId;
          params['totalAmount'] = data.totalAmount;
          params['discount'] = data.discount;
          params['paidAmount'] = data.paidAmount;
          params['amountToBePaid'] = data.amountToBePaid;
          params['paymentStatus'] = data.paymentStatus;
        }

        // console.log("params====",params);
        // return;
        // Make the API call
        const apiCall = this.detailsId
        ? this.__enquiry.edit(this.detailsId, params) // Edit existing Data
        : this.__enquiry.create(params); // Create new Data

      apiCall.subscribe(
        (response: any) => {
          if (!response.error) {
            this.displayMessage = this.detailsId
              ? "Data has been updated successfully"
              : "Data has been saved successfully";

            this.__shared.toastSuccess(this.displayMessage);
            this.__route.navigate(['/enquiry/list']); // Navigate after success (optional)
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
    this.__enquiry.getDetailById(this.detailsId)
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
      full_name: this.getData.full_name ? this.getData.full_name : '',
      email: this.getData.email ? this.getData.email : '',
      company: this.getData.company ? this.getData.company : '',
      messageDetails: this.getData.messageDetails ? this.getData.messageDetails : '',
      linkedin: this.getData.linkedin ? this.getData.linkedin : '',
      totalAmount: this.getData.totalAmount ? this.getData.totalAmount : '',
      discount: this.getData.discount ? this.getData.discount : '',
      paidAmount: this.getData.paidAmount ? this.getData.paidAmount : '',
      amountToBePaid: this.getData.amountToBePaid ? this.getData.amountToBePaid : '',
      paymentStatus: this.getData.paymentStatus ? this.getData.paymentStatus : '',
    });
  }

  allowOnlyPositiveNumbers(event: KeyboardEvent): void {
    const charCode = event.key;
    
    // Prevent "-" or any non-numeric characters except for allowed keys (e.g., Backspace, Tab).
    if (charCode === '-' || isNaN(Number(charCode))) {
      event.preventDefault();
    }
  }

  preventNegativeValues(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (parseFloat(inputElement.value) < 0) {
      inputElement.value = '0'; // Reset to 0 if negative
    }
  }

}
