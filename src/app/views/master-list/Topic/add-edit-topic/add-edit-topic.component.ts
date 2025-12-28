import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../../../app/services/shared/shared.service';
import {CreateService} from '../../../../services/master-list/create.service';
import {ViewService} from '../../../../services/master-list/view.service';
import {ValidationService} from '../../../../services/validator/validation.service';
import { ProductService } from '../../../../services/product/product.service';

@Component({
  selector: 'app-add-edit-topic',
  templateUrl: './add-edit-topic.component.html',
  styleUrls: ['./add-edit-topic.component.scss']
})
export class AddEditTopicComponent implements OnInit,OnDestroy {
  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  isLoading = false;
  getData: any;
  iconPreview: string | null = null;
  iconUrl: string = '';

  constructor(
        private __fb: FormBuilder,
        private _topic: CreateService,
        private _detailsTopic: ViewService,
        private __route: Router,
        private __shared: SharedService,
        private __spinner: NgxSpinnerService,
        private __activatedRoute: ActivatedRoute,
        private __validationService: ValidationService,
        private _product: ProductService,
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

  ngOnDestroy(): void {
    
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      name: [
        '',[Validators.required, this.__validationService.isEmpty, this.__validationService.noSpace],
      ],
      icon: ['']
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

    if (!this.iconPreview) {
        this.__shared.toastError('Please upload icon!');
        return;
    }
    const data: any = this.addEditForm.value;
    const params = {
      name: data?.name,
      icon:  this.iconUrl || this.getData?.icon
    };
    this.isLoading = true; // Start loading spinner
    
    const apiCall = this.detailsId
        ? this._topic.editTopicData(this.detailsId, params)
        : this._topic.createTopicData(params);

    apiCall.subscribe(
        response => {
            this.isLoading = false; // Stop loading spinner
            if (!response.error) {
                this.displayMessage = this.detailsId
                    ? "Details updated successfully."
                    : "Details added successfully.";
                this.__shared.toastSuccess(this.displayMessage);
                this.__route.navigate(['/master-list/topic-list']);
            } else {
                this.errorMessage = response.message;
                this.__shared.toastError(this.errorMessage);
            }
        },
        error => {
            this.isLoading = false; // Stop loading spinner
            // this.errorMessage = error.error?.message || "An error occurred.";
            this.__shared.toastError(error.error.message);
        }
    );
}


    //Upload Image..............................................
      onImageSelected(event: Event, index: number,type: any): void {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
          const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
          const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      
          if (!allowedTypes.includes(file.type)) {
            this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
            return;
          }
      
          if (file.size > maxSizeInBytes) {
            this.__shared.toastError('File size exceeds the 10MB limit.');
            return;
          }
      
          // Preview the image (optional)
          const reader = new FileReader();
          if(type === 'icon'){
            reader.onload = () => {
              this.iconPreview = reader.result as string; // Show preview image
            };
            reader.readAsDataURL(file);
          }
          // Upload the file and update the form with the actual URL
        this.uploadFile(file, index, type);
        }
      }
  
      uploadFile(file: File, index: number, type:any): void {
        const formData = new FormData();
        formData.append('media', file);
      
        this.isLoading = true;
      
        this._product.upload(formData).subscribe(
          (response) => {
            this.isLoading = false;
      
            if (!response.error) {
              const imageUrl = response?.data?.mediaUrl?.fileUrl;
              if(type === 'icon'){
                this.iconUrl  = imageUrl
                console.log("iconUrl======",this.iconUrl);
                
              }
              else {
                this.__shared.toastError(response.message || 'Upload failed.');
              }
            }
          },
          (error) => {
            this.isLoading = false;
            this.__shared.toastError('An error occurred while uploading the file.');
            console.error("Upload Error:", error);
          }
          );
      }

      //get details............
      getDetail() {
        // Start the loader
        this.isLoading = true;
        this.__spinner.show();
      
        this._detailsTopic.getTopicDetailById(this.detailsId).subscribe(
          (response) => {
            // Stop the loader on success
            this.isLoading = false; // Stop loading spinner
            this.__spinner.hide();
      
            if (response.error === false) {
              this.getData = response.data;
              this.patchData(); // Patch the data into the form
            } else {
              this.__shared.toastError(response.message);
            }
          },
          (err) => {
            // Stop the loader on error
            this.isLoading = false; // Stop loading spinner
            this.__spinner.hide();
      
            console.log(err);
            if (err.status === 403) {
              this.__shared.sessionExpired();
            } else {
              this.__shared.toastError("Failed to load details.");
            }
          }
        );
      }
      

      patchData(){
        this.addEditForm.patchValue({
          name: this.getData.name ? this.getData.name : '',
        });
        this.iconPreview = this.getData?.icon || '';
      }

}
