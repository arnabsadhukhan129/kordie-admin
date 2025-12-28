import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-details/user.service';
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
    private __user: UserService,
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
        first_name:['',[Validators.required]],
        last_name: ['',[Validators.required]],
        email:[''],
        phone: ['',[Validators.required,Validators.pattern(/^\d{10,12}$/)]],
        user_type: ['']
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
      if (!data.first_name) {
        this.__shared.toastError("Please enter first name!");
        return;
      }
      if (!data.last_name) {
        this.__shared.toastError("Please enter last name!");
        return;
      }
      if (!data.phone) {
        this.__shared.toastError("Please enter phone!");
        return;
      }
      if(!this.detailsId && !data.user_type){
        this.__shared.toastError("please select role")
      }
      
      const params: any = {
        'first_name': data?.first_name ? data?.first_name : '',
        'last_name': data?.last_name ? data?.last_name : '',
        'phone': data?.phone ? data?.phone : '',
        'email': data?.email ? data?.email : this.getData?.email,
        'user_type': data?.user_type ? data?.user_type : this.getData?.user_type
      }

      // Make the API call
        const apiCall = this.detailsId
        ? this.__user.edit(this.detailsId, params) // Edit existing Data
        : this.__user.create(params); // Create new Data
      // Make the API call
      // const apiCall = this.__user.edit(this.detailsId, params) // Edit existing Data
  
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
        first_name: this.getData.first_name ? this.getData.first_name : '',
        last_name: this.getData.last_name ? this.getData.last_name : '',
        email: this.getData.email ? this.getData.email : '',
        phone: this.getData.phone ? this.getData.phone : '',
      });
    }

}
