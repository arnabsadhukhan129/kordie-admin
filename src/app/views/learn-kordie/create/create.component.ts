import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LearnKordieService } from '../../../../app/services/learn-kordie/learn-kordie.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  addEditForm:any
  displayMessage : string = '';
  errorMessage : string = '';
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  selectedFile: File | null = null;
  filename:any;
  mediaType:string = '';
  detailsId:string | null = null;
  getDetails:any;
  getDescription:string = '';
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _learnkordie: LearnKordieService,
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

  //Initalize Form......
  createForm()
  {
    this.addEditForm = this.__fb.group({
      title:['',[Validators.required]],
      description: ['',[Validators.required]],
      type: ['',[Validators.required]],
      media: ['']
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

  add(){
    const data: any = this.addEditForm.value;
    
    if (!this.selectedFile && !this.getDetails?.media) {
      this.__shared.toastError('Please upload ' + this.mediaType);
      return;
    }
    const formData = new FormData();
  
    // Append form data fields
    formData.append('title', data.title);
    formData.append('body', data.description);
    formData.append('type', data.type);
     // Check if a new image file is selected
     if (this.selectedFile) {
      formData.append('media', this.selectedFile); // Add the selected file
    } else if (this.getDetails?.media && !this.detailsId) {
      formData.append('media', this.getDetails.media); // Add existing image only when editing
    }
    // Make the API call
    const apiCall = this.detailsId
      ? this._learnkordie.edit(this.detailsId, formData) // Edit existing title
      : this._learnkordie.create(formData); // Create new title

    apiCall.subscribe(
      (response: any) => {
        if (!response.error) {
          this.displayMessage = this.detailsId
            ? "Data has been updated successfully"
            : "Data has been saved successfully";
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/section-title-mangement/learn-kordie/list']); // Navigate after success (optional)
        } else {
          this.handleError(response.message);
        }
      },
      (err) => this.handleApiError(err)
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

  onMediaSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.mediaType === 'image') {
        this.handleImage(file);
      } else if (this.mediaType === 'video') {
        this.handleVideo(file);
      }
    }
  }

  handleImage(file: File): void {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
      this.resetFileSelection();
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 2MB limit.');
      this.resetFileSelection();
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

  handleVideo(file: File): void {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
      this.resetFileSelection();
      return;
    }

    const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 80MB limit.');
      this.resetFileSelection();
      return;
    }

    this.selectedFile = file;

    // Preview the video
    const reader = new FileReader();
    reader.onload = () => {
      this.videoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  selectType(event:any){
    this.resetFileSelection();
    this.mediaType = event?.target?.value;
  }

  resetFileSelection(): void {
    // Reset the selected file and preview
    this.selectedFile = null;
    this.filename = null;
    this.imagePreview = null;
    this.videoPreview = null;
  
    // Optionally, reset the file input element itself (if needed)
    const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
    if (fileInput) {
      fileInput.value = '';  // Clear the file input value
    }
  }

   //get details............
   getDetail(){
    this._learnkordie.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.success == true)
        {
            this.getDetails = response.data;
            this.getDescription = response.data.body;
            this.patchData();
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
      title: this.getDetails.title || '',
      description: '',
      type: this.getDetails.type || ''
    });
    setTimeout(() => {
      this.addEditForm.patchValue({
        description: this.getDetails.body || '' // Patch the description after CKEditor is ready
      });
    }, 100); // Delay slightly
   
    // Handle media preview
    const mediaUrl = this.getDetails?.media;
    if (mediaUrl) {
      if (this.getDetails.type === 'image') {
        this.imagePreview = mediaUrl; // Set the preview URL for images
        this.mediaType = 'image'; // Set the media type to image
      } else if (this.getDetails.type === 'video') {
        this.videoPreview = mediaUrl; // Set the preview URL for videos
        this.mediaType = 'video'; // Set the media type to video
      }
    }
  }

  onEditorReady(event: any): void {
    // console.log('CKEditor is ready!');
    // Optionally, patch the description value here
    this.addEditForm.patchValue({
      description: this.getDescription || '',
    });
  }
  

}
