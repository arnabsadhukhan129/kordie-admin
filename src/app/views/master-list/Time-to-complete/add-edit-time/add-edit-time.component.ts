import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateService } from '../../../../../app/services/master-list/create.service';
import { ViewService } from '../../../../../app/services/master-list/view.service';
import { SharedService } from '../../../../../app/services/shared/shared.service';
import { ValidationService } from '../../../../../app/services/validator/validation.service';

@Component({
  selector: 'app-add-edit-time',
  templateUrl: './add-edit-time.component.html',
  styleUrls: ['./add-edit-time.component.scss']
})
export class AddEditTimeComponent implements OnInit {
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
    private _time: CreateService,
    private _detailsTime: ViewService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private __validationService: ValidationService
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
        name:['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
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
          ? this._time.editTimeData(this.detailsId, formData)
          : this._time.createTimeData(formData);
  
      apiCall.subscribe(
          response => {
              this.isLoading = false; // Stop loading spinner
              if (!response.error) {
                  this.displayMessage = this.detailsId
                      ? "Details updated successfully."
                      : "Details added successfully.";
                  this.__route.navigate(['/master-list/time-list']);
                  this.__shared.toastSuccess(this.displayMessage);
              } else {
                  this.errorMessage = response.message;
                  this.__shared.toastError(this.errorMessage);
              }
          },
          error => {
              this.isLoading = false; // Stop loading spinner
              //this.errorMessage = "An error occurred.";
              // if (error.error && error.error.message) {
              //   this.errorMessage = error.error.message;
              // } else {
              //     this.errorMessage = error.message || "An error occurred.";
              // }
              this.__shared.toastError(error.error.message);
          }
      );
    }
  
    //get details............
    getDetail(){
      this._detailsTime.getTimeDetailById(this.detailsId)
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
