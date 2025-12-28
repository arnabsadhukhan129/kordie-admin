import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CuratorsService } from '../../../../app/services/meet-your-curators/curators.service';
import { SharedService } from '../../../../app/services/shared/shared.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  getData:any;
  imagePreview: string | null = null;

  constructor(
    private __fb: FormBuilder,
    private _cutaors: CuratorsService,
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
      desgination: ['',[Validators.required]],
      image: [''],
      at:['',[Validators.required]]
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
    const data: any = this.addEditForm.value;
    // Validate the form
    if (!data.name) {
      this.__shared.toastError("Please enter name!");
      return;
    }
    if (!data.desgination) {
      this.__shared.toastError("Please enter desgination!");
      return;
    }
    if (!data.at) {
      this.__shared.toastError("Please enter at!");
      return;
    }

    if (!this.selectedFile && !this.getData?.image) {
      this.__shared.toastError('Please upload image ');
      return;
    }
  
    const formData = new FormData();
  
    // Append form data fields
    formData.append('name', data.name);
    formData.append('desgination', data.desgination || '');
    formData.append('at', data.at || '');
  
    // Check if a new image file is selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Add the selected file
    } else if (this.getData?.image && !this.detailsId) {
      formData.append('image', this.getData.image); // Add existing image only when editing
    }
  
    // Make the API call
    const apiCall = this.detailsId
      ? this._cutaors.edit(this.detailsId, formData) // Edit existing Data
      : this._cutaors.create(formData); // Create new Data
  
    apiCall.subscribe(
      (response: any) => {
        if (response.success) {
          this.displayMessage = this.detailsId
            ? "Data has been updated successfully"
            : "Data has been saved successfully";
  
          this.__shared.toastSuccess(this.displayMessage);
          // this.__route.navigate(['/section-title-mangement/meet-your-curators/list']); // Navigate after success (optional)
          this.__route.navigate(['/meet-your-curators/list']);
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
  


  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (file) {
      // Allowed file types
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
        this.resetFileSelection(fileInput);
        return;
      }
  
      // Validate file size (e.g., 2MB max)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 2MB limit.');
        this.resetFileSelection(fileInput);
        return;
      }
  
      this.selectedFile = file;
  
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  //Reset the selected file
  resetFileSelection(fileInput: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreview = null;
    fileInput.value = ''; // Clear the input value to allow re-selection
  }
  

  //get details............
  getDetail(){
    this._cutaors.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.success == true)
        {
            this.getData = response.data;
            this.imagePreview =  this.getData?.image ? this.getData?.image : null;
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
      desgination: this.getData.desgination ? this.getData.desgination : '',
      at: this.getData.at ? this.getData.at : '',
    });
  }

}
