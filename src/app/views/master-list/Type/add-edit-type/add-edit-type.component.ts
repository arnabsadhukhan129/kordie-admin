import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateService } from '../../../../services/master-list/create.service';
import { ViewService } from '../../../../services/master-list/view.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-type',
  templateUrl: './add-edit-type.component.html',
  styleUrls: ['./add-edit-type.component.scss']
})
export class AddEditTypeComponent implements OnInit {

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
    private _type: CreateService,
    private _detailsType: ViewService,
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
          name: ['',[Validators.required]],
          color: [''],
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
        // const formData = this.addEditForm.value;
        const formData = { ...this.addEditForm.value };

        // Ensure color is not empty
        if (!formData.color) {
          formData.color = '#000000';
        }
      
    
        const apiCall = this.detailsId
            ? this._type.editTypeData(this.detailsId, formData)
            : this._type.createTypeData(formData);
    
        apiCall.subscribe(
            response => {
                this.isLoading = false; // Stop loading spinner
                if (!response.error) {
                    this.displayMessage = this.detailsId
                        ? "Details updated successfully."
                        : "Details added successfully.";
                    this.__shared.toastSuccess(this.displayMessage);
                    this.__route.navigate(['/master-list/type-list']);
                } else {
                    this.errorMessage = response.message;
                    this.__shared.toastError(this.errorMessage);
                }
            },
            error => {
                this.isLoading = false; // Stop loading spinner
                // this.errorMessage = "An error occurred.";
                this.__shared.toastError(error.error.message);
            }
        );
      }
    
      //get details............
      getDetail(){
        this.isLoading = true;
        this.__spinner.show();
        this._detailsType.getTypeDetailById(this.detailsId)
          .subscribe((response)=>{
            this.isLoading = false;
            this.__spinner.hide();
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
            this.isLoading = false;
            this.__spinner.hide();
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
          color: this.getData.color ? this.getData.color : '#000000',
        });
      }

}
