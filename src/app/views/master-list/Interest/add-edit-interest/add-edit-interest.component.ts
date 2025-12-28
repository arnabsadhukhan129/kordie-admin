import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateService } from '../../../../services/master-list/create.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewService } from '../../../../services/master-list/view.service';

@Component({
  selector: 'app-add-edit-interest',
  templateUrl: './add-edit-interest.component.html',
  styleUrls: ['./add-edit-interest.component.scss']
})
export class AddEditInterestComponent implements OnInit {

  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  isLoading = false;
  getData: any;

  constructor(
      private __fb: FormBuilder,
      private _interest: CreateService,
      private _detailsInterest: ViewService,
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
   
     createForm()
       {
         this.addEditForm = this.__fb.group({
           name:['',[Validators.required]],
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
     
       add(): void {
         if (this.addEditForm.invalid) {
             return;
         }
     
         this.isLoading = true; // Start loading spinner
         const formData = this.addEditForm.value;
     
         const apiCall = this.detailsId
             ? this._interest.ediInterestByData(this.detailsId, formData)
             : this._interest.createInterestByData(formData);
     
         apiCall.subscribe(
             response => {
                 this.isLoading = false; // Stop loading spinner
                 if (!response.error) {
                     this.displayMessage = this.detailsId
                         ? "Details updated successfully."
                         : "Details added successfully.";
                     this.__shared.toastSuccess(this.displayMessage);
                     this.__route.navigate(['/master-list/interest-list']);
                 } else {
                     this.errorMessage = response.message;
                     this.__shared.toastError(this.errorMessage);
                 }
             },
             error => {
                 this.isLoading = false; // Stop loading spinner
                //  this.errorMessage = "An error occurred.";
                 this.__shared.toastError(error.error.message);
             }
         );
       }
     
       //get details............
       getDetail(){
         this._detailsInterest.getInterestDetailById(this.detailsId)
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
           name: this.getData.name ? this.getData.name : '',
         });
       }
}
