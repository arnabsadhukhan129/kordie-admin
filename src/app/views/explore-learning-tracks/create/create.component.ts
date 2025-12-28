import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LearningTrackService } from '../../../../app/services/learning-track/learning-track.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  detailsId:string | null = null;
  addtrackingForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  trackingData:any;
  imagePreview: string | null = null;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _track: LearningTrackService,
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

  //Intialize Form....................
  createForm()
  {
    this.addtrackingForm = this.__fb.group({
      name:['',[Validators.required]],
      description: ['',[Validators.required]],
      image: [''],
      link:['']
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
    const data: any = this.addtrackingForm.value;
    // Validate the form
    if (!data.name) {
      this.__shared.toastError("Please enter a name!");
      return;
    }
    if (!data.description) {
      this.__shared.toastError("Please enter description!");
      return;
    }

    if (!this.selectedFile && !this.trackingData?.image) {
      this.__shared.toastError('Please upload image ');
      return;
    }
  
    const formData = new FormData();
  
    // Append form data fields
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('link', data.link || '');
  
    // Check if a new image file is selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Add the selected file
    } else if (this.trackingData?.image && !this.detailsId) {
      formData.append('image', this.trackingData.image); // Add existing image only when editing
    }
  
    // Make the API call
    const apiCall = this.detailsId
      ? this._track.edit(this.detailsId, formData) // Edit existing Data
      : this._track.create(formData); // Create new Data
  
    apiCall.subscribe(
      (response: any) => {
        if (!response.error) {
          this.displayMessage = this.detailsId
            ? "Data has been updated successfully"
            : "Data has been saved successfully";
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/section-title-mangement/explore-learning-tracks/list']); // Navigate after success (optional)
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
      this._track.getDetailById(this.detailsId)
        .subscribe((response)=>{
          
          if(response.error == false)
          {
              this.trackingData = response?.data;
              this.imagePreview =  this.trackingData?.image ? this.trackingData?.image : null;
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
      this.addtrackingForm.patchValue({
        name: this.trackingData.name ? this.trackingData.name : '',
        description: this.trackingData.description ? this.trackingData.description : '',
        link: this.trackingData.link ? this.trackingData.link : '',
      });
    }

}
