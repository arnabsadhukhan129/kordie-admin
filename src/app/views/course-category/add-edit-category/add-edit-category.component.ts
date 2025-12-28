import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CourseService } from '../../../../app/services/category-course/course.service';
import { EditorService } from '../../../../app/services/editor/editor.service';
// import { String } from 'aws-sdk/clients/cloudsearchdomain';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {

  @ViewChild('brandFileInput', { static: false }) brandFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bannerFileInput', { static: false }) bannerFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('schoolFileInput', { static: false }) schoolFileInput!: ElementRef<HTMLInputElement>;

  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  socialMediaSelectedFile: File | null = null;
  bannerSelectedFile: File | null = null;
  brandSelectedFile: File | null = null;
  schoolSelectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  socialMediaImagePreview: string | null = null;
  bannerImagePreview: string | null = null;
  bannerVideoPreview: string | null = null;
  brandImagePreview: string | null = null;
  brandVideoPreview: string | null = null;
  schoolImagePreview: string | null = null;
  schoolVideoPreview: string | null = null;
  isLoading = false;
  getData: any;
  bannerType:string | null = null;
  brandType:any;
  schoolType: any;
  filename:any;
  editorConfig: any;
  
  constructor(
    private __fb: FormBuilder,
    private _category: CourseService,
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

   createForm()
      {
        this.addEditForm = this.__fb.group({
          name:['',[Validators.required]],
          slug:[''],
          category_image: [''],
          bannerTitle: ['',[Validators.required]],
          bannerSubtitle: ['',[Validators.required]],
          bannerDescription: ['',[Validators.required]],
          bannerMediaType: ['',[Validators.required]],
          bannerTag: ['',[Validators.required]],
          bannerMedia: [''],
          brandsectionTitle: ['',[Validators.required]],
          // brandTitle: ['',[Validators.required]],
          brandMediaType: ['',[Validators.required]],
          brandMedia: [''],
          link: ['',[Validators.required]],
          //crucialSkillsetTitle: ['',[Validators.required]],
          productsectionTitle:['',[Validators.required]],
          productsectionDescription: ['',[Validators.required]],
          
          collectionsectionTitle: ['',[Validators.required]],
          collectionsectionDescription: ['',[Validators.required]],
          relatedsectionTitle: ['',[Validators.required]],
          relatedsectionDescription: ['',[Validators.required]],
          relatedsectionLink: ['',[Validators.required]],
          socialmediaTitle: ['',[Validators.required]],
          socialmediaDescription: ['',[Validators.required]],
          socialmedia_image: [''],
          // socialmediaLink: ['',[Validators.required]],
          //whylearnTitle: ['',[Validators.required]], //for now disable -Aashutosh
          //faqTitle: ['',[Validators.required]],
          schoolTitle: ['',[Validators.required]],
          schoolMediaType: ['',[Validators.required]],
          schoolMedia: [''],
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
        if(this.detailsId){
          if(!data.slug){
            this.__shared.toastError('Please enter slug!');
          return;
          }
        }
        // Log blank fields
        // const blankFields: string[] = [];
        // Object.keys(this.addEditForm.controls).forEach((key) => {
        //     if (!data[key]) {
        //         blankFields.push(key);
        //     }
        // });
        // if (blankFields.length > 0) {
        //     console.log('The following fields are blank:', blankFields);
        // }

        // if (!this.selectedFile && !this.getData?.category_image) {
        //   this.__shared.toastError('Please upload category image!');
        //   return;
        // }

        if (!this.bannerSelectedFile && !this.getData?.herosection?.media) {
          this.__shared.toastError('Please upload banner image or video!');
          return;
        }

        // if (!this.socialMediaSelectedFile && !this.getData?.socialmedia?.image) {
        //   this.__shared.toastError('Please upload social media image!');
        //   return;
        // }

        if (!this.brandSelectedFile && !this.getData?.brandsection?.media) {
          this.__shared.toastError('Please upload brand image or video!');
          return;
        }

        if (!this.schoolSelectedFile && !this.getData?.school?.media) {
          this.__shared.toastError('Please upload school image or video!');
          return;
        }

        if (this.addEditForm.invalid) {
          return;
       }
  
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('slug', data.slug || '');
        formData.append('herosection_title', data.bannerTitle || '');
        formData.append('herosection_subtitle', data.bannerSubtitle || '');
        formData.append('herosection_description', data.bannerDescription || '');
        formData.append('herosection_tags', data.bannerTag || '');
        formData.append('herosection_link', data.link || '');
        formData.append('herosection_type', data.bannerMediaType || '');
        formData.append('brandsection_title', data.brandsectionTitle || '');
        formData.append('brandsection_type', data.brandMediaType || '');
        formData.append('socialmedia_name', data.socialmediaTitle || '');
        formData.append('socialmedia_description', data.socialmediaDescription || '');
        // formData.append('socialmedia_link', data.socialmediaLink || '');
        formData.append('crucialskillset_title', data.crucialSkillsetTitle || '');
        formData.append('productsection_title', data.productsectionTitle || '');
        formData.append('productsection_description', data.productsectionDescription || '');
        formData.append('collection_title', data.collectionsectionTitle || '');
        formData.append('collection_description', data.collectionsectionDescription || '');
        formData.append('whylearn_title', data.whylearnTitle || '');
        formData.append('relatedmaterial_title', data.relatedsectionTitle || '');
        formData.append('relatedmaterial_description', data.relatedsectionDescription || '');
        formData.append('relatedmaterial_link', data.relatedsectionLink || '');
        formData.append('school_title', data.schoolTitle || '');
        formData.append('school_type', data.schoolMediaType || '');
        formData.append('faq_title', data.faqTitle || '');

        // Handle banner media
        if (this.bannerType === 'image' && this.bannerSelectedFile) {
          formData.append('herosection_media', this.bannerSelectedFile); // Append the selected image
        } else if (this.bannerType === 'video' && this.bannerSelectedFile) {
            formData.append('herosection_media', this.bannerSelectedFile); // Append the selected video
        }
  
      // Handle brand media
      if (this.brandType === 'image' && this.brandSelectedFile) {
          formData.append('brandsection_media', this.brandSelectedFile); // Append the selected image
      } else if (this.brandType === 'video' && this.brandSelectedFile) {
          formData.append('brandsection_media', this.brandSelectedFile); // Append the selected video
      }
  
      // Handle school media
      if (this.schoolType === 'image' && this.schoolSelectedFile) {
          formData.append('school_media', this.schoolSelectedFile); // Append the selected image
      } else if (this.schoolType === 'video' && this.schoolSelectedFile) {
          formData.append('school_media', this.schoolSelectedFile); // Append the selected video
      }
    
      // Check if a new image file is selected
      // if (this.selectedFile) {
      //   formData.append('category_image', this.selectedFile); // Add the selected file
      // } else if (this.getData?.category_category_image && !this.detailsId) {
      //   formData.append('category_image', this.getData?.category_image); // Add existing image only when editing
      // }

      // Check if a new image file is selected
      if (this.socialMediaSelectedFile) {
        formData.append('socialmedia_image', this.socialMediaSelectedFile); // Add the selected file
      } else if (this.getData?.social?.image && !this.detailsId) {
        formData.append('socialmedia_image', this.getData?.social?.image); // Add existing image only when editing
      }
  
       // Show loader
        this.isLoading = true;
        this.__spinner.show(); // Start visual spinner
    
        // this.isLoading = true; // Start loading spinner
        // const formData = this.addEditForm.value;
    
        const apiCall = this.detailsId
            ? this._category.edit(this.detailsId, formData)
            : this._category.create(formData);
    
        apiCall.subscribe(
            response => {
              this.isLoading = false; // Stop loading spinner
              this.__spinner.hide(); // Hide visual spinner
              if (!response.error) {
                  this.displayMessage = this.detailsId
                      ? "Details updated successfully."
                      : "Details added successfully.";
                  this.__route.navigate(['/course-category/list']);
                  this.__shared.toastSuccess(this.displayMessage);
              } else {
                  this.errorMessage = response.message;
                  this.__shared.toastError(this.errorMessage);
              }
          },
            error => {
                this.isLoading = false; // Stop loading spinner
                this.__spinner.hide(); // Hide visual spinner
                this.errorMessage = error.error.message;
                this.__shared.toastError(this.errorMessage);
            }
        );
      }
    
      //get details............
      getDetail(){
        this._category.getDetailById(this.detailsId)
          .subscribe((response)=>{
            if(response.error == false)
            {
                this.getData = response?.data;
                // console.log("getData....",this.getData);
                
                this.imagePreview =  this.getData?.category_image ? this.getData?.category_image : null;
                this.socialMediaImagePreview = this.getData?.socialmedia?.image ? this.getData?.socialmedia?.image  : null;
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
          name: this.getData.name ? this.getData.name : '',
          slug: this.getData.slug ? this.getData.slug : '',
          bannerTitle: this.getData.herosection.title ? this.getData.herosection.title : '',
          bannerSubtitle: this.getData.herosection.subtitle ? this.getData.herosection.subtitle : '',
          bannerDescription: this.getData.herosection.description ? this.getData.herosection.description : '',
          bannerTag: this.getData.herosection.tags
          ? this.getData.herosection.tags.join(', ')
          : '',
          bannerMediaType: this.getData.herosection.type ? this.getData.herosection.type : '',
          link: this.getData.herosection.link ? this.getData.herosection.link : '',
          crucialSkillsetTitle: this.getData.crucialskillset?.title ? this.getData.crucialskillset?.title : '',
          productsectionTitle: this.getData.productsection?.title ? this.getData.productsection?.title : '',
          productsectionDescription: this.getData.productsection.description ? this.getData.productsection.description : '',
          // brandsectionTitle: this.getData.brandsection.title ? this.getData.brandsection.title : '',
          collectionsectionTitle: this.getData.collectionsection.title ? this.getData.collectionsection.title : '',
          collectionsectionDescription: this.getData.collectionsection.description ? this.getData.collectionsection.description : '',
          relatedsectionTitle: this.getData.relatedmaterial.title ? this.getData.relatedmaterial.title : '',
          relatedsectionDescription: this.getData.relatedmaterial.description ? this.getData.relatedmaterial.description : '',
          relatedsectionLink: this.getData.relatedmaterial.link ? this.getData.relatedmaterial.link : '',
          socialmediaTitle: this.getData.socialmedia.name ? this.getData.socialmedia.name : '',
          socialmediaDescription: this.getData.socialmedia.description ? this.getData.socialmedia.description : '',
          // socialmediaLink: this.getData.socialmedia.link ? this.getData.socialmedia.link : '',
          whylearnTitle: this.getData.whylearn.title ? this.getData.whylearn.title : '',
          faqTitle: this.getData.faq.title ? this.getData.faq.title : '',
          schoolTitle: this.getData.school.title ? this.getData.school.title : '',
          brandsectionTitle: this.getData.brandsection.title ? this.getData.brandsection.title : '',
          brandMediaType: this.getData.brandsection.type ? this.getData.brandsection.type : '',
          schoolMediaType: this.getData.school.type ? this.getData.school.type : '',
        });
        // Handle Bannner media preview
        const mediaUrl = this.getData?.herosection?.media;
        if (mediaUrl) {
          if (this.getData.herosection.type === 'image') {
            this.bannerImagePreview = mediaUrl; // Set the preview URL for images
            this.bannerType = 'image'; // Set the media type to image
          } else if (this.getData.herosection.type === 'video') {
            this.bannerVideoPreview = mediaUrl; // Set the preview URL for videos
            this.bannerType = 'video'; // Set the media type to video
          }
      }

      // Handle Brand media preview
      const brandMediaUrl = this.getData?.brandsection?.media;
        if (brandMediaUrl) {
          if (this.getData.brandsection.type === 'image') {
            this.brandImagePreview = brandMediaUrl; // Set the preview URL for images
            this.brandType = 'image'; // Set the media type to image
          } else if (this.getData.brandsection.type === 'video') {
            this.brandVideoPreview = brandMediaUrl; // Set the preview URL for videos
            this.brandType = 'video'; // Set the media type to video
          }
      }

      // Handle School media preview
      const schoolMediaUrl = this.getData?.school?.media;
        if (schoolMediaUrl) {
          if (this.getData.school.type === 'image') {
            this.schoolImagePreview = schoolMediaUrl; // Set the preview URL for images
            this.schoolType = 'image'; // Set the media type to image
          } else if (this.getData.school.type === 'video') {
            this.schoolVideoPreview = schoolMediaUrl; // Set the preview URL for videos
            this.schoolType = 'video'; // Set the media type to video
          }
      }
    }
  
      onImageSelected(event: Event,type:any): void {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
        this.filename = null; 
        
        if (file) {
          this.filename = file.name;
          // Allowed file types
          const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp','image/svg+xml'];
          
          // Validate file type
          if (!allowedTypes.includes(file.type)) {
            this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
            
            this.resetFileSelection(type);
            return;
          }
      
          // Validate file size (e.g., 2MB max)
          const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
          if (file.size > maxSizeInBytes) {
            this.__shared.toastError('File size exceeds the 2MB limit.');
            
            this.resetFileSelection(type);
            return;
          }
          const reader = new FileReader();
          if(type === 'category'){
            this.selectedFile = file;
      
            // Preview the image      
            reader.onload = () => {
              this.imagePreview = reader.result as string;
            };
          }
          else if(type === 'social'){
            this.socialMediaSelectedFile = file;
      
            // Preview the image
            reader.onload = () => {
              this.socialMediaImagePreview = reader.result as string;
            };
          }
          reader.readAsDataURL(file);
        }
      }
      
      //Reset the selected file
      resetFileSelection(type: String): void {
        // Reset the selected file and preview
        if(type === 'category'){
          this.selectedFile = null;
        }
        else if(type === 'social'){
          this.socialMediaSelectedFile = null;
        }
        this.filename = null;

        const fileInput: HTMLInputElement | null = document.querySelector('input[type="file"]');
        console.log("fileInput=====",fileInput);
        
        if (fileInput) {
          fileInput.value = '';  // Reset the file input value to allow re-selection
        }
      }

      //Reset the media selected file
      resetMediaFileSelection(type: string): void {
        // Reset the selected file and preview
        if (type === 'banner') {
          this.bannerSelectedFile = null;
          // this.bannerImagePreview = null;
          // this.bannerVideoPreview = null;
          if (this.bannerFileInput) {
            this.bannerFileInput.nativeElement.value = '';
          }
        } else if (type === 'brand') {
          this.brandSelectedFile = null;
          // this.brandImagePreview = null;
          // this.brandVideoPreview = null;
          if (this.brandFileInput) {
            this.brandFileInput.nativeElement.value = '';
          }
        } else if (type === 'school') {
          this.schoolSelectedFile = null;
          // this.schoolImagePreview = null;
          // this.schoolVideoPreview = null;
          if (this.schoolFileInput) {
            this.schoolFileInput.nativeElement.value = '';
          }
        }
      }

    

      onMediaSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          if (this.bannerType === 'image') {
            this.handleImage(file,'banner');
          } else if (this.bannerType === 'video') {
            this.handleVideo(file,'banner');
          }
        }
      }

      onBrandMediaSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          if (this.brandType === 'image') {
            this.handleImage(file,'brand');
          } else if (this.brandType === 'video') {
            this.handleVideo(file,'brand');
          }
        }
      }

      onSchoolMediaSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          if (this.schoolType === 'image') {
            this.handleImage(file,'school');
          } else if (this.schoolType === 'video') {
            this.handleVideo(file,'school');
          }
        }
      }
    
      handleImage(file: File, type: string): void {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp','image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
          this.resetMediaFileSelection(type);
          return;
        }
    
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 2MB limit.');
          this.resetMediaFileSelection(type);
          return;
        }
    
        if (type === 'banner') {
          this.bannerSelectedFile = file;
        } else if (type === 'brand') {
          this.brandSelectedFile = file;
        } else if (type === 'school') {
          this.schoolSelectedFile = file;
        }
    
        const reader = new FileReader();
        reader.onload = () => {
          if (type === 'banner') {
            this.bannerImagePreview = reader.result as string;
          } else if (type === 'brand') {
            this.brandImagePreview = reader.result as string;
          } else if (type === 'school') {
            this.schoolImagePreview = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    
      handleVideo(file: File, type: string): void {
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
          this.resetMediaFileSelection(type);
          return;
        }
    
        const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 80MB limit.');
          this.resetMediaFileSelection(type);
          return;
        }
    
        if (type === 'banner') {
          this.bannerSelectedFile = file;
        } else if (type === 'brand') {
          this.brandSelectedFile = file;
        } else if (type === 'school') {
          this.schoolSelectedFile = file;
        }
    
        const reader = new FileReader();
        reader.onload = () => {
          if (type === 'banner') {
            this.bannerVideoPreview = reader.result as string;
          } else if (type === 'brand') {
            this.brandVideoPreview = reader.result as string;
          } else if (type === 'school') {
            this.schoolVideoPreview = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    
      selectType(event:any,type: string){
        // this.resetFileSelection();
        if(type === "banner"){
          this.bannerType = event?.target?.value;
        }
        else if(type === "brand"){
          this.brandType = event?.target?.value;
        }
        else if(type === "school"){
          this.schoolType = event?.target?.value;
        }
      }

}
