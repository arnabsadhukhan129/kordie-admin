import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AboutService } from '../../../services/about-us/about.service';
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
  addEditForm!: FormGroup;
  about_banner!: FormArray;
  economic_section!: FormArray;
  bannerImagePreviews: any = [];
  jobImagePreviews:any = [];
  storyImagePreviews:any = [];
  nextImagePreviews: any = [];
  nextIconPreviews: any = [];
  isLoading = false;
  displayMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null;
  selectedFile1: File | null = null;
  seeVideoPreview: string | null = null;
  economicIconPreview: string | null = null;
  videoUrl: string = '';
  economicIconUrl: string = '';
  economicImageUrl: string = '';
  worldIconUrl: string = '';
  economicImagePreview: string | null = null;
  worldIconPreview: string | null = null;
  world_section!: FormArray;
  world_subsection!: FormArray;
  learningImagePreview: string | null = null;
  kordieImagePreview: string | null = null;
  liveImagePreview: string | null = null;
  kordieImageUrl: string = '';
  liveImageUrl: string = '';
  learningImageUrl: string = '';
  learning_skill!: FormArray;
  kordie_job_section!: FormArray;
  kordie_industries_section!: FormArray;
  story_section!: FormArray;
  live_section!: FormArray;
  next_section!: FormArray;
  getDetails: any;
  editorConfig: any;
  
  constructor(
    private __fb: FormBuilder,
    private __about: AboutService,
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
    // console.log("form initialization started");
    this.addEditForm = this.__fb.group({
      about_title: ['', [Validators.required]],
      about_description: ['', [Validators.required]],
      about_banner: this.__fb.array([]), // Start with an empty array
      see_title: ['',[Validators.required]],
      see_description: ['',[Validators.required]],
      see_type: ['video'],
      see_media: [''],
      economic_title: ['',[Validators.required]],
      economic_section: this.__fb.array([]), // Start with an empty array,
      economic_icon: [''],
      economic_description: ['',[Validators.required]],
      economic_image: [''],
      world_icon: [''],
      world_title: ['',[Validators.required]],
      world_section: this.__fb.array([]), // Start with an empty array,
      world_subsection: this.__fb.array([]), // Start with an empty array,
      learning_title: ['',[Validators.required]],
      learning_image: [''],
      learning_subtitle: ['',[Validators.required]],
      learning_below_subtitle: ['',[Validators.required]],
      learning_description: ['',[Validators.required]],
      learning_skill: this.__fb.array([]), // Start with an empty array,
      kordie_title: ['',[Validators.required]],
      kordie_image: [''],
      kordie_description: ['',[Validators.required]],
      kordie_job_subtitle: ['',[Validators.required]],
      kordie_job_section: this.__fb.array([]), // Start with an empty array,
      kordie_industries_title: ['',[Validators.required]],
      kordie_industries_section: this.__fb.array([]), // Start with an empty array,
      story_title: ['',[Validators.required]],
      story_section: this.__fb.array([]), // Start with an empty array,
      live_title: ['',[Validators.required]],
      live_section: this.__fb.array([]), // Start with an empty array,
      live_image: [''],
      next_title: ['',[Validators.required]],
      next_section: this.__fb.array([]), // Start with an empty array,
    });

    this.about_banner = this.addEditForm.get('about_banner') as FormArray;
    this.ensureAtLeastOneBannerSubsectionItem(); // Always ensure one about banner item

    this.economic_section = this.addEditForm.get('economic_section') as FormArray;
    this.ensureAtLeastOneEconomicSubsectionItem(); // Always ensure one economic section item

    this.world_section = this.addEditForm.get('world_section') as FormArray;
    this.ensureAtLeastOneWorldSubsectionItem(); // Always ensure one world section item

    this.world_subsection = this.addEditForm.get('world_subsection') as FormArray;
    this.ensureAtLeastOneWorldSubSubsectionItem(); // Always ensure one world subsection item

    this.learning_skill = this.addEditForm.get('learning_skill') as FormArray;
    this.ensureAtLeastOneSkillsectionItem(); // Always ensure one learning skill item

    this.kordie_job_section = this.addEditForm.get('kordie_job_section') as FormArray;
    this.ensureAtLeastOneJobsectionItem(); // Always ensure one kordie job section item

    this.kordie_industries_section = this.addEditForm.get('kordie_industries_section') as FormArray;
    this.ensureAtLeastOneIndustriessectionItem(); // Always ensure one kordie industries section item

    this.story_section = this.addEditForm.get('story_section') as FormArray;
    this.ensureAtLeastOneStorysectionItem(); // Always ensure one story section item

    this.live_section = this.addEditForm.get('live_section') as FormArray;
    this.ensureAtLeastOneLivesectionItem(); // Always ensure one live section item

    this.next_section = this.addEditForm.get('next_section') as FormArray;
    this.ensureAtLeastOneNextsectionItem(); // Always ensure one next section item
  }

  //Getter.....................................................................
    // Getter for Banner controls
      get bannerControls() {
        return (this.addEditForm.get('about_banner') as FormArray)?.controls || [];
      }
    // Getter for economic section controls
      get economicControls() {
        return (this.addEditForm.get('economic_section') as FormArray)?.controls || [];
      }
    // Getter for world section controls
      get worldControls() {
        return (this.addEditForm.get('world_section') as FormArray)?.controls || [];
      }
    // Getter for world section controls
      get worldSubControls() {
        return (this.addEditForm.get('world_subsection') as FormArray)?.controls || [];
      }
    // Getter for skill controls
      get sillsControls() {
        return (this.addEditForm.get('learning_skill') as FormArray)?.controls || [];
      }
    // Getter for skill controls
    get jobControls() {
      return (this.addEditForm.get('kordie_job_section') as FormArray)?.controls || [];
    }
    // Getter for industries controls
    get industriesControls() {
      return (this.addEditForm.get('kordie_industries_section') as FormArray)?.controls || [];
    }
    // Getter for Story controls
    get storyControls() {
      return (this.addEditForm.get('story_section') as FormArray)?.controls || [];
    }
     // Getter for Live controls
     get liveControls() {
      return (this.addEditForm.get('live_section') as FormArray)?.controls || [];
    }

    // Getter for Live controls
    get nextControls() {
      return (this.addEditForm.get('next_section') as FormArray)?.controls || [];
    }



  //Create.............................................................
    // Create a new banner item
      createBannerItem() {
        return this.__fb.group({
          image:[''],
        });
      }
    // Create a new economic section item
      createEconomicItem() {
        return this.__fb.group({
          title:[''],
        });
      }
    // Create a new world section item
      createWorldItem() {
        return this.__fb.group({
          title: [''],
          description: ['']
        });
      }
    // Create a new world section item
      createWorldSubItem() {
        return this.__fb.group({
          title: [''],
          subtitle: ['']
        });
      }
     // Create a new world section item
     createSkillItem() {
      return this.__fb.group({
        title: ['']
      });
    }  
    // Create a new world section item
    createJobItem() {
      return this.__fb.group({
        title: [''],
        description: [''],
        image:['']
      });
    }  
     // Create a Industries section item
     createIndustriesItem() {
      return this.__fb.group({
        title: ['']
      });
    } 
    // Create a new story section item
    createStoryItem() {
      return this.__fb.group({
        description: [''],
        image:['']
      });
    }  
    // Create a new story section item
    createLiveItem() {
      return this.__fb.group({
        title: [''],
        description: ['']
      });
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
      addBannersubsectionItem() {
        this.about_banner.push(this.createBannerItem());
      }
    // Add economic item
      addEconomicItem() {
        this.economic_section.push(this.createEconomicItem());
      }

    // Add world section item
      addWorldSectionItem() {
        this.world_section.push(this.createWorldItem());
      }

    // Add world subsection item
      addWorldSubsectionItem() {
        this.world_subsection.push(this.createWorldSubItem());
      }
    // Add world subsection item
    addSkillItem() {
      this.learning_skill.push(this.createSkillItem());
    }
    // Add Kordie Job item
    addJobItem(){
      this.kordie_job_section.push(this.createJobItem());
    }
    // Add Kordie Industries item
    addIndustriesItem(){
      this.kordie_industries_section.push(this.createIndustriesItem());
    }
    // Add story section item
    addStoryItem(){
      this.story_section.push(this.createStoryItem());
    }
    // Add live section item
    addLiveItem(){
      this.live_section.push(this.createLiveItem());
    }
    // Add next section item
    addnextSectionItem(){
      this.next_section.push(this.createNextSectionItem());
    }


  //Remove...................................................................
    // Remove Banner item
      removeBannersubsectionItem(index: number) {
        this.about_banner.removeAt(index);
        this.bannerImagePreviews.splice(index, 1);
        // this.bannerImagePreviews[index]= '';
        this.ensureAtLeastOneBannerSubsectionItem(); // Ensure at least one item remains
      }
    // Remove economic section item
      removeEconomicItem(index: number) {
        this.economic_section.removeAt(index);
        this.ensureAtLeastOneEconomicSubsectionItem(); // Ensure at least one item remains
      }
    // Remove world section item
      removeworldSectionItem(index: number) {
        this.world_section.removeAt(index);
        this.ensureAtLeastOneWorldSubsectionItem(); // Ensure at least one item remains
      }
    // Remove world subsection item
      removeworldSubsectionItem(index: number) {
        this.world_subsection.removeAt(index);
        this.ensureAtLeastOneWorldSubSubsectionItem(); // Ensure at least one item remains
      }
    // Remove Learning Skill item
      removeSkillItem(index: number) {
        this.learning_skill.removeAt(index);
        this.ensureAtLeastOneSkillsectionItem(); // Ensure at least one item remains
      }
    
     // Remove Learning Skill item
     removeJobItem(index: number) {
      this.kordie_job_section.removeAt(index);
      this.jobImagePreviews.splice(index, 1);
      // this.jobImagePreviews[index]= '';
      this.ensureAtLeastOneJobsectionItem(); // Ensure at least one item remains
    }  

    // Remove Learning Skill item
    removeIndustriesItem(index: number) {
      this.kordie_industries_section.removeAt(index);
      this.ensureAtLeastOneIndustriessectionItem(); // Ensure at least one item remains
    }  

    // Remove story section item
    removeStoryItem(index: number) {
      this.story_section.removeAt(index);
      // this.storyImagePreviews[index]= '';
      this.storyImagePreviews.splice(index, 1);
      this.ensureAtLeastOneStorysectionItem(); // Ensure at least one item remains
    } 
    
    // Remove Live section item
    removeLiveItem(index: number) {
      this.live_section.removeAt(index);
      this.ensureAtLeastOneLivesectionItem(); // Ensure at least one item remains
    }  

    // Remove Next section item
    removenextSectionItem(index: number) {
      this.next_section.removeAt(index);
      this.nextImagePreviews.splice(index, 1);
      this.nextIconPreviews.splice(index, 1);
      // this.nextImagePreviews[index]= '';
      // this.nextIconPreviews[index]= '';
      this.ensureAtLeastOneNextsectionItem(); // Ensure at least one item remains
    }  


  //Ensure...................................................................
    // Ensure at least one impactsubsection item exists
    private ensureAtLeastOneBannerSubsectionItem(): void {
      if (this.about_banner.length === 0) {
        this.addBannersubsectionItem();
      }
    }
    private ensureAtLeastOneEconomicSubsectionItem(): void {
      if (this.economic_section.length === 0) {
        this.addEconomicItem();
      }
    }
    private ensureAtLeastOneWorldSubsectionItem(): void {
      if (this.world_section.length === 0) {
        this.addWorldSectionItem();
      }
    }
    private ensureAtLeastOneWorldSubSubsectionItem(): void {
      if (this.world_subsection.length === 0) {
        this.addWorldSubsectionItem();
      }
    }

    private ensureAtLeastOneSkillsectionItem(): void {
      if (this.learning_skill.length === 0) {
        this.addSkillItem();
      }
    }

    private ensureAtLeastOneJobsectionItem(): void {
      if (this.kordie_job_section.length === 0) {
        this.addJobItem();
      }
    }

    private ensureAtLeastOneIndustriessectionItem(): void {
      if (this.kordie_industries_section.length === 0) {
        this.addIndustriesItem();
      }
    }

    private ensureAtLeastOneStorysectionItem(): void {
      if (this.story_section.length === 0) {
        this.addStoryItem();
      }
    }

    private ensureAtLeastOneLivesectionItem(): void {
      if (this.live_section.length === 0) {
        this.addLiveItem();
      }
    }

    private ensureAtLeastOneNextsectionItem(): void {
      if (this.next_section.length === 0) {
        this.addnextSectionItem();
      }
    }



  //Upload Image..............................................
   onImageSelected(event: Event, index: number,type: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    // console.log("file====", file);
  
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
      else if(type === 'jobImage'){
        reader.onload = () => {
          if (!this.jobImagePreviews) {
            this.jobImagePreviews = [];
          }
          this.jobImagePreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }
      else if(type === 'storyImage'){
        reader.onload = () => {
          if (!this.storyImagePreviews) {
            this.storyImagePreviews = [];
          }
          this.storyImagePreviews[index] = reader.result as string; // Store the preview
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

  uploadFile(file: File, index: number, type:any): void {
    // console.log("fiiririri.....",file);
    
    const formData = new FormData();
    formData.append('media', file);
  
    this.isLoading = true;
  
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false;
  
        if (!response.error) {
          const imageUrl = response?.data?.mediaUrl?.fileUrl;
          // console.log("Uploaded Image URL:", imageUrl);
  
          // Update the image field in the syllabus form array with the URL
          if(type === 'bannerImage'){
            const bannerImageArray = this.addEditForm.get('about_banner') as FormArray;
            if (bannerImageArray && bannerImageArray.length > index) {
              if(this.detailsId){
                bannerImageArray.at(index).patchValue({ image: imageUrl });
              }
              else{
                bannerImageArray.at(index).patchValue({ image: imageUrl });
              }
              // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'jobImage'){
            const jobImageArray = this.addEditForm.get('kordie_job_section') as FormArray;
            if (jobImageArray && jobImageArray.length > index) {
              if(this.detailsId){
                jobImageArray.at(index).patchValue({ image: imageUrl });
              }
              else{
                jobImageArray.at(index).patchValue({ image: imageUrl });
              }
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'storyImage'){
            const storyImageArray = this.addEditForm.get('story_section') as FormArray;
            if (storyImageArray && storyImageArray.length > index) {
              if(this.detailsId){
                storyImageArray.at(index).patchValue({ image: imageUrl });
              }
              else{
                storyImageArray.at(index).patchValue({ image: imageUrl });
              }
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'nextImage'){
            const nextImageArray = this.addEditForm.get('next_section') as FormArray;
            if (nextImageArray && nextImageArray.length > index) {
              if(this.detailsId){
                nextImageArray.at(index).patchValue({ image: imageUrl });
              }
              else{
                nextImageArray.at(index).patchValue({ image: imageUrl });
              }
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'nextIcon'){
            const nextIconArray = this.addEditForm.get('next_section') as FormArray;
            if (nextIconArray && nextIconArray.length > index) {
              if(this.detailsId){
                nextIconArray.at(index).patchValue({ icon: imageUrl });
              }
              else{
                nextIconArray.at(index).patchValue({ icon: imageUrl });
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

  onFileSelected(event: Event, type: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if(type === 'video'){
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
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.seeVideoPreview = reader.result as string; // Show preview Video
        };
        reader.readAsDataURL(file);
        this.uploadedFile(file, type);
      }
    }
    else{
      if (file) {
        // Allowed file types
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
          return;
        }
    
        // Validate file size (e.g., 10MB max)
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 10MB limit.');
          return;
        }
    
        this.selectedFile = file;
        if(type === 'economicIcon'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.economicIconPreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'mediaImage'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.seeVideoPreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'economicImage'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.economicImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'worldIcon'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.worldIconPreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'learningImage'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.learningImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'kordieImage'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.kordieImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'liveImage'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.liveImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        // Upload the file
        this.uploadedFile(file, type);
      }
    }
  }

  uploadedFile(file: File, type:any): void {
    const formData = new FormData();
    if(type === 'economicIcon'){
      formData.append('media', file);
    }
    else if(type === 'video'){
      formData.append('media', file);
    }
    else if(type === 'mediaImage'){
      formData.append('media', file);
    }
    else if(type === 'economicImage'){
      formData.append('media', file);
    }
    else if(type === 'worldIcon'){
      formData.append('media', file);
    }
    else if(type === 'learningImage'){
      formData.append('media', file);
    }
    else if(type === 'kordieImage'){
      formData.append('media', file);
    }
    else if(type === 'liveImage'){
      formData.append('media', file);
    }
    // console.log("File being uploaded: ", file);
    this.isLoading = true; // Show loader
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false; // Stop loading spinner
        if (!response.error) {
          // Handle successful response
          if (type === 'economicIcon') {
            this.economicIconUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if (type === 'video') {
            this.videoUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if(type === 'mediaImage') {
            this.videoUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if (type === 'economicImage') {
            this.economicImageUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if (type === 'worldIcon') {
            this.worldIconUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if (type === 'learningImage') {
            this.learningImageUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if (type === 'kordieImage') {
            this.kordieImageUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if (type === 'liveImage') {
            this.liveImageUrl = response?.data?.mediaUrl?.fileUrl;
          }
        } else {
          // Handle server-side error
          this.errorMessage = response.message || 'Upload failed.';
          this.__shared.toastError(this.errorMessage);
        }
      },
      (error) => {
        this.isLoading = false; // Stop loading spinner
        this.errorMessage = 'An error occurred while uploading the file.';
        this.__shared.toastError(this.errorMessage);
        console.error(error);
      }
    );
  }

   //Save Data.......................................
   add(){

    //Validation for about banner
    const bannerArray = this.addEditForm.get('about_banner') as FormArray;
    let hasBannerErrors = false;
    bannerArray.controls.forEach((control, index) => {
      const bannerImage = control.get('image')?.value;
      if (!bannerImage) {
        hasBannerErrors = true;
        this.errorMessage += `Banner ${index + 1}: Image is required.\n`;
      }
    });
    if (hasBannerErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for see media
    if(!this.videoUrl && !this.getDetails?.see_media){
      this.__shared.toastError('Please upload video!');
      return;
    }

    //Validation for economic section :
    const sectionArray = this.addEditForm.get('economic_section') as FormArray;
    let hasEconomicErrors = false;
    sectionArray.controls.forEach((control, index) => {
      const economicTitle = control.get('title')?.value;
      if (!economicTitle) {
        hasEconomicErrors = true;
        this.errorMessage += `Economic section Title ${index + 1}: is required.\n`;
      }
    });
    if (hasEconomicErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for Economic Icon
    if(!this.economicIconUrl && !this.getDetails?.economic_icon){
      this.__shared.toastError('Please upload economic icon!');
      return;
    }

    //Validation for Economic Image
    if(!this.economicImageUrl && !this.getDetails?.economic_image){
      this.__shared.toastError('Please upload economic image!');
      return;
    }

    //Validation for world icon
    if(!this.worldIconUrl && !this.getDetails?.world_icon){
      this.__shared.toastError('Please upload world icon!');
      return;
    }

    //Validation for world section :
    const worldArray = this.addEditForm.get('world_section') as FormArray;
    let hasWorldErrors = false;
    worldArray.controls.forEach((control, index) => {
      const worldTitle = control.get('title')?.value;
      if (!worldTitle) {
        hasWorldErrors = true;
        this.errorMessage += `World section Title ${index + 1}: is required.<br/>`;
      }

      const worldDescription = control.get('description')?.value;
      if (!worldDescription) {
        hasWorldErrors = true;
        this.errorMessage += `World section description ${index + 1}: is required.\n`;
      }
    });
    if (hasWorldErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for world subsection :
    const worldSubArray = this.addEditForm.get('world_subsection') as FormArray;
    let hasWorldSubErrors = false;
    worldSubArray.controls.forEach((control, index) => {
      const worldTitle = control.get('title')?.value;
      if (!worldTitle) {
        hasWorldSubErrors = true;
        this.errorMessage += `World subsection title ${index + 1}: is required.<br/>`;
      }
      const worldSubtitle = control.get('subtitle')?.value;
      if (!worldSubtitle) {
        hasWorldSubErrors = true;
        this.errorMessage += `World subsection subtitle ${index + 1}: is required.\n`;
      }
    });
    if (hasWorldSubErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for Learning Image
     if(!this.learningImageUrl && !this.getDetails?.learning_image){
      this.__shared.toastError('Please upload learning image!');
      return;
    }

    //Validation for learning skill :
    const learningArray = this.addEditForm.get('learning_skill') as FormArray;
    let hasLearningErrors = false;
    learningArray.controls.forEach((control, index) => {
      const economicTitle = control.get('title')?.value;
      if (!economicTitle) {
        hasLearningErrors = true;
        this.errorMessage += `Learning skill Title ${index + 1}: is required.\n`;
      }
    });
    if (hasLearningErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for kordie Image
    if(!this.kordieImageUrl && !this.getDetails?.kordie_image){
      this.__shared.toastError('Please upload kordie image!');
      return;
    }

    //Validation for Kordie Job Section :
    const kordieArray = this.addEditForm.get('kordie_job_section') as FormArray;
    let hasKordieErrors = false;
    kordieArray.controls.forEach((control, index) => {
      const kordieTitle = control.get('title')?.value;
      if (!kordieTitle) {
        hasKordieErrors = true;
        this.errorMessage += `Kordie job section Title ${index + 1}: is required.<br/>`;
      }
      const kordieDescription = control.get('description')?.value;
      if (!kordieDescription) {
        hasKordieErrors = true;
        this.errorMessage += `Kordie job section description ${index + 1}: is required.<br/>`;
      }
      const kordieImage = control.get('image')?.value;
      if (!kordieImage) {
        hasKordieErrors = true;
        this.errorMessage += `Kordie job section ${index + 1}: Image is required.\n`;
      }
    });
    if (hasKordieErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for Kordie Industries Section :
    const kordieIndustryArray = this.addEditForm.get('kordie_industries_section') as FormArray;
    let hasKordieIndustriesErrors = false;
    kordieIndustryArray.controls.forEach((control, index) => {
      const industriesTitle = control.get('title')?.value;
      if (!industriesTitle) {
        hasKordieIndustriesErrors = true;
        this.errorMessage += `Kordie industries section Title ${index + 1}: is required.\n`;
      }
    });
    if (hasKordieIndustriesErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    //Validation for story Section :
    const storyArray = this.addEditForm.get('story_section') as FormArray;
    let hasStoryErrors = false;
    storyArray.controls.forEach((control, index) => {
      const storyDescription = control.get('description')?.value;
      if (!storyDescription) {
        hasStoryErrors = true;
        this.errorMessage += `Story section description ${index + 1}: is required.<br/>`;
      }
      const storyImage = control.get('image')?.value;
      if (!storyImage) {
        hasStoryErrors = true;
        this.errorMessage += `Story section ${index + 1}: Image is required.\n`;
      }
    });
    if (hasStoryErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }


    //Validation for Live Section :
    const liveArray = this.addEditForm.get('live_section') as FormArray;
    let hasLiveErrors = false;
    liveArray.controls.forEach((control, index) => {
      const liveTitle = control.get('title')?.value;
      if (!liveTitle) {
        hasLiveErrors = true;
        this.errorMessage += `Live section Title ${index + 1}: is required.<br/>`;
      }
      const liveDescription = control.get('description')?.value;
      if (!liveDescription) {
        hasLiveErrors = true;
        this.errorMessage += `Live section description ${index + 1}: is required.<br/>`;
      }
    });
    if (hasLiveErrors) {
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
      about_title: data?.about_title || '',
      about_description: data?.about_description || '',
      about_banner: data?.about_banner || [],
      see_title: data?.see_title || '',
      see_description: data?.see_description || '',
      see_type: data?.see_type || '',
      see_media: this.videoUrl || this.seeVideoPreview,
      economic_title: data?.economic_title || '',
      economic_section: data?.economic_section || [],
      economic_icon: this.economicIconUrl || this.economicIconPreview,
      economic_description: data?.economic_description || '',
      economic_image: this.economicImageUrl || this.economicImagePreview,
      world_icon: this.worldIconUrl || this.worldIconPreview,
      world_title: data?.world_title || '',
      world_section: data?.world_section || [],
      world_subsection: data?.world_subsection || [],
      learning_title: data?.learning_title || '',
      learning_image: this.learningImageUrl || this.learningImagePreview,
      learning_subtitle: data?.learning_subtitle || '',
      learning_below_subtitle: data?.learning_below_subtitle || '',
      learning_description: data?.learning_description || '',
      learning_skill: data?.learning_skill || [],
      kordie_title: data?.kordie_title || '',
      kordie_description: data?.kordie_description || '',
      kordie_image: this.kordieImageUrl || this.kordieImagePreview,
      kordie_job_subtitle: data?.kordie_job_subtitle || '',
      kordie_job_section: data?.kordie_job_section || [],
      kordie_industries_title: data?.kordie_industries_title || '',
      kordie_industries_section: data?.kordie_industries_section || [],
      story_title: data?.story_title || '',
      story_section: data?.story_section || [],
      live_title: data?.live_title || '',
      live_section: data?.live_section || [],
      live_image: this.liveImageUrl || this.liveImagePreview,
      next_title: data?.next_title || '',
      next_section: data?.next_section || []
    };

    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    const apiCall = this.detailsId
    ? this.__about.edit(this.detailsId, params)
    : this.__about.create(params);

    apiCall.subscribe(
      response => {
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide visual spinner
        if (!response.error) {
            this.displayMessage = this.detailsId
                ? "Details updated successfully."
                : "Details added successfully.";
            this.__shared.toastSuccess(this.displayMessage);
            this.__route.navigate(['/about-us/list']);
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
    // console.log("data.......",params);
  }

  // Fetch details for editing
  getDetail() {
    this.__about.getDetailById(this.detailsId).subscribe(
      (response: any) => {
        if (!response.error) {
          this.getDetails = response?.data;
          this.seeVideoPreview = this.getDetails?.see_media || '',
          this.economicIconPreview = this.getDetails?.economic_icon || '', 
          this.economicImagePreview = this.getDetails?.economic_image || '', 
          this.worldIconPreview = this.getDetails?.world_icon || '',
          this.learningImagePreview = this.getDetails?.learning_image || '',
          this.kordieImagePreview = this.getDetails?.kordie_image || '',
          this.liveImagePreview = this.getDetails?.live_image || ''
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
      about_title: this?.getDetails?.about_title || '',
      about_description: this?.getDetails?.about_description || '',
      see_title: this?.getDetails?.see_title || '',
      see_description: this?.getDetails?.see_description || '',
      economic_title: this?.getDetails?.economic_title || '',
      economic_description: this?.getDetails?.economic_description || '',
      world_title: this?.getDetails?.world_title || '',
      learning_title: this?.getDetails?.learning_title || '',
      learning_subtitle: this?.getDetails?.learning_subtitle || '',
      learning_below_subtitle: this?.getDetails?.learning_below_subtitle || '',
      learning_description: this?.getDetails?.learning_description || '',
      kordie_title: this?.getDetails?.kordie_title || '',
      kordie_description: this?.getDetails?.kordie_description || '',
      kordie_job_subtitle: this?.getDetails?.kordie_job_subtitle || '',
      kordie_industries_title: this?.getDetails?.kordie_industries_title || '',
      story_title: this?.getDetails?.story_title || '',
      live_title: this?.getDetails?.live_title || '',
      next_title: this?.getDetails?.next_title || '',
    });

    //About Banner...........
    const bannerArray = this.addEditForm.get('about_banner') as FormArray;
    bannerArray.clear(); // Clear existing
    if (this.getDetails?.about_banner?.length) {
      this.getDetails.about_banner.forEach((banner: any, index: number) => {
        bannerArray.push(
          this.__fb.group({
            image: [banner.image || ''],
          })
        );
        // Update the image preview array
        this.bannerImagePreviews[index] = banner?.image || '';
      });
    } else {
      this.ensureAtLeastOneBannerSubsectionItem(); 
    }

    //Economic Section...........
    const sectionArray = this.addEditForm.get('economic_section') as FormArray;
    sectionArray.clear(); // Clear existing
    if (this.getDetails?.economic_section?.length) {
      this.getDetails.economic_section.forEach((section: any, index: number) => {
        sectionArray.push(
          this.__fb.group({
            title: [section.title || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneEconomicSubsectionItem(); 
    }

    //World Section...........
    const worldArray = this.addEditForm.get('world_section') as FormArray;
    worldArray.clear(); // Clear existing
    if (this.getDetails?.world_section?.length) {
      this.getDetails.world_section.forEach((world: any, index: number) => {
        worldArray.push(
          this.__fb.group({
            title: [world.title || ''],
            description: [world.description || '']
          })
        );
      });
    } else {
      this.ensureAtLeastOneWorldSubsectionItem(); 
    }

    //World Subsection...........
    const worldSubArray = this.addEditForm.get('world_subsection') as FormArray;
    worldSubArray.clear(); // Clear existing
    if (this.getDetails?.world_subsection?.length) {
      this.getDetails.world_subsection.forEach((subsection: any, index: number) => {
        worldSubArray.push(
          this.__fb.group({
            title: [subsection.title || ''],
            subtitle: [subsection.subtitle || '']
          })
        );
      });
    } else {
      this.ensureAtLeastOneWorldSubSubsectionItem(); 
    }

    //Learning skill...........
    const learningArray = this.addEditForm.get('learning_skill') as FormArray;
    learningArray.clear(); // Clear existing
    if (this.getDetails?.learning_skill?.length) {
      this.getDetails.learning_skill.forEach((learning: any, index: number) => {
        learningArray.push(
          this.__fb.group({
            title: [learning.title || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneSkillsectionItem(); 
    }

    //Kordie Job Section...........
    const jobArray = this.addEditForm.get('kordie_job_section') as FormArray;
    jobArray.clear(); // Clear existing
    if (this.getDetails?.kordie_job_section?.length) {
      this.getDetails.kordie_job_section.forEach((job: any, index: number) => {
        jobArray.push(
          this.__fb.group({
            title: [job.title || ''],
            description: [job.description || ''],
            image: [job.image || ''],
          })
        );
        // Update the image preview array
        this.jobImagePreviews[index] = job?.image || '';
      });
    } else {
      this.ensureAtLeastOneJobsectionItem(); 
    }

     //Kordie Industries Section...........
     const industriesArray = this.addEditForm.get('kordie_industries_section') as FormArray;
     industriesArray.clear(); // Clear existing
     if (this.getDetails?.kordie_industries_section?.length) {
       this.getDetails.kordie_industries_section.forEach((industries: any, index: number) => {
         industriesArray.push(
           this.__fb.group({
             title: [industries.title || ''],
           })
         );
       });
     } else {
       this.ensureAtLeastOneIndustriessectionItem(); 
     }

    //Story Section...........
    const storyArray = this.addEditForm.get('story_section') as FormArray;
    storyArray.clear(); // Clear existing
    if (this.getDetails?.story_section?.length) {
      this.getDetails.story_section.forEach((story: any, index: number) => {
        storyArray.push(
          this.__fb.group({
            description: [story.description || ''],
            image: [story.image || ''],
          })
        );
        // Update the image preview array
        this.storyImagePreviews[index] = story?.image || '';
      });
    } else {
      this.ensureAtLeastOneStorysectionItem(); 
    }

    //Live Section...........
    const liveArray = this.addEditForm.get('live_section') as FormArray;
    liveArray.clear(); // Clear existing
    if (this.getDetails?.live_section?.length) {
      this.getDetails.live_section.forEach((live: any, index: number) => {
        liveArray.push(
          this.__fb.group({
            title: [live.title || ''],
            description: [live.description || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneLivesectionItem(); 
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
       this.ensureAtLeastOneNextsectionItem(); 
     }

  }
}
