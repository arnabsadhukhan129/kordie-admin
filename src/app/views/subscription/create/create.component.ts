import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private __subscription: SubscriptionService,
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
        plan_name:['',[Validators.required]],
        sub_title: ['',[Validators.required]],
        tag: [''],
        price: ['',[Validators.required]],
        discount: ['',[Validators.required]],
        details: ['',[Validators.required]],
        is_membership: [null,[Validators.required]],
        special_note: ['']
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

  allowOnlyPositiveDecimalNumbers(event: KeyboardEvent): void {
    const charCode = event.key;
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Allow numbers, one '.', and control keys like Backspace and Delete
    if (
      !/[0-9.]/.test(charCode) || // Block any character that is not a number or '.'
      (charCode === '.' && inputValue.includes('.')) // Block multiple '.'
    ) {
      event.preventDefault();
    }
  }

  preventNegativeValues(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (parseFloat(inputElement.value) < 0) {
      inputElement.value = '0'; // Reset to 0 if negative
    }
  }

  // processLearnTitle(): void {
  //   const learnOutcomes = this.addEditForm.get('details')?.value;
  
  //   if (learnOutcomes) {
  //     // Split by commas, trim each entry, and filter out empty values
  //     const outcomesArray = learnOutcomes
  //       .split(',')
  //       .map((outcome: string) => outcome.trim())
  //       .filter((outcome: string) => outcome);
  
  //     // Update the form control with the processed array
  //     this.addEditForm.patchValue({ details: outcomesArray });
  
  //     console.log('Processed Learn Outcomes:', outcomesArray);
  //   }
  // }

  processLearnTitle(): void {
    const learnOutcomes = this.addEditForm.get('details')?.value;
  
    if (typeof learnOutcomes === 'string') {
      // It's a string, so we can split
      const outcomesArray = learnOutcomes
        .split(',')
        .map((outcome: string) => outcome.trim())
        .filter((outcome: string) => outcome);
  
      this.addEditForm.patchValue({ details: outcomesArray });
  
      console.log('Processed Learn Outcomes:', outcomesArray);
    } else if (Array.isArray(learnOutcomes)) {
      // It's already an array — maybe we just want to trim each item
      const outcomesArray = learnOutcomes
        .map((outcome: string) => outcome.trim())
        .filter((outcome: string) => outcome);
  
      this.addEditForm.patchValue({ details: outcomesArray });
  
      console.log('Processed Learn Outcomes (array input):', outcomesArray);
    } else {
      console.warn('Unexpected learnOutcomes format:', learnOutcomes);
    }
  }
  


  //Save Data..................
  add(){
    const data: any = this.addEditForm.value;
    if (!data.plan_name) {
      this.__shared.toastError("Please enter plan name!");
      return;
    }
    if (!data.sub_title) {
      this.__shared.toastError("Please enter sub title!");
      return;
    }
    if (!data.details) {
      this.__shared.toastError("Please enter details!");
      return;
    }

    const params: any = {
      'plan_name': data?.plan_name ? data?.plan_name : '',
      'sub_title': data?.sub_title ? data?.sub_title : '',
      'tag': data?.tag ? data?.tag : '',
      'price': data?.price ? data?.price : 0,
      'discount': data?.discount ? data?.discount : 0,
      'details': data?.details ? data?.details : 0,
      'is_membership': data?.is_membership ? data?.is_membership : false ,
      'special_note': data?.special_note ? data?.special_note : '',
    }
    if (this.detailsId) {
      params['plan_id'] = this.detailsId;
    }

    // Make the API call
    const apiCall = this.detailsId
    ? this.__subscription.edit(this.detailsId, params) // Edit existing Data
    : this.__subscription.create(params); // Create new Data

  apiCall.subscribe(
    (response: any) => {
      if (!response.error) {
        this.displayMessage = this.detailsId
          ? "Data has been updated successfully"
          : "Data has been saved successfully";

        this.__shared.toastSuccess(this.displayMessage);
        this.__route.navigate(['/subscription/list']); // Navigate after success (optional)
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
    this.__subscription.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response.data;
            // console.log("getData======",this.getData);
            
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
      plan_name: this.getData[0].plan_name ? this.getData[0].plan_name : '',
      sub_title: this.getData[0].sub_title ? this.getData[0].sub_title : '',
      tag: this.getData[0].tag ? this.getData[0].tag : '',
      price: this.getData[0].price ? this.getData[0].price : '',
      discount: this.getData[0].discount ? this.getData[0].discount : '',
      details: this.getData[0].details ? this.getData[0].details : '',
      is_membership: this.getData[0].is_membership,
      special_note: this.getData[0].special_note ? this.getData[0].special_note : '',
    });
  }

}
