import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BusinessService } from '../../../services/business/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../services/editor/editor.service';
import { ProductService } from '../../../services/product/product.service';
import { ListService } from '../../../services/master-list/list.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  isDisabled = true;
  detailsId: string | null = null;
    displayMessage: string = '';
    errorMessage: string = '';
    addEditForm!: FormGroup;
    editorConfig: any;
    new_world_banner!: FormArray;
    new_world_banner_bottom_section!: FormArray
    bannerImagePreviews: any = [];
    isLoading = false;
    mediaType:string = '';
    imagePreview: string | null = null;
    videoPreview: string | null = null;
    selectedFile: string = '';
    filename:any;
    getDetails: any;
    industryList:any;
    dropdownSettings_industry: any = {};
    selectedIndustries: any = [];
    our_service_section!: FormArray;
    ourServiceImagePreview: string | null = null;
    ourServiceImageUrl: string = '';
    mediaTypes: any = [];
    serviceImagePreviews: any =[]; // Track image previews
    servicevideoPreview: any = []; // Track video previews
    serviceSelectedImageFile:any=[];
    serviceSelectedVideoFile:any=[];
    our_service_section_next!: FormArray;
    getType:any=[];
    susSelectedImageFile:any=[];
    susSelectedVideoFile:any=[];
    explore_section!: FormArray;
    exploreImagePreviews: any = [];
    exploreImageUrl: string = '';
    area_section!: FormArray;
    discoverImagePreview: string | null = null;
    discoverImageUrl: string = '';
    how_it_works_section!: FormArray;
    how_it_different_section!: FormArray;
    differentImagePreviews: any = [];
    differentLogoPreviews: any = [];
    protectingImagePreviews: any = [];
    protecting_section!: FormArray;
    serviceSectionImagePreviews: any = [];


  constructor(
    private __fb: FormBuilder,
        private __business: BusinessService,
        private __route: Router,
        private __shared: SharedService,
        private __spinner: NgxSpinnerService,
        private __activatedRoute: ActivatedRoute,
        private editorSettings: EditorService,
        private _product: ProductService,
        private _serv: ListService,
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
    this.getIndustry(); // Fetch industry list first
    if (this.detailsId) {
      this.getDetail();
      this.editorConfig = this.editorSettings.viewEditorConfig();
      this.multipleDataSettings();
    }
  }

  multipleDataSettings(){
    this.dropdownSettings_industry = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };
  }

   // Initialize Form
      createForm() {
        this.addEditForm = this.__fb.group({
          new_world_title: [''],
          new_world_description: [''],
          new_world_banner: this.__fb.array([]),
          new_world_banner_bottom_section: this.__fb.array([]),
          kordie_supports_title: [''],
          kordie_supports_subtitle: [''],
          kordie_supports_description: [''],
          kordie_supports_type: [''],
          kordie_supports_media: [''],
          industry_title: [''],
          industry_tab: [[]],
          service_title: [''],
          service_description: [''],
          our_service_section: this.__fb.array([]),
          our_service_media: [''],
          our_service_section_next: this.__fb.array([]),
          explore_title: [''],
          explore_section: this.__fb.array([]),
          area_title: [''],
          area_description: [''],
          area_section: this.__fb.array([]),
          discover_title: [''],
          discover_subtitle: [''],
          discover_description: [''],
          discover_image: [''],
          how_it_works_title: [''],
          how_it_works_subtitle: [''],
          how_it_works_description: [''],
          how_it_works_section: this.__fb.array([]),
          how_it_different_title: [''],
          how_it_different_section: this.__fb.array([]),
          protecting_title: [''],
          protecting_description: [''],
          protecting_section: this.__fb.array([]),
          ready_title: [''],
          ready_description: [''],
          insight_title: [''],
        });
  
        this.new_world_banner = this.addEditForm.get('new_world_banner') as FormArray;
        this.ensureNewWorldBanner(); 
  
        this.new_world_banner_bottom_section = this.addEditForm.get('new_world_banner_bottom_section') as FormArray;
        this.ensureBottomSection(); 
  
        this.our_service_section = this.addEditForm.get('our_service_section') as FormArray;
        this.ensureOurService();
  
        this.our_service_section_next = this.addEditForm.get('our_service_section_next') as FormArray;
        this.ensureOurServiceNext();
  
        this.explore_section = this.addEditForm.get('explore_section') as FormArray;
        this.ensureExploreSection();
  
        this.area_section = this.addEditForm.get('area_section') as FormArray;
        this.ensureAreaSection();
  
        this.how_it_works_section = this.addEditForm.get('how_it_works_section') as FormArray;
        this.ensureHowSection();
  
        this.how_it_different_section = this.addEditForm.get('how_it_different_section') as FormArray;
        this.ensureDifferentSection();
  
        this.protecting_section = this.addEditForm.get('protecting_section') as FormArray;
        this.ensureProtectingSection();
      }
  
      //Getter.......................................................................................
  
      // Getter for new world banner controls
      get bannerControls() {
        return (this.addEditForm.get('new_world_banner') as FormArray)?.controls || [];
      }
      // Getter for new world banner bottom section controls
      get bottomSectionControls() {
      return (this.addEditForm.get('new_world_banner_bottom_section') as FormArray)?.controls || [];
      }
      // Getter for our service section controls
      get serviceControls() {
        return (this.addEditForm.get('our_service_section') as FormArray)?.controls || [];
      }
      // Getter for our service next section controls
      get serviceNextControls() {
        return (this.addEditForm.get('our_service_section_next') as FormArray)?.controls || [];
      }
      // Getter for explore section controls
      get exploreControls() {
        return (this.addEditForm.get('explore_section') as FormArray)?.controls || [];
      }
      // Getter for Area section controls
      get areaControls() {
        return (this.addEditForm.get('area_section') as FormArray)?.controls || [];
      }
  
      // Getter for How section controls
      get howSectionControls() {
        return (this.addEditForm.get('how_it_works_section') as FormArray)?.controls || [];
      }
  
      // Getter for How different controls
      get differentControls() {
        return (this.addEditForm.get('how_it_different_section') as FormArray)?.controls || [];
      }
  
      // Getter for protecting controls
      get protectingControls() {
        return (this.addEditForm.get('protecting_section') as FormArray)?.controls || [];
      }
  
  
      //Create......................................................................................
  
      // Create a new banner item
      createBannerItem() {
        return this.__fb.group({
          image:[''],
        });
      }  
  
      // Create a new world bottom section item
      createNewWorldBottomItem() {
        return this.__fb.group({
          title: [''],
          description: ['']
        });
      }
  
      // Create a new our service section item
      createOurServiceItem() {
        return this.__fb.group({
          title: [''],
          description: ['']
        });
      }
  
      // Create a new our service next section item
      createOurServiceNextItem() {
        return this.__fb.group({
          title: [''],
          description: [''],
          type: [''],
          media: ['']
        });
      }
  
      // Create explore section item
      createExploreSectionItem() {
        return this.__fb.group({
          title: [''],
          description: [''],
          type: ['image'],
          media: ['']
        });
      }
  
      // Create a area section item
      createAreaItem() {
        return this.__fb.group({
          title: [''],
          description: ['']
        });
      }
  
      // Create a how section item
      createHowAreaItem() {
        return this.__fb.group({
          title: [''],
          description: ['']
        });
      }
  
      // Create different section item
      createDifferentSectionItem() {
        return this.__fb.group({
          title: [''],
          description: [''],
          type: ['image'],
          media: [''],
          logo:['']
        });
      }
  
       // Create protecting section item
       createProtectingSectionItem() {
        return this.__fb.group({
          title: [''],
          description: [''],
          type: ['image'],
          media: ['']
        });
      }
  
  
      //Add........................................................................................
  
      // Add new world banner item
      addBannerSectionItem() {
        this.new_world_banner.push(this.createBannerItem());
      }
  
      // Add new world bottom section item
      addBottomSection() {
        this.new_world_banner_bottom_section.push(this.createNewWorldBottomItem());
      }
  
      // Add our service section item
      addOurService() {
        this.our_service_section.push(this.createOurServiceItem());
      }
  
      // Add our next service section item
      addNextServiceItem(){
        this.our_service_section_next.push(this.createOurServiceNextItem());
      }
  
      // Add explore section item
      addExploreItem(){
        this.explore_section.push(this.createExploreSectionItem());
      }
  
      // Add area section item
      addAreaSection(){
        this.area_section.push(this.createAreaItem());
      }
  
      // Add how area section item
      addHowSection(){
        this.how_it_works_section.push(this.createHowAreaItem());
      }
  
      // Add how different section item
      addDifferentItem(){
        this.how_it_different_section.push(this.createDifferentSectionItem());
      }
  
      // Add protecting section item
      addProtectingItem(){
        this.protecting_section.push(this.createProtectingSectionItem());
      }
  
      //Remove......................................................................................
  
      // Remove new world banner item
      removeBannerSectionItem(index: number) {
        this.new_world_banner.removeAt(index);
        this.bannerImagePreviews.splice(index, 1);
        this.ensureNewWorldBanner(); // Ensure at least one item remains
      }
  
      // Remove world section bottom item
      removeBottomSection(index: number) {
        this.new_world_banner_bottom_section.removeAt(index);
        this.ensureBottomSection(); // Ensure at least one item remains
      }
  
      // Remove our service item
      removeServiceSection(index: number) {
        this.our_service_section.removeAt(index);
        this.serviceSectionImagePreviews.splice(index,1);
        this.ensureOurService(); // Ensure at least one item remains
      }
  
      removenextServiceItem(index: number){
        this.our_service_section_next.removeAt(index);
        this.ensureOurServiceNext();
      }
  
      removeExploreItem(index: number){
        this.our_service_section_next.removeAt(index);
        this.ensureExploreSection();
      }
  
       removeAreaSection(index: number) {
        this.area_section.removeAt(index);
        this.ensureAreaSection(); // Ensure at least one item remains
      }
  
      removeHowAreaSection(index: number) {
        this.how_it_works_section.removeAt(index);
        this.ensureHowSection(); // Ensure at least one item remains
      }
  
      removeDifferentItem(index: number) {
        this.how_it_different_section.removeAt(index);
        this.ensureDifferentSection(); // Ensure at least one item remains
      }
  
      removeProtectingItem(index: number) {
        this.protecting_section.removeAt(index);
        this.ensureProtectingSection(); // Ensure at least one item remains
      }
  
      //Ensure......................................................................................
      private ensureNewWorldBanner(): void {
        if (this.new_world_banner.length === 0) {
          this.addBannerSectionItem();
        }
      }
  
      private ensureBottomSection(): void {
        if (this.new_world_banner_bottom_section.length === 0) {
          this.addBottomSection();
        }
      }
  
      private ensureOurService(): void {
        if (this.our_service_section.length === 0) {
          this.addOurService();
        }
      }
  
      private ensureOurServiceNext(): void {
        if (this.our_service_section_next.length === 0) {
          this.addNextServiceItem();
        }
      }
  
      private ensureExploreSection(): void{
        if (this.explore_section.length === 0) {
          this.addExploreItem();
        }
      }
  
      private ensureAreaSection(): void{
        if (this.area_section.length === 0) {
          this.addAreaSection();
        }
      }
  
      private ensureHowSection(): void{
        if (this.how_it_works_section.length === 0) {
          this.addHowSection();
        }
      }
  
      private ensureDifferentSection(): void{
        if (this.how_it_different_section.length === 0) {
          this.addDifferentItem();
        }
      }
  
      private ensureProtectingSection(): void{
        if (this.protecting_section.length === 0) {
          this.addProtectingItem();
        }
      }
  
      //Upload Image..............................................
      onImageSelected(event: Event, index: number,type: any): void {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
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
          else  if(type === 'serviceImage'){
            reader.onload = () => {
              this.ourServiceImagePreview = reader.result as string; // Show preview image
            };
            reader.readAsDataURL(file);
          }
          else  if(type === 'exploreImage'){
            reader.onload = () => {
              this.exploreImagePreviews[index] = reader.result as string; // Show preview image
            };
            reader.readAsDataURL(file);
          }
          else  if(type === 'discoverImage'){
            reader.onload = () => {
              this.discoverImagePreview = reader.result as string; // Show preview image
            };
            reader.readAsDataURL(file);
          }
          else  if(type === 'differentImage'){
            reader.onload = () => {
              this.differentImagePreviews[index] = reader.result as string; // Show preview image
            };
            reader.readAsDataURL(file);
          }
          else  if(type === 'differentLogo'){
            reader.onload = () => {
              this.differentLogoPreviews[index] = reader.result as string; // Show preview image
            };
            reader.readAsDataURL(file);
          }
          else  if(type === 'protectingImage'){
            reader.onload = () => {
              this.protectingImagePreviews[index] = reader.result as string; // Show preview image
            };
            reader.readAsDataURL(file);
          }
          // Upload the file and update the form with the actual URL
        this.uploadFile(file, index, type);
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
              const imageUrl = response?.data?.mediaUrl?.fileUrl;
              if(type === 'bannerImage'){
                const bannerImageArray = this.addEditForm.get('new_world_banner') as FormArray;
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
              else  if(type === 'nextServiceMedia'){
                const nextServiceMediaArray = this.addEditForm.get('our_service_section_next') as FormArray;
                if (nextServiceMediaArray && nextServiceMediaArray.length > index) {
                  if(this.detailsId){
                    nextServiceMediaArray.at(index).patchValue({ media: imageUrl });
                  }
                  else{
                    nextServiceMediaArray.at(index).patchValue({ media: imageUrl });
                  }
                  // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
                } else {
                  console.error(`FormArray is invalid or index ${index} is out of range.`);
                }
              }
              else if(type === 'serviceImage'){
                this.ourServiceImageUrl  = imageUrl
              }
              else if(type === 'kordieImage'){
                this.selectedFile  = imageUrl
              }
              else if(type === 'kordieVideo'){
                this.selectedFile  = imageUrl
              }
              else  if(type === 'exploreImage'){
                const exploreMediaArray = this.addEditForm.get('explore_section') as FormArray;
                if (exploreMediaArray && exploreMediaArray.length > index) {
                  if(this.detailsId){
                    exploreMediaArray.at(index).patchValue({ media: imageUrl });
                  }
                  else{
                    exploreMediaArray.at(index).patchValue({ media: imageUrl });
                  }
                  // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
                } else {
                  console.error(`FormArray is invalid or index ${index} is out of range.`);
                }
              }
              else if(type === 'discoverImage'){
                this.discoverImageUrl  = imageUrl
              }
              else  if(type === 'differentImage'){
                const differentMediaArray = this.addEditForm.get('how_it_different_section') as FormArray;
                if (differentMediaArray && differentMediaArray.length > index) {
                  if(this.detailsId){
                    differentMediaArray.at(index).patchValue({ media: imageUrl });
                  }
                  else{
                    differentMediaArray.at(index).patchValue({ media: imageUrl });
                  }
                  // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
                } else {
                  console.error(`FormArray is invalid or index ${index} is out of range.`);
                }
              }
              else  if(type === 'differentLogo'){
                const differenLogoArray = this.addEditForm.get('how_it_different_section') as FormArray;
                if (differenLogoArray && differenLogoArray.length > index) {
                  if(this.detailsId){
                    differenLogoArray.at(index).patchValue({ logo: imageUrl });
                  }
                  else{
                    differenLogoArray.at(index).patchValue({ logo: imageUrl });
                  }
                  // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
                } else {
                  console.error(`FormArray is invalid or index ${index} is out of range.`);
                }
              }
              else  if(type === 'protectingImage'){
                const protectingImageArray = this.addEditForm.get('protecting_section') as FormArray;
                if (protectingImageArray && protectingImageArray.length > index) {
                  if(this.detailsId){
                    protectingImageArray.at(index).patchValue({ media: imageUrl });
                  }
                  else{
                    protectingImageArray.at(index).patchValue({ media: imageUrl });
                  }
                  // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
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
  
      selectType(event:any){
        this.resetFileSelection();
        this.mediaType = event?.target?.value;
      }
  
  
      selectServiceMediaType(event: any, index: number): void {
        this.resetFileServiceSelection(index);
        const selectedType = event.target?.value;
        if (!this.mediaTypes[index]) {
          this.mediaTypes[index] = selectedType; // Initialize the value at the index
        } else {
          this.mediaTypes[index] = selectedType; // Update the value if already initialized
        }
      }
  
      resetFileServiceSelection(index:number): void {
        // Reset the selected file and preview
        this.serviceSelectedImageFile[index] = null;
        this.serviceSelectedVideoFile[index] = null;
        this.filename = null;
        this.serviceImagePreviews[index] = null;
        this.servicevideoPreview[index] = null;
      
        // Optionally, reset the file input element itself (if needed)
        const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
        if (fileInput) {
          fileInput.value = '';  // Clear the file input value
        }
      }
  
      resetFileSelection(): void {
        // Reset the selected file and preview
        this.selectedFile = '';
        this.filename = null;
        this.imagePreview = null;
        this.videoPreview = null;
        // Optionally, reset the file input element itself (if needed)
        const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
        if (fileInput) {
          fileInput.value = '';  // Clear the file input value
        }
      }
  
      //Selected image or video
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
  
      onMediaNextServiceSelected(event: Event, index: number): void {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (this.mediaTypes.length <= index) {
          this.mediaTypes.length = index + 1;
        }
        if (file) {
          if (this.mediaTypes[index] === 'image' || this.getType[index] === 'image') {
            this.handleNextServiceImage(file, index);
          } else if (this.mediaTypes[index] === 'video' || this.getType[index] === 'video') {
            this.handleNextServiceVideo(file, index);
          }
        }
      }
  
      handleNextServiceImage(file: File, index: number): void {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
          this.resetFileServiceSelection(index);
          return;
        }
      
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 10MB limit.');
          this.resetFileServiceSelection(index);
          return;
        }
      
        this.susSelectedImageFile[index]= file;
        const reader = new FileReader();
        reader.onload = () => {
          this.serviceImagePreviews[index] = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, index, 'nextServiceMedia');
      }
      
      handleNextServiceVideo(file: File, index: number): void {
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
          this.resetFileServiceSelection(index);
          return;
        }
      
        const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 80MB limit.');
          this.resetFileServiceSelection(index);
          return;
        }
        // console.log("file.....",file);
        
        this.susSelectedVideoFile[index] = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.servicevideoPreview[index] = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, index, 'nextServiceMedia');
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
    
        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, 0, 'kordieImage');
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
  
        // Preview the video
        const reader = new FileReader();
        reader.onload = () => {
          this.videoPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, 0, 'kordieVideo');
      }
  
    //For industry details.......
    getIndustry(){
      const params = {
        active: true
      }
      this._serv.industryList(params)
      .subscribe((response)=>{
        if(response.error == false)
        {
          this.industryList = response?.data?.items;
          if (this.detailsId) {
            this.getDetail();
            this.editorConfig = this.editorSettings.viewEditorConfig();
            this.multipleDataSettings();
          }
          console.log(this.industryList);
          
        }
      },
      (err)=>{
        this.isLoading = false;
        this.__spinner.hide(); // Start visual spinner
        console.log(err);
        if(err.status == 403)
            {
                  this.__shared.sessionExpired();
            }
      })
    }
  
      //Save Data..............
      add(){
        const data: any = this.addEditForm?.value;
  
        if (!this.selectedFile && !this.getDetails?.kordie_supports_media) {
          this.__shared.toastError('Please upload ' + this.mediaType);
          return;
        }
  
        if (!this.ourServiceImageUrl && !this.getDetails?.our_service_media) {
          this.__shared.toastError('Please upload our servie media image!');
          return;
        }
  
        if (!this.discoverImageUrl && !this.getDetails?.discover_image) {
          this.__shared.toastError('Please upload discover image!');
          return;
        }
  
        const ouserViceArray = {
          title : data?.service_title || '',
          description: data?.service_description || ''
        }
  
        const params: any = {
          new_world_title: data?.new_world_title || '',
          new_world_description: data?.new_world_description || '',
          new_world_banner: data?.new_world_banner || [],
          new_world_banner_bottom_section: data?.new_world_banner_bottom_section || [],
          kordie_supports_title: data?.kordie_supports_title || '',
          kordie_supports_subtitle: data?.kordie_supports_subtitle || '',
          kordie_supports_description: data?.kordie_supports_description || '',
          kordie_supports_type: data?.kordie_supports_type || '',
          kordie_supports_media: this.selectedFile || this.getDetails.kordie_supports_media ,
          industry_title: data?.industry_title || '',
          industry_tab: data?.industry_tab?.map((industry:any) => industry._id) || [],
          our_service_section: data?.our_service_section || [],
          our_service: ouserViceArray || {},
          our_service_media:  this.ourServiceImageUrl || this.getDetails?.our_service_media,
          our_service_section_next: data?.our_service_section_next || [],
          explore_title: data?.explore_title || '',
          explore_section: data?.explore_section || [],
          area_title: data?.area_title || '',
          area_description: data?.area_description || '',
          area_section: data?.area_section || [],
          discover_title: data?.discover_title || '',
          discover_subtitle: data?.discover_subtitle || '',
          discover_description: data?.discover_description || '',
          discover_image:  this.discoverImageUrl || this.getDetails?.discover_image,
          how_it_works_title: data?.how_it_works_title || '',
          how_it_works_subtitle: data?.how_it_works_subtitle || '',
          how_it_works_description: data?.how_it_works_description || '',
          how_it_works_section: data?.how_it_works_section || [],
          how_it_different_title: data?.how_it_different_title || '',
          how_it_different_section: data?.how_it_different_section || [],
          protecting_title: data?.protecting_title || '',
          protecting_description: data?.protecting_description || '',
          ready_title: data?.ready_title || '',
          ready_description: data?.ready_description || '',
          insight_title: data?.insight_title || '',
          protecting_section: data?.protecting_section || [],
        }
  
         // Show loader
        this.isLoading = true;
        this.__spinner.show(); // Start visual spinner
        const apiCall = this.detailsId
        ? this.__business.edit(this.detailsId, params)
        : this.__business.create(params);
  
        apiCall.subscribe(
          response => {
            this.isLoading = false; // Stop loading spinner
            this.__spinner.hide(); // Hide visual spinner
            if (!response.error) {
                this.displayMessage = this.detailsId
                    ? "Details updated successfully."
                    : "Details added successfully.";
                this.__shared.toastSuccess(this.displayMessage);
                this.__route.navigate(['/business-profile/list']);
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
  
       // Fetch details for editing
    getDetail() {
      this.__business.getDetailById(this.detailsId).subscribe(
        (response: any) => {
          if (!response.error) {
            
            this.getDetails = response?.data;
            console.log("this.getDetails====",this.getDetails);
            
            this.selectedIndustries = this.getDetails?.industry_tab
              ?.map((id: string) => 
                Array.isArray(this.industryList) 
                  ? this.industryList.find((industry: any) => industry?._id === id) 
                  : null)
                .filter((item: any) => item); // Remove null values
  
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
        new_world_title: this?.getDetails?.new_world_title || '',
        new_world_description: this?.getDetails?.new_world_description || '',
        kordie_supports_title: this?.getDetails?.kordie_supports_title || '',
        kordie_supports_subtitle: this?.getDetails?.kordie_supports_subtitle || '',
        kordie_supports_description: this?.getDetails?.kordie_supports_description || '',
        kordie_supports_type: this.getDetails.kordie_supports_type ? this.getDetails.kordie_supports_type : '',
        industry_title: this.getDetails?.industry_title || '',
        industry_tab: this.selectedIndustries || [],
        service_title: this.getDetails?.our_service?.title || '',
        service_description: this.getDetails?.our_service?.description || '',
        explore_title: this.getDetails?.explore_title || '',
        area_title: this?.getDetails?.area_title || '',
        area_description: this?.getDetails?.area_description || '',
        discover_title: this?.getDetails?.discover_title || '',
        discover_subtitle: this?.getDetails?.discover_subtitle || '',
        discover_description: this?.getDetails?.discover_description || '',
        how_it_works_title: this?.getDetails?.how_it_works_title || '',
        how_it_works_subtitle: this?.getDetails?.how_it_works_subtitle || '',
        how_it_works_description: this?.getDetails?.how_it_works_description || '',
        how_it_different_title: this?.getDetails?.how_it_different_title || '',
        protecting_title: this?.getDetails?.protecting_title || '',
        protecting_description: this?.getDetails?.protecting_description || '',
        ready_title: this?.getDetails?.ready_title || '',
        ready_description: this?.getDetails?.ready_description || '',
        insight_title: this?.getDetails?.insight_title || '',
      });
  
      this.ourServiceImagePreview = this.getDetails?.our_service_media || '';
      this.discoverImagePreview = this.getDetails?.discover_image || '';
  
      // Handle media preview
      const mediaUrl = this.getDetails?.kordie_supports_media;
      if (mediaUrl) {
        if (this.getDetails.kordie_supports_type === 'image') {
          this.imagePreview = mediaUrl; // Set the preview URL for images
          this.mediaType = 'image'; // Set the media type to image
        } else if (this.getDetails.kordie_supports_type === 'video') {
          this.videoPreview = mediaUrl; // Set the preview URL for videos
          this.mediaType = 'video'; // Set the media type to video
        }
      }
  
       const bannerArray = this.addEditForm.get('new_world_banner') as FormArray;
       bannerArray.clear(); // Clear existing
       if (this.getDetails?.new_world_banner?.length) {
         this.getDetails.new_world_banner.forEach((banner: any, index: number) => {
           bannerArray.push(
             this.__fb.group({
               image: [banner.image || ''],
             })
           );
           // Update the image preview array
           this.bannerImagePreviews[index] = banner?.image || '';
         });
       } else {
         this.ensureNewWorldBanner(); 
       }
  
       const worldArray = this.addEditForm.get('new_world_banner_bottom_section') as FormArray;
       worldArray.clear(); // Clear existing
       if (this.getDetails?.new_world_banner_bottom_section?.length) {
         this.getDetails.new_world_banner_bottom_section.forEach((world: any, index: number) => {
           worldArray.push(
             this.__fb.group({
               title: [world.title || ''],
               description: [world.description || '']
             })
           );
         });
       } else {
         this.ensureBottomSection(); 
       }
  
       const serviceArray = this.addEditForm.get('our_service_section') as FormArray;
       serviceArray.clear(); // Clear existing
       if (this.getDetails?.our_service_section?.length) {
         this.getDetails.our_service_section.forEach((serv: any, index: number) => {
           serviceArray.push(
             this.__fb.group({
               title: [serv.title || ''],
               description: [serv.description || ''],
               image: [serv.image || ''],
             })
           );
           this.serviceSectionImagePreviews[index] = serv.image || '';
         });
       } else {
         this.ensureOurService(); 
       }
  
       const serviceNextArray = this.addEditForm.get('our_service_section_next') as FormArray;
       serviceNextArray.clear(); 
       if (this.getDetails?.our_service_section_next?.length) {
         this.getDetails.our_service_section_next.forEach((sus: any, index: number) => {
           serviceNextArray.push(
             this.__fb.group({
               title: [sus.title || ''],
               description: [sus.description || ''],
               type: [sus.type || ''],
               media: [sus.media || ''],
             })
           );
       
           this.getType[index] = sus.type;
       
           if (sus.type === 'image') {
             this.serviceImagePreviews[index] = sus.media || '';
           } else if (sus.type === 'video') {
             this.servicevideoPreview[index] = sus.media || '';
           }
         }); 
       } else {
         this.ensureOurServiceNext(); 
       }
  
       const exploreArray = this.addEditForm.get('explore_section') as FormArray;
       exploreArray.clear(); 
       if (this.getDetails?.explore_section?.length) {
         this.getDetails.explore_section.forEach((explore: any, index: number) => {
           exploreArray.push(
             this.__fb.group({
               title: [explore.title || ''],
               description: [explore.description || ''],
               type: [explore.type || ''],
               media: [explore.media || ''],
             })
           );
       
           this.getType[index] = explore.type;
       
           if (explore.type === 'image') {
             this.exploreImagePreviews[index] = explore.media || '';
           } 
         }); 
       } else {
         this.ensureExploreSection(); 
       }
  
       const areaSectionArray = this.addEditForm.get('area_section') as FormArray;
       areaSectionArray.clear(); // Clear existing
       if (this.getDetails?.area_section?.length) {
         this.getDetails.area_section.forEach((area: any, index: number) => {
           areaSectionArray.push(
             this.__fb.group({
               title: [area.title || ''],
               description: [area.description || '']
             })
           );
         });
       } else {
         this.ensureAreaSection(); 
       }
  
       const howSectionArray = this.addEditForm.get('how_it_works_section') as FormArray;
       howSectionArray.clear(); // Clear existing
       if (this.getDetails?.how_it_works_section?.length) {
         this.getDetails.how_it_works_section.forEach((how: any, index: number) => {
           howSectionArray.push(
             this.__fb.group({
               title: [how.title || ''],
               description: [how.description || '']
             })
           );
         });
       } else {
         this.ensureHowSection(); 
       }
  
       const differentArray = this.addEditForm.get('how_it_different_section') as FormArray;
       differentArray.clear(); 
       if (this.getDetails?.how_it_different_section?.length) {
         this.getDetails.how_it_different_section.forEach((different: any, index: number) => {
           differentArray.push(
             this.__fb.group({
               title: [different.title || ''],
               description: [different.description || ''],
               type: [different.type || ''],
               media: [different.media || ''],
               logo: [different.logo || ''],
             })
           );
       
           this.getType[index] = different.type;
       
           if (different.type === 'image') {
             this.differentImagePreviews[index] = different.media || '';
             this.differentLogoPreviews[index] = different.logo || '';
           } 
         }); 
       } else {
         this.ensureExploreSection(); 
       }
  
       const protectingArray = this.addEditForm.get('protecting_section') as FormArray;
       protectingArray.clear(); 
       if (this.getDetails?.protecting_section?.length) {
         this.getDetails.protecting_section.forEach((protecting: any, index: number) => {
           protectingArray.push(
             this.__fb.group({
               title: [protecting.title || ''],
               description: [protecting.description || ''],
               type: [protecting.type || ''],
               media: [protecting.media || ''],
             })
           );
       
           this.getType[index] = protecting.type;
       
           if (protecting.type === 'image') {
             this.protectingImagePreviews[index] = protecting.media || '';
           } 
         }); 
       } else {
         this.ensureProtectingSection(); 
       }
    }

}
