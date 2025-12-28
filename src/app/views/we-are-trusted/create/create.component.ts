import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { title } from 'process';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { WeTrustedService } from '../../../../app/services/we-trusted/we-trusted.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  saveSubscription!: Subscription;
  detailsSubscription!: Subscription;
  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  getData:any;
  imagePreview: string | null = null;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _trusted:WeTrustedService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService
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
    this.editorConfig = this.editorSettings.editorConfig();
  }

  ngOnDestroy(): void {
    if(this.saveSubscription){
      this.saveSubscription.unsubscribe();
    }
    if(this.detailsSubscription){
      this.detailsSubscription.unsubscribe();
    }
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      title:['',[Validators.required]],
      description: ['',[Validators.required]],
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
    const data: any = this.addEditForm.value;
    // Validate the form
    if (!data.title) {
      this.__shared.toastError("Please enter title!");
      return;
    }
    if (!data.description) {
      this.__shared.toastError("Please enter description!");
      return;
    }

    if (!this.selectedFile && !this.getData?.icon) {
      this.__shared.toastError('Please upload icon ');
      return;
    }
  
    const formData = new FormData();
  
    // Append form data fields
    formData.append('title', data.title);
    formData.append('description', data.description || '');
  
    // Check if a new image file is selected
    if (this.selectedFile) {
      formData.append('icon', this.selectedFile); // Add the selected file
    } else if (this.getData?.icon && !this.detailsId) {
      formData.append('icon', this.getData.icon); // Add existing image only when editing
    }
  
    // Make the API call
    const apiCall = this.detailsId
      ? this._trusted.edit(this.detailsId, formData) // Edit existing Data
      : this._trusted.create(formData); // Create new Data
  
    this.saveSubscription = apiCall.subscribe(
      (response: any) => {
        if (!response.error) {
          this.displayMessage = this.detailsId
            ? "Data has been updated successfully"
            : "Data has been saved successfully";
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/section-title-mangement/we-trusted/list']); // Navigate after success (optional)
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
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp','image/svg+xml'];
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG icon.');
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
    this.detailsSubscription = this._trusted.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response.data;
            this.imagePreview =  this.getData?.icon ? this.getData?.icon : null;
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
      title: this.getData.title ? this.getData.title : '',
      description: this.getData.description ? this.getData.description : '',
    });
  }

}
