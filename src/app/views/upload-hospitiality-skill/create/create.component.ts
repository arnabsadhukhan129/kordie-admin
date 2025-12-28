import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadService } from '../../../services/upskill/upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  logoPreview: string | null = null;
  isLoading = false;
  imgUrl: string = '';
  detailsId: string | null = null;
  getDetails: any;
  addEditForm!: FormGroup;
  displayMessage: string = '';
  errorMessage: string = '';

  constructor(
    private __fb: FormBuilder,
    private __uploadFile: UploadService,
    private __route: Router,
    private __shared: SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute: ActivatedRoute,
    private _product: ProductService,
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.detailsId = params.get('id');
      },
      error: (err) => {},
    });
   }

  ngOnInit(): void {
    this.createForm();
    if (this.detailsId) {
      this.getDetail();
    }
  }

  // Initialize Form
  createForm() {
    this.addEditForm = this.__fb.group({   
      logo: [''],
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
      if(type === 'logoImg'){
        reader.onload = () => {
          this.logoPreview = reader.result as string; // Show preview image
        };
        reader.readAsDataURL(file);
      }
      
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
          if(type === 'logoImg'){
            this.imgUrl  = imageUrl
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

    add(){
      if (!this.logoPreview) {
        this.__shared.toastError('Please upload logo');
        return;
      }
      const params: any = {
        logo:  this.imgUrl || this.getDetails?.logo,
      }
       // Show loader
       this.isLoading = true;
       this.__spinner.show(); // Start visual spinner
       const apiCall = this.detailsId
       ? this.__uploadFile.edit(this.detailsId, params)
       : this.__uploadFile.create(params);
 
       apiCall.subscribe(
         response => {
           this.isLoading = false; // Stop loading spinner
           this.__spinner.hide(); // Hide visual spinner
           if (!response.error) {
               this.displayMessage = this.detailsId
                   ? "Logo updated successfully."
                   : "Logo added successfully.";
               this.__shared.toastSuccess(this.displayMessage);
               this.__route.navigate(['/section-title-mangement/hospitality-upskilling/list']);
           } else {
               this.errorMessage = response.message;
               this.__shared.toastError(this.errorMessage);
           }
       },
         error => {
             this.isLoading = false; // Stop loading spinner
             this.__spinner.hide(); // Hide visual spinner
             this.errorMessage = "Maximum of 7 records allowed. Please delete an existing record before adding a new one.";
             this.__shared.toastError(this.errorMessage);
         }
       ); 
    }

  // Fetch details for editing
  getDetail() {
    this.__uploadFile.getDetailById(this.detailsId).subscribe(
      (response: any) => {
        if (!response.error) {
          this.getDetails = response?.data;
          console.log("this.getDetails====",this.getDetails);
          // this.patchData();
        } else {
          this.__shared.toastError(response.message);
        }
      },
      (err) => {
        if (err.status === 403) {
          this.__shared.sessionExpired();
        } else {
          this.__shared.toastError('Error fetching details.');
        }
      }
    );
  }

}
