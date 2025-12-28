import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhyKordieService } from '../../../services/why-kordie-content/why-kordie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../services/product/product.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  detailsId: string | null = null;
  displayMessage: string = '';
  errorMessage: string = '';
  addEditForm!: FormGroup;
  why_banner!: FormArray;
  learning_description!: FormArray;
  learning_section!: FormArray;
  kordie_section!: FormArray;
  kordie_stand_section!: FormArray;
  next_section!: FormArray;
  bannerImagePreviews: any = [];
  bannerVideoPreviews: any = [];
  sectionImagePreviews: any = [];
  standImagePreviews:any = [];
  nextImagePreviews: any = [];
  nextIconPreviews: any = [];
  isLoading = false;
  mediaType:string = '';
  kordieImagePreview: string | null = null;
  kordieImageUrl: string = '';
  getDetails: any;
  getBannerType: any= [];
  getBannerMedia:any = [];
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private __kordie: WhyKordieService,
    private __route: Router,
    private __shared: SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute: ActivatedRoute,
    private _product: ProductService,
    private editorSettings: EditorService
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
      // console.log("get detail done");
    }
    this.editorConfig = this.editorSettings.editorConfig();
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

  // Initialize Form
  createForm() {
    this.addEditForm = this.__fb.group({
      why_title: ['', [Validators.required]],
      why_description: ['', [Validators.required]],
      why_banner: this.__fb.array([]),
      learning_title: ['', [Validators.required]],
      learning_description: this.__fb.array([]),
      learning_section: this.__fb.array([]),
      kordie_title: ['', [Validators.required]],
      kordie_section: this.__fb.array([]),
      kordie_image: [''],
      kordie_stand_title: ['',[Validators.required]],
      kordie_stand_section: this.__fb.array([]),
      next_title: ['', [Validators.required]],
      next_section: this.__fb.array([]),
      blog_title: ['', [Validators.required]],
    });

    this.why_banner = this.addEditForm.get('why_banner') as FormArray;
    this.ensureBanner(); // Always ensure one about banner item

    this.learning_description = this.addEditForm.get('learning_description') as FormArray;
    this.ensureLearningDescription(); // Always ensure one learning description item

    this.learning_section = this.addEditForm.get('learning_section') as FormArray;
    this.ensureLearningSection(); // Always ensure one learning section item

    this.kordie_section = this.addEditForm.get('kordie_section') as FormArray;
    this.ensureKordieSection(); // Always ensure one kordie section item

    this.kordie_stand_section = this.addEditForm.get('kordie_stand_section') as FormArray;
    this.ensureKordieStandSection(); // Always ensure one kordie section item

    this.next_section = this.addEditForm.get('next_section') as FormArray;
    this.ensureNextsectionItem(); // Always ensure one next section item
  }

    //Getter.....................................................................
    // Getter for Banner controls
    get bannerControls() {
      return (this.addEditForm.get('why_banner') as FormArray)?.controls || [];
    }

    // Getter for learning description controls
    get descriptionControls() {
      return (this.addEditForm.get('learning_description') as FormArray)?.controls || [];
    }

     // Getter for section controls
     get sectionControls() {
      return (this.addEditForm.get('learning_section') as FormArray)?.controls || [];
    }

    // Getter for kordie section controls
    get kordieSectionControls() {
      return (this.addEditForm.get('kordie_section') as FormArray)?.controls || [];
    }

    // Getter for kordie stand section controls
    get standControls() {
    return (this.addEditForm.get('kordie_stand_section') as FormArray)?.controls || [];
    }

    // Getter for next section controls
    get nextControls() {
      return (this.addEditForm.get('next_section') as FormArray)?.controls || [];
    }

    //Create.............................................................
    // Create a new banner item
    createBannerItem() {
      return this.__fb.group({
        media:[''],
        type: ['']
      });
    }

     // Create a new banner item
     createDescriptionItem() {
      return this.__fb.group({
        title: ['']
      });
    }

    // Create a new banner item
    createLearningSectionItem() {
      return this.__fb.group({
        title: [''],
        description: [''],
        image: ['']
      });
    }

    // Create a new kordie section item
    createKordieSectionItem(){
      return this.__fb.group({
        description: [''],
      })
    }

    // Create a new kordie stand section item
    createKordieStandSectionItem(){
      return this.__fb.group({
        title: [''],
        description: [''],
        image: ['']
      })
    }

    // Create a new story section item
    createNextSectionItem() {
      return this.__fb.group({
        title: [''],
        description: [''],
        image:[''],
        icon:['']
      });
    }

    //Add................................................................
    // Add banner item
    addBannerItem() {
      this.why_banner.push(this.createBannerItem());
    }

    //Add learning description
    addDescriptionItem(){
      this.learning_description.push(this.createDescriptionItem());
    }

     //Add learning section
     addLearningSectionItem(){
      this.learning_section.push(this.createLearningSectionItem());
    }

    //Add Kordie Section
    addKordieSectionItem(){
      this.kordie_section.push(this.createKordieSectionItem());
    }

    //Add Kordie Stand Section
    addKordieStandSectionItem(){
      this.kordie_stand_section.push(this.createKordieStandSectionItem());
    }

    // Add next section item
    addnextSectionItem(){
      this.next_section.push(this.createNextSectionItem());
    }

    //Remove...................................................................
    // Remove Banner item
    removeBannerItem(index: number) {
      this.why_banner.removeAt(index);
      this.getBannerType.splice(index, 1);
      this.bannerImagePreviews.splice(index, 1);
      this.bannerVideoPreviews.splice(index, 1);
      // this.bannerImagePreviews[index]= '';
      // this.bannerVideoPreviews[index]= '';
      this.ensureBanner(); // Ensure at least one item remains
    }

     // Remove description item
     removeDescriptionItem(index: number) {
      this.learning_description.removeAt(index);
      this.ensureLearningDescription(); // Ensure at least one item remains
    }

    // Remove learning section item
    removeLearningSectionItem(index: number) {
      this.learning_section.removeAt(index);
      this.sectionImagePreviews.splice(index, 1);
      // this.sectionImagePreviews[index]= '';
      this.ensureLearningSection(); // Ensure at least one item remains
    }

    // Remove kordie section item
    removeKordieSectionItem(index: number){
      this.kordie_section.removeAt(index);
      this.ensureKordieSection(); // Ensure at least one item remains
    }

    // Remove kordie stand section item
    removeKordieStandSectionItem(index: number){
      this.kordie_stand_section.removeAt(index);
      this.standImagePreviews.splice(index, 1);
      // this.standImagePreviews[index]= '';
      this.ensureKordieStandSection(); // Ensure at least one item remains
    }

    // Remove Next section item
    removenextSectionItem(index: number) {
      this.next_section.removeAt(index);
      this.nextImagePreviews.splice(index, 1);
      this.nextIconPreviews.splice(index, 1);
      // this.nextImagePreviews[index]= '';
      // this.nextIconPreviews[index]= '';
      this.ensureNextsectionItem(); // Ensure at least one item remains
    }  

    //Ensure...................................................................

    private ensureBanner(): void {
      if (this.why_banner.length === 0) {
        this.addBannerItem();
      }
    }

    private ensureLearningDescription(): void {
      if (this.learning_description.length === 0) {
        this.addDescriptionItem();
      }
    }

    private ensureLearningSection(): void {
      if (this.learning_section.length === 0) {
        this.addLearningSectionItem();
      }
    }

    private ensureKordieSection(){
      if (this.kordie_section.length === 0) {
        this.addKordieSectionItem();
      }
    }

    private ensureKordieStandSection(){
      if (this.kordie_stand_section.length === 0) {
        this.addKordieStandSectionItem();
      }
    }

    private ensureNextsectionItem(){
      if (this.next_section.length === 0) {
        this.addnextSectionItem();
      }
    }

   // Fetch details for editing
   getDetail() {
    this.__kordie.getDetailById(this.detailsId).subscribe(
      (response: any) => {
        if (!response.error) {
          this.getDetails = response?.data;
          console.log("getDetails......",this.getDetails);
          this.kordieImagePreview = this.getDetails?.kordie_image || '',
          this.getBannerMedia = this.getDetails?.why_banner,
          // this.seeVideoPreview = this.getDetails?.see_media || '',
          // this.economicIconPreview = this.getDetails?.economic_icon || '', 
          // this.economicImagePreview = this.getDetails?.economic_image || '', 
          // this.worldIconPreview = this.getDetails?.world_icon || '',
          // this.learningImagePreview = this.getDetails?.learning_image || '',
          // this.kordieImagePreview = this.getDetails?.kordie_image || '',
          // this.liveImagePreview = this.getDetails?.live_image || ''
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

  patchData(){
    this.addEditForm.patchValue({
      why_title: this?.getDetails?.why_title || '',
      why_description: this?.getDetails?.why_description || '',
      learning_title: this?.getDetails?.learning_title || '',
      kordie_title: this?.getDetails?.kordie_title || '',
      kordie_stand_title: this?.getDetails?.kordie_stand_title || '',
      next_title: this?.getDetails?.next_title || '',
      blog_title: this?.getDetails?.blog_title || '',
    });

    //why banner...........
    const whyBannerArray = this.addEditForm.get('why_banner') as FormArray;
    whyBannerArray.clear(); // Clear existing
    if (this.getDetails?.why_banner?.length) {
      this.getDetails.why_banner.forEach((banner: any, index: number) => {
        whyBannerArray.push(
          this.__fb.group({
            media:[banner.media||''],
            type: [banner.type || '']
          })
        );
        
        this.getBannerType[index] = banner?.type || '';
        // Update the image preview array
        if(banner.type === 'image'){
          this.bannerImagePreviews[index] = banner?.media || '';
          console.log("bannerImagePreviews======",this.bannerImagePreviews[index]);
          
        }
        // Update the video preview array
        else if(banner.type === 'video'){
          this.bannerVideoPreviews[index] = banner?.media || '';
          console.log("bannerVideoPreviews======",this.bannerVideoPreviews[index]);
        }
      });
    } else {
      this.ensureBanner(); 
    }

    //Learning description...........
    const learningArray = this.addEditForm.get('learning_description') as FormArray;
    learningArray.clear(); // Clear existing
    if (this.getDetails?.learning_description?.length) {
      this.getDetails.learning_description.forEach((learning: any, index: number) => {
        learningArray.push(
          this.__fb.group({
            title: [learning.title || ''],
          })
        );
      });
    } else {
      this.ensureLearningDescription(); 
    }

    //Learning Section...........
    const jobArray = this.addEditForm.get('learning_section') as FormArray;
    jobArray.clear(); // Clear existing
    if (this.getDetails?.learning_section?.length) {
      this.getDetails.learning_section.forEach((section: any, index: number) => {
        jobArray.push(
          this.__fb.group({
            title: [section.title || ''],
            description: [section.description || ''],
            image: [section.image || ''],
          })
        );
        // Update the image preview array
        this.sectionImagePreviews[index] = section?.image || '';
      });
    } else {
      this.ensureLearningSection(); 
    }

    //Kordie Industries Section...........
    const industriesArray = this.addEditForm.get('kordie_section') as FormArray;
    industriesArray.clear(); // Clear existing
    if (this.getDetails?.kordie_section?.length) {
      this.getDetails.kordie_section.forEach((kordie: any, index: number) => {
        industriesArray.push(
          this.__fb.group({
            description: [kordie.description || ''],
          })
        );
      });
    } else {
      this.ensureKordieSection(); 
    }

    //Kordie Stand Section...........
    const kordieStandArray = this.addEditForm.get('kordie_stand_section') as FormArray;
    kordieStandArray.clear(); // Clear existing
    if (this.getDetails?.kordie_stand_section?.length) {
      this.getDetails.kordie_stand_section.forEach((standSection: any, index: number) => {
        kordieStandArray.push(
          this.__fb.group({
            title: [standSection.title || ''],
            description: [standSection.description || ''],
            image: [standSection.image || ''],
          })
        );
        // Update the image preview array
        this.standImagePreviews[index] = standSection?.image || '';
      });
    } else {
      this.ensureLearningSection(); 
    }


     //Next Section...........
     const nextArray = this.addEditForm.get('next_section') as FormArray;
     nextArray.clear(); // Clear existing
     if (this.getDetails?.next_section?.length) {
       this.getDetails.next_section.forEach((next: any, index: number) => {
         nextArray.push(
           this.__fb.group({
             title: [next.title || ''],
             description: [next.description || ''],
             image: [next.image || ''],
             icon: [next.icon || ''],
           })
         );
         // Update the image preview array
         this.nextImagePreviews[index] = next?.image || '';

        // Update the icon preview array
        this.nextIconPreviews[index] = next?.icon || '';
       });
     } else {
       this.ensureNextsectionItem(); 
     }

  }

  //Save Data..............
  
  add(){

    //Validation for why banner..............
    const bannerArray = this.addEditForm.get('why_banner') as FormArray;
    let hasBannerErrors = false;
    bannerArray.controls.forEach((control, index) => {
    const bannerType = control.get('type')?.value;
    if (!bannerType) {
      hasBannerErrors = true;
      this.errorMessage += `Banner ${index + 1}: media type is required.<br/>`;
    }
      const bannerImage = control.get('media')?.value;
      if (!bannerImage) {
        hasBannerErrors = true;
        this.errorMessage += `Banner ${index + 1}: file is required.\n`;
      }
    });
    if (hasBannerErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for Learning Description.......................
    const learningArray = this.addEditForm.get('learning_description') as FormArray;
    let hasLearningErrors = false;
    learningArray.controls.forEach((control, index) => {
      const learningTitle = control.get('title')?.value;
      if (!learningTitle) {
        hasLearningErrors = true;
        this.errorMessage += `Descrption ${index + 1}: is required.\n`;
      }
    });
    if (hasLearningErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for learning Section.........................
    const learningSectionArray = this.addEditForm.get('learning_section') as FormArray;
    let haslearningSectionErrors = false;
    learningSectionArray.controls.forEach((control, index) => {
      const learningTitle = control.get('title')?.value;
      if (!learningTitle) {
        haslearningSectionErrors = true;
        this.errorMessage += `learning section Title ${index + 1}: is required.<br/>`;
      }
      const learningDescription = control.get('description')?.value;
      if (!learningDescription) {
        haslearningSectionErrors = true;
        this.errorMessage += `learning section description ${index + 1}: is required.<br/>`;
      }
      const learningImage = control.get('image')?.value;
      if (!learningImage) {
        haslearningSectionErrors = true;
        this.errorMessage += `learning section ${index + 1}: Image is required.\n`;
      }
    });
    if (haslearningSectionErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

  //Validation for Kordie Section.......................
  const kordieSectionArray = this.addEditForm.get('kordie_section') as FormArray;
  let hasKordieSectionErrors = false;
  kordieSectionArray.controls.forEach((control, index) => {
    const learningDescription = control.get('description')?.value;
    if (!learningDescription) {
      hasKordieSectionErrors = true;
      this.errorMessage += `Descrption ${index + 1}: is required.\n`;
    }
  });
  if (hasKordieSectionErrors) {
    this.__shared.toastError(this.errorMessage);
    return;
  }

  //Validation for kordie Image..................
    if(!this.kordieImageUrl && !this.getDetails?.kordie_image){
      this.__shared.toastError('Please upload kordie image!');
      return;
  }

  //Validation for Kordie Stand Section.........................
  const kordieStandSectionArray = this.addEditForm.get('kordie_stand_section') as FormArray;
  let hasKordieStandSectionErrors = false;
  kordieStandSectionArray.controls.forEach((control, index) => {
    const kordieStandTitle = control.get('title')?.value;
    if (!kordieStandTitle) {
      hasKordieStandSectionErrors = true;
      this.errorMessage += `kordie stand section Title ${index + 1}: is required.<br/>`;
    }
    const KordieStandDescription = control.get('description')?.value;
    if (!KordieStandDescription) {
      hasKordieStandSectionErrors = true;
      this.errorMessage += `kordie stand section description ${index + 1}: is required.<br/>`;
    }
    const kordieStandImage = control.get('image')?.value;
    if (!kordieStandImage) {
      hasKordieStandSectionErrors = true;
      this.errorMessage += `kordie stand section ${index + 1}: Image is required.\n`;
    }
  });
  if (hasKordieStandSectionErrors) {
    this.__shared.toastError(this.errorMessage);
    return;
  }

  //Validation for Next Section :
  const nextArray = this.addEditForm.get('next_section') as FormArray;
  let hasNextErrors = false;
  nextArray.controls.forEach((control, index) => {
    const nextTitle = control.get('title')?.value;
    if (!nextTitle) {
      hasNextErrors = true;
      this.errorMessage += `Next section Title ${index + 1}: is required.<br/>`;
    }
    const nextDescription = control.get('description')?.value;
    if (!nextDescription) {
      hasNextErrors = true;
      this.errorMessage += `Next section description ${index + 1}: is required.<br/>`;
    }
    const nextImage = control.get('image')?.value;
    if (!nextImage) {
      hasNextErrors = true;
      this.errorMessage += `Next section ${index + 1}: Image is required.<br/>`;
    }
    const nextIcon = control.get('icon')?.value;
    if (!nextIcon) {
      hasNextErrors = true;
      this.errorMessage += `Next section ${index + 1}: Icon is required.\n`;
    }
  });
  if (hasNextErrors) {
    this.__shared.toastError(this.errorMessage);
    return;
  }

    const data: any = this.addEditForm?.value;
    const params: any = {
      why_title: data?.why_title || '',
      why_description: data?.why_description || '',
      why_banner: data?.why_banner || [],
      learning_title: data?.learning_title || '',
      learning_description: data?.learning_description || [],
      learning_section: data?.learning_section || [],
      kordie_title: data?.kordie_title || '',
      kordie_section: data?.kordie_section || [],
      kordie_image: this.kordieImageUrl || this.kordieImagePreview,
      kordie_stand_title: data?.kordie_stand_title || '',
      kordie_stand_section: data?.kordie_stand_section || [],
      next_title: data?.next_title || '',
      next_section: data?.next_section || [],
      blog_title: data?.blog_title || ''
    }
    console.log("data.......",params);
    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    const apiCall = this.detailsId
    ? this.__kordie.edit(this.detailsId, params)
    : this.__kordie.create(params);

    apiCall.subscribe(
      response => {
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide visual spinner
        if (!response.error) {
            this.displayMessage = this.detailsId
                ? "Details updated successfully."
                : "Details added successfully.";
            this.__shared.toastSuccess(this.displayMessage);
            this.__route.navigate(['/why-kordie/list']);
        } else {
            this.errorMessage = response.message;
            this.__shared.toastError(this.errorMessage);
        }
    },
      error => {
          this.isLoading = false; // Stop loading spinner
          this.__spinner.hide(); // Hide visual spinner
          this.errorMessage = "An error occurred.";
          this.__shared.toastError(this.errorMessage);
      }
    );
  }

  //Upload Image..............................................
  onImageSelected(event: Event, index: number,type: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    // console.log("file====", file);
    if(type === 'bannerVideo'){
      if (file) {
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
        // this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          if (!this.bannerVideoPreviews) {
            this.bannerVideoPreviews = [];
          }
          this.bannerVideoPreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, index, type);
      }
    }
    else{
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
        if(type === 'bannerImage'){
          reader.onload = () => {
            if (!this.bannerImagePreviews) {
              this.bannerImagePreviews = [];
            }
            this.bannerImagePreviews[index] = reader.result as string; // Store the preview
          };
          reader.readAsDataURL(file);
        }
        else  if(type === 'sectionImage'){
          reader.onload = () => {
            if (!this.sectionImagePreviews) {
              this.sectionImagePreviews = [];
            }
            this.sectionImagePreviews[index] = reader.result as string; // Store the preview
          };
          reader.readAsDataURL(file);
        }
        else  if(type === 'kordieImage'){
          reader.onload = () => {
            this.kordieImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'standImage'){
          reader.onload = () => {
            if (!this.standImagePreviews) {
              this.standImagePreviews = [];
            }
            this.standImagePreviews[index] = reader.result as string; // Store the preview
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'nextImage'){
          reader.onload = () => {
            if (!this.nextImagePreviews) {
              this.nextImagePreviews = [];
            }
            this.nextImagePreviews[index] = reader.result as string; // Store the preview
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'nextIcon'){
          reader.onload = () => {
            if (!this.nextIconPreviews) {
              this.nextIconPreviews = [];
            }
            this.nextIconPreviews[index] = reader.result as string; // Store the preview
          };
          reader.readAsDataURL(file);
        }
        // Upload the file and update the form with the actual URL
        this.uploadFile(file, index, type);
      }
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
          const mediaUrl = response?.data?.mediaUrl?.fileUrl;
          // console.log("mediaUrl......",mediaUrl);
          
          // Update the image field in the syllabus form array with the URL
          if(type === 'bannerImage'){
            const bannerImageArray = this.addEditForm.get('why_banner') as FormArray;
            if (bannerImageArray && bannerImageArray.length > index) {
              if(this.detailsId){
                bannerImageArray.at(index).patchValue({ media: mediaUrl });
              }
              else{
                bannerImageArray.at(index).patchValue({ media: mediaUrl });
              }
              // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'bannerVideo'){
            const bannerVideoArray = this.addEditForm.get('why_banner') as FormArray;
            if (bannerVideoArray && bannerVideoArray.length > index) {
              if(this.detailsId){
                bannerVideoArray.at(index).patchValue({ media: mediaUrl });
              }
              else{
                bannerVideoArray.at(index).patchValue({ media: mediaUrl });
              }
              // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'sectionImage'){
            const sectionImageArray = this.addEditForm.get('learning_section') as FormArray;
            if (sectionImageArray && sectionImageArray.length > index) {
              if(this.detailsId){
                sectionImageArray.at(index).patchValue({ image: mediaUrl });
              }
              else{
                sectionImageArray.at(index).patchValue({ image: mediaUrl });
              }
              // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'kordieImage'){
           this.kordieImageUrl  = mediaUrl
          }
          else if(type === 'standImage'){
            const kordieStandImageArray = this.addEditForm.get('kordie_stand_section') as FormArray;
            if (kordieStandImageArray && kordieStandImageArray.length > index) {
              if(this.detailsId){
                kordieStandImageArray.at(index).patchValue({ image: mediaUrl });
              }
              else{
                kordieStandImageArray.at(index).patchValue({ image: mediaUrl });
              }
              // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'nextImage'){
            const nextImageArray = this.addEditForm.get('next_section') as FormArray;
            if (nextImageArray && nextImageArray.length > index) {
              if(this.detailsId){
                nextImageArray.at(index).patchValue({ image: mediaUrl });
              }
              else{
                nextImageArray.at(index).patchValue({ image: mediaUrl });
              }
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'nextIcon'){
            const nextIconArray = this.addEditForm.get('next_section') as FormArray;
            if (nextIconArray && nextIconArray.length > index) {
              if(this.detailsId){
                nextIconArray.at(index).patchValue({ icon: mediaUrl });
              }
              else{
                nextIconArray.at(index).patchValue({ icon: mediaUrl });
              }
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
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


    
    //Reset.....
    selectType(event: any, index: number) {
      const selectedType = event?.target?.value;
      this.getBannerType[index] = selectedType; // Track the selected type for this index
      this.resetFileSelection(index); // Reset any existing selections for the other type
      this.mediaType = selectedType;
    }
    
    resetFileSelection(index: number): void {
      // console.log("getBannerType=====",this.getBannerType[index])
      if (this.getBannerType[index] === 'image') {
        this.bannerImagePreviews[index] = '';
        this.bannerVideoPreviews[index] = '';
      } else if (this.getBannerType[index] === 'video') {
        this.bannerVideoPreviews[index] = '';
        this.bannerImagePreviews[index] = '';
      }
      // console.log(this.bannerImagePreviews[index])
      const fileInput: HTMLInputElement = document.querySelector(`input[data-index="${index}"]`)!;
      if (fileInput) {
        fileInput.value = ''; // Clear the file input value
      }

}
}
