import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {TitleService} from '../../../../app/services/title/title.service'
import { SharedService } from '../../../../app/services/shared/shared.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  addTitleForm: any;
  displayMessage: string = '';
  errorMessage: string = '';
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  selectedFile: File | null = null;
  selectedVideo: File | null = null;
  titleId: string | null = null;
  titleData: any;
  title1: boolean = false;
  title2: boolean = false;
  title3: boolean = false;
  title4: boolean = false;
  title5: boolean = false;
  title6: boolean = false;
  title7: boolean = false;
  title8: boolean = false;
  title9: boolean = false;
  title10: boolean = false;
  title11: boolean = false;
  title12: boolean = false;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _title: TitleService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService
  ) { 
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.titleId = params.get('id');
      },
      error: err => {}
    });
  }

  ngOnInit(): void {
    this.createForm();
    if(this.titleId){
      this.getDetail();
      this.showField();
    }
    this.editorConfig = this.editorSettings.editorConfig();
  }

  createForm()
  {
    this.addTitleForm = this.__fb.group({
      name:['',[Validators.required]],
      subtitle: [''],
      image: [''],
      description:[''],
      url:[''], 
      video: [''], 
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

  addEditTitle(): void {
    const data: any = this.addTitleForm.value;
  
    // Validate the form
    if (!data.name) {
      this.__shared.toastError("Please enter a title name!");
      return;
    }
  
    const formData = new FormData();
  
    // Append form data fields
    formData.append('name', data.name);
    formData.append('subtitle', data.subtitle);
    formData.append('description', data.description || '');
    formData.append('url', data.url || '');
  
    // Check if a new image file is selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Add the selected file
    } else if (this.titleData?.image && !this.titleId) {
      formData.append('image', this.titleData.image); // Add existing image only when editing
    }


    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo); // Add video file
    }else if (this.titleData?.video && !this.titleId) {
      formData.append('video', this.titleData.video); // Add existing image only when editing
    }
  
    // Make the API call
    const apiCall = this.titleId
      ? this._title.editTitle(this.titleId, formData) // Edit existing title
      : this._title.createTitle(formData); // Create new title
  
    apiCall.subscribe(
      (response: any) => {
        if (!response.error) {
          this.displayMessage = this.titleId
            ? "Title has been updated successfully"
            : "Title has been saved successfully";
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/section-title-mangement/titlelist']); // Navigate after success (optional)
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
  


  //Preview Image
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG or JPEG image.');
        return;
      }
  
      // Validate file size (e.g., 2MB max)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 2MB limit.');
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


  onVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        // Validate file type
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(file.type)) {
            this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
            return;
        }

        // Validate file size (e.g., 80MB max)
        const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
        if (file.size > maxSizeInBytes) {
            this.__shared.toastError('File size exceeds the 80MB limit.');
            return;
        }

        this.selectedVideo = file;

        // Preview the video
        const reader = new FileReader();
        reader.onload = () => {
            this.videoPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}

  

  //get details............
  getDetail(){
    this._title.getTitleDetail(this.titleId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.titleData = response.data;
            this.imagePreview =  this.titleData?.image ? this.titleData?.image : null;
            this.videoPreview =  this.titleData?.video ? this.titleData?.video : null;
            this.patchUserData();
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

  patchUserData(){
    this.addTitleForm.patchValue({
      name: this.titleData.name ? this.titleData.name : '',
      subtitle: this.titleData.subtitle ? this.titleData.subtitle : '',
      description: this.titleData.description ? this.titleData.description : '',
      url: this.titleData.url ? this.titleData.url : '',
    });
  }

/**Show Fields depends on condition... */
 showField() {
  this.title1 = this.titleId === '67498e27ecf109fee481f59d';
  this.title2 = this.titleId === '6749abaa433825a3948ddea9';
  this.title3 = this.titleId === '674d9bf1f3f72fd1c4331597';
  this.title4 = this.titleId === '674dc2ab467464979dcc86ba';
  this.title5 = this.titleId === '674ed1ea6f534000dab852f6';
  this.title6 = this.titleId === '674eecb02a26a746f7a1fd8c';
  this.title7 = this.titleId === '674f00831afb687b4f195444';
  this.title8 = this.titleId === '674f01a21afb687b4f19545d';
  this.title9 = this.titleId === '674f02a61afb687b4f19546c';
  this.title10 = this.titleId === '674f06671afb687b4f19548c';
  this.title11 = this.titleId === '67568fdb383eacd473729dcd';
  this.title12 = this.titleId === '67a350434d4f691c82b89b1a';
}


}
