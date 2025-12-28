import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentServiceService } from '../../../services/content-management/content-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageService } from '../../../services/page/page.service';
import { ValidationService } from '../../../services/validator/validation.service';
import { ProductService } from '../../../services/product/product.service';
import { EditorService } from '../../../services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  addEditForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';
  sections!: FormArray;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  detailsId:string | null = null;
  selectedFile: File | null = null;
  videoSelectedFile: File | null = null;
  imageUrl: string = '';
  videoUrl: string = '';
  isLoading = false;
  getData:any;
  editorConfig: any;
  isEditorVisible = false;
  bodyDetails: any;
  descriptionDetails:any;

  constructor(
    private __fb: FormBuilder,
    private _content: ContentServiceService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private _pageService:PageService,
    private __validationService: ValidationService,
    private _product: ProductService,
    private editorSettings: EditorService,
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
    // Delay CKEditor initialization
     setTimeout(() => {
      this.isEditorVisible = true;
    }, 500); 
    this.editorConfig = this.editorSettings.editorConfig();
  }

  //Initalize Form......
     createForm()
     {
      this.addEditForm = this.__fb.group({
        title:['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
        url: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
        body: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
        meta_title: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
        meta_description: ['',[Validators.required,this.__validationService.isEmpty]],
        meta_keywords: [[],[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
        images: [''],
        videos: [''],
        sections: this.__fb.array([this.createteSectionItem()]),
      });
      this.sections = this.addEditForm.get('sections') as FormArray;
     }
  
     get sectionControls() {
      return (this.addEditForm.get('sections') as FormArray).controls;
    }

    // Create a new stats item form group
    createteSectionItem() {
    return this.__fb.group({
      title: [''],
      content: ['']
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

    //Remove Section Section
    removeSectionItem(index: number) {
      this.sections.removeAt(index);
    }

    //add stats item...........
    addSectionItem() {
      const sectionItem = this.__fb.group({
        title: [''],
        content: ['']
      });

      this.sections.push(sectionItem);
    }

    add(): void {
      this.ensureArrayValues('meta_keywords');
      const data: any = this.addEditForm.value;
      let img:any = [];
      let vid:any = [];

      if(this.selectedFile && !this.getData?.images[0]){
        img[0] = this.imageUrl;
      }
      else if(this.selectedFile && this.getData?.images[0]){
        img.splice(0,1,this.imageUrl)
      }
      else{
        img[0] = this.getData?.images[0];
      }

      if(this.videoSelectedFile && !this.getData?.videos[0]){
        vid[0] = this.videoUrl;
      }
      else if(this.videoSelectedFile && this.getData?.videos[0]){
        vid.splice(0,1,this.videoUrl)
      }
      else{
        vid[0] = this.getData?.videos[0];
      }
      
      const params = {
        title: data.title,
        url: data.url,
        body:  data.body,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords, // Send array directly
        images: img,
        videos: vid,
        sections:data.sections
      }
     
      this.isLoading = true; // Stop loading spinner
      this.__spinner.show();

      const apiCall = this.detailsId
        ? this._content.edit(this.detailsId, params)
        : this._content.create(params);
        apiCall.subscribe(
          response => {
              this.isLoading = false; // Stop loading spinner
              this.__spinner.hide();

              if (!response.error) {
                  this.displayMessage = this.detailsId
                      ? "Details updated successfully."
                      : "Details added successfully.";
                  this.__route.navigate(['/content/list']);
                  this.__shared.toastSuccess(this.displayMessage);
              } else {
                  this.errorMessage = response.message;
                  this.__shared.toastError(this.errorMessage);
              }
          },
          error => {
             this.isLoading = false; // Stop loading spinner
              this.__spinner.hide();
              this.errorMessage = "An error occurred.";
              this.__shared.toastError(this.errorMessage);
          }
      );
      
    }
    

  //image upload.........
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if(file){
      this.uploadImageFile(file);
    }
  }

  uploadImageFile(file: File): void {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
      return;
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
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
    this.getImageURL(file,'image')
  }


  //Video upload.......
  onvideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if(file){
      this.uploadVideoFile(file);
    }
  }

  uploadVideoFile(file: File): void {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
      return;
    }

    const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 80MB limit.');
      return;
    }

    this.videoSelectedFile = file;

    // Preview the video
    const reader = new FileReader();
    reader.onload = () => {
      this.videoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.getImageURL(file,'video')
  }

  ensureArrayValues(fieldName: string): void {
    const fieldValue = this.addEditForm.get(fieldName)?.value;
  
    // Ensure the value is always an array
    if (fieldValue) {
      const arrayValue = Array.isArray(fieldValue)
        ? fieldValue
        : fieldValue.split(',').map((value: string) => value.trim()).filter((value: string) => value); // Convert string to array
  
      // Update the form control with the processed array
      this.addEditForm.get(fieldName)?.setValue(arrayValue);
      // this.getArray(this.addEditForm.get(fieldName))
    }
  }

  getImageURL(file: File, type: string){
    const formData = new FormData();
    if(type=== 'image'){
      formData.append('media', file);
    }
    else if(type=== 'video'){
      formData.append('media', file);
    }
    this._product.upload(formData).subscribe(
      (response) => {
        if (!response.error) {
          if(type === 'image'){
            this.imageUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if(type === 'video'){
            this.videoUrl = response?.data?.mediaUrl?.fileUrl;
          }
        }
        else {
          // Handle server-side error
          this.errorMessage = response.message || 'Upload failed.';
          this.__shared.toastError(this.errorMessage);
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while uploading the file.';
        this.__shared.toastError(this.errorMessage);
        console.error(error);
      }
    );
  }

   //get details............
   getDetail(){
    this._content.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response?.data;
            this.bodyDetails = this.getData?.body || '';
            this.descriptionDetails = this.getData?.meta?.description || '';
            this.imagePreview =  this.getData?.images ? this.getData?.images[0] : [];
            this.videoPreview =  this.getData?.videos ? this.getData?.videos[0] : [];
            this.patchData();
            // console.log('app-->', this.getData );
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
      title: this.getData.title  || '',
      url: this.getData.url  || '',
      body: this.bodyDetails,
      meta_title: this.getData?.meta?.title  || '',
      meta_description: this.descriptionDetails,
      meta_keywords: this.getData?.meta?.keywords?.join(', ') || '',
      
    });
    const sectionsArray = this.addEditForm.get('sections') as FormArray;
    sectionsArray.clear(); // Clear existing sections
    if (this.getData?.sections?.length) {
      this.getData.sections.forEach((val: any) => {
        sectionsArray.push(
          this.__fb.group({
            title: [val.title || ''],
            content: [val.content || '']
          })
        );
      });
    }
    else{
      this.addSectionItem();
    }
  }



}
