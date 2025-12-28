import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlogBannerService } from '../../../services/blog-banner/blog-banner.service';
import { EditorService } from '../../../../app/services/editor/editor.service';
import { ValidationService } from '../../../../app/services/validator/validation.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  addEditForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';
  imagePreview: string | null = null;
  iconPreview: string | null = null;
  selectedFile: File | null = null;
  iconSelectedFile: File | null = null;
  filename:any;
  mediaType:string = '';
  detailsId:string | null = null;
  getDetails:any;
  isLoading = false;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private __banner: BlogBannerService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService,
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
    this.editorConfig = this.editorSettings.editorConfig();
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      title:['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
      image: [''],
      description: ['',[Validators.required]],
      linktitlte: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]]
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

  sanitizeAndTrimHtml(html: string): string {
    if (!html) return '';

    // Convert HTML to plain text by stripping tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    return textContent.trim(); // Remove extra spaces
  }

  add(){
    const data: any = this.addEditForm.value;
    console.log("description=====",data.description);
    
    // Validate required image
    if (!this.selectedFile && (!this.getDetails || !this.getDetails.image)) {
      this.__shared.toastError('Please upload an image.');
      return;
    }

    //Validate description
    if (!data.description || data.description.trim() === '') { 
      this.__shared.toastError('Please enter description!');
      return;
    }
    const strippedText = this.sanitizeAndTrimHtml(data.description);
  
    if (!strippedText) {
      this.__shared.toastError('Please enter description!');
      return;
    }
    

    const formData = new FormData();
  
    // Append form data fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('linktitle', data.linktitlte);
    // Check if a new image file is selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Add selected file
    } else if (this.getDetails?.image && !this.detailsId) {
      formData.append('image', this.getDetails.image); // Use existing image
    }

    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner

    // Make the API call
    const apiCall = this.detailsId
      ? this.__banner.edit(this.detailsId, formData) // Edit existing title
      : this.__banner.create(formData); // Create new title

    apiCall.subscribe(
      (response: any) => {
        this.isLoading = false; // Stop loading spinner
          this.__spinner.hide(); // Hide visual spinner
        if (!response.error) {
          this.displayMessage = this.detailsId
            ? "Data has been updated successfully"
            : "Data has been saved successfully";
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/blog-banner/list']); // Navigate after success (optional)
        } else {
          this.handleError(response.message);
        }
      },
      (err) => {
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide visual spinner
        this.handleApiError(err);
      }
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

   // Image Selection
    onImageSelected(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files?.[0];
  
      if (file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
  
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a valid image.');
          return;
        }
  
        // Validate file size (10MB max)
        const maxSizeInBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 10MB limit.');
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
  
    // Fetch details for editing
    getDetail() {
      this.__banner.getDetailById(this.detailsId).subscribe(
        (response: any) => {
          if (!response.error) {
            this.getDetails = response?.data;
            this.imagePreview = this.getDetails?.image || null;
            this.patchData();
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
  
    // Patch data for editing
    patchData() {
      this.addEditForm.patchValue({
        title: this.getDetails.title || '',
        description: this.getDetails.description || '',
        linktitlte: this.getDetails.linktitle || '',
      });
    }

}
