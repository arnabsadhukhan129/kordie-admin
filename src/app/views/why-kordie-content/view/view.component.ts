import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhyKordieService } from '../../../services/why-kordie-content/why-kordie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../services/product/product.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

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
    this.editorConfig = this.editorSettings.viewEditorConfig();
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
