import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../../../services/business/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../../services/editor/editor.service';
import { Program1Service } from '../../../../services/exclusive-program/program1.service';
import { ListService } from '../../../../services/master-list/list.service';
import { ProductService } from '../../../../services/product/product.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  isDisabled = true;
  addEditForm!: FormGroup;
  detailsId: string | null = null;
  displayMessage: string = '';
  errorMessage: string = '';
  editorConfig: any;
  isLoading = false;
  getCourseList:any =[];
  banner_icon_section!: FormArray;
  banner_bottom_section!: FormArray;
  bannerIconPreviews: any = [];
  contentPreviews:any = [];
  logoPreviews: any = [];
  slideIconPreviews: any = [];
  mediaType: string = '';
  overViewType: string = '';
  addressType: string = '';
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  imagePreview1: string | null = null;
  videoPreview1: string | null = null;
  imagePreview2: string | null = null;
  videoPreview2: string | null = null;
  selectedFile: string = '';
  selectedFile1: string = '';
  selectedFile2: string = '';
  filename:any;
  bottomImagePreview: string | null = null;
  authorMediaPreview: string | null = null;
  authorSubtitleMediaPreview: string | null = null;
  bottomImageUrl: string = '';
  authorMediaUrl: string = '';
  authorSubtitleMediaUrl: string = '';
  banner_slide_data!: FormArray;
  address_to_taglist!: FormArray;
  hospitality_area!: FormArray;
  external_consultants_list!: FormArray;
  meet_author_logo!: FormArray;
  mett_author_bottom_section!: FormArray;
  bottomImagePreviews: any = [];
  blockImagePreviews: any = [];
  blockIconPreviews: any = [];
  syllabusIconPreview: string | null = null;
  syllabusIconUrl: string = '';
  syllabus_title_subtitle_section!: FormArray;
  sneak_peek_section!: FormArray;
  self_study_section!: FormArray;
  businessImpactImage: string | null = null;
  certificateImagePreview: string | null = null;
  businessImpactImageUrl: string = '';
  business_impact_section!: FormArray;
  enrol_single_plan_box!: FormArray;
  certificateImageUrl: string = '';
  syllabus_accordion_block!: FormArray;
  blockContent!: FormArray;
  getDetails:any
  dropdownSettings_category: any = {};
  categoryList: any;

  constructor(
    private __fb: FormBuilder,
    private __business: BusinessService,
    private __route: Router,
    private __shared: SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute: ActivatedRoute,
    private editorSettings: EditorService,
    private __program1: Program1Service,
    private _serv: ListService,
    private _product: ProductService,
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
      this.editorConfig = this.editorSettings.viewEditorConfig();
    }
    this.getSanaCourse();
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
        course_name: ['', [Validators.required]],
        sana_course_id: ['',[Validators.required]],
        course_description: ['',[Validators.required]],
        course_category: [''],
        banner_icon_section: this.__fb.array([]),
        banner_bottom_section: this.__fb.array([]),
        banner_type: ['', [Validators.required]],
        banner_media: [''],
        banner_bottom_section_media: [''],
        banner_bottom_section_title: ['', [Validators.required]],
        banner_bottom_section_description: ['', [Validators.required]],
        banner_slide_data: this.__fb.array([]),
        program_overview_title: ['', [Validators.required]],
        program_overview_type: ['', [Validators.required]],
        program_overview_media: [''],
        program_overview_description: ['', [Validators.required]],
        address_to_title: ['', [Validators.required]],
        address_to_description: ['', [Validators.required]],
        address_to_taglist: this.__fb.array([]),
        address_to_type: ['', [Validators.required]],
        address_to_media: [''],
        hospitality_title: ['', [Validators.required]],
        hospitality_area: this.__fb.array([]),
        external_consultants_title: ['', [Validators.required]],
        external_consultants_description: ['', [Validators.required]],
        external_consultants_list: this.__fb.array([]),
        meet_author_title: ['', [Validators.required]],
        meet_author_title_subtitle: ['', [Validators.required]],
        meet_author_media: [''],
        meet_author_subtitle_media: [''],
        mett_author_description: ['', [Validators.required]],
        meet_author_logo: this.__fb.array([]),
        meet_author_program_description: ['', [Validators.required]],
        mett_author_bottom_section: this.__fb.array([]),
        syllabus_title_icon: [''],
        syllabus_title_subtitle_section: this.__fb.array([]),
        syllabus_accordion_block: this.__fb.array([]),
        blockContent: this.__fb.array([]),
        sneak_peek_title: ['', [Validators.required]],
        sneak_peek_section: this.__fb.array([]),
        self_study_title: ['', [Validators.required]],
        self_study_description: ['', [Validators.required]],
        self_study_section: this.__fb.array([]),
        business_impact_title: ['', [Validators.required]],
        business_impact_description: ['', [Validators.required]],
        business_impact_image: [''],
        business_impact_section: this.__fb.array([]),
        enrol_title: ['', [Validators.required]],
        enrol_description: ['', [Validators.required]],
        enrol_single_title: ['', [Validators.required]],
        enrol_single_duration: ['',[Validators.required]],
        enrol_single_price: ['',[Validators.required]],
        enrol_single_discount: ['',[Validators.required]],
        enrol_single_plan_box: this.__fb.array([]),
        certificate_title: ['',[Validators.required]],
        certificate_description: ['',[Validators.required]],
        certificate_image: [''],
        faq_title: ['',[Validators.required]],
        
      });

      this.dropdownSettings_category = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true // Enable search
      };
      this.banner_icon_section = this.addEditForm.get('banner_icon_section') as FormArray;
      this.bannerSection();
  
      this.banner_bottom_section = this.addEditForm.get('banner_bottom_section') as FormArray;
      this.bannerBottomSection();
  
      this.banner_slide_data = this.addEditForm.get('banner_slide_data') as FormArray;
      this.slideSection();
  
      this.address_to_taglist = this.addEditForm.get('address_to_taglist') as FormArray;
      this.tagSection();
  
      this.hospitality_area = this.addEditForm.get('hospitality_area') as FormArray;
      this.areaSection();
  
      this.external_consultants_list = this.addEditForm.get('external_consultants_list') as FormArray;
      this.externalSection();
  
      this.meet_author_logo = this.addEditForm.get('meet_author_logo') as FormArray;
      this.logoSection();
  
      this.mett_author_bottom_section = this.addEditForm.get('mett_author_bottom_section') as FormArray;
      this.bottomSection();
  
      this.syllabus_title_subtitle_section = this.addEditForm.get('syllabus_title_subtitle_section') as FormArray;
      this.syllabusTitleSection();
  
      this.sneak_peek_section = this.addEditForm.get('sneak_peek_section') as FormArray;
      this.sneakPeekSection();
  
      this.self_study_section = this.addEditForm.get('self_study_section') as FormArray;
      this.studySection();
  
      this.business_impact_section = this.addEditForm.get('business_impact_section') as FormArray;
      this.businessSection();
  
      this.enrol_single_plan_box = this.addEditForm.get('enrol_single_plan_box') as FormArray;
      this.boxSection();
  
      this.syllabus_accordion_block = this.addEditForm.get('syllabus_accordion_block') as FormArray;
      this.blockSection();
  
      this.blockContent = this.addEditForm.get('blockContent') as FormArray;
      this.blockContentSection();
  
      
    }
    //getter............................................................
    get bannerIconControls() {
      return (this.addEditForm.get('banner_icon_section') as FormArray)?.controls || [];
    }
    get bottomControls() {
      return (this.addEditForm.get('banner_bottom_section') as FormArray)?.controls || [];
    }
    get slideControls() {
      return (this.addEditForm.get('banner_slide_data') as FormArray)?.controls || [];
    }
    get tagControls() {
      return (this.addEditForm.get('address_to_taglist') as FormArray)?.controls || [];
    }
    get areaControls() {
      return (this.addEditForm.get('hospitality_area') as FormArray)?.controls || [];
    }
    get externalControls() {
      return (this.addEditForm.get('external_consultants_list') as FormArray)?.controls || [];
    }
    get logoControls() {
      return (this.addEditForm.get('meet_author_logo') as FormArray)?.controls || [];
    }
    get meetBottomControls() {
      return (this.addEditForm.get('mett_author_bottom_section') as FormArray)?.controls || [];
    }
    get syllabusTitleControls() {
      return (this.addEditForm.get('syllabus_title_subtitle_section') as FormArray)?.controls || [];
    }
    get blockControls() {
      return (this.addEditForm.get('syllabus_accordion_block') as FormArray)?.controls || [];
    }
    get contentControls() {
      return (this.addEditForm.get('blockContent') as FormArray)?.controls || [];
    }
    get tabContentControls() {
      return (this.addEditForm.get('sneak_peek_section') as FormArray)?.controls || [];
    }
    get studyControls() {
      return (this.addEditForm.get('self_study_section') as FormArray)?.controls || [];
    }
    get impactControls() {
      return (this.addEditForm.get('business_impact_section') as FormArray)?.controls || [];
    }
    get planBoxControls() {
      return (this.addEditForm.get('enrol_single_plan_box') as FormArray)?.controls || [];
    }
    
    //add formarray fields.........................................................
    addbannerIcontem(){
      this.banner_icon_section.push(this.createBannerSectionItem());
    }
    addBannerBottom(){
      this.banner_bottom_section.push(this.createBottomSectionItem());
    }
    addSlideItem(){
      this.banner_slide_data.push(this.createSlideItem());
    }
    addTag(){
      this.address_to_taglist.push(this.createTagItem());
    }
    addArea(){
      this.hospitality_area.push(this.createAreaItem());
    }
    addExternal(){
      this.external_consultants_list.push(this.createExternalItem());
    }
    addLogo(){
      this.meet_author_logo.push(this.createLogoItem());
    }
    addbottomItem(){
      this.mett_author_bottom_section.push(this.createMeetBottomItem());
    }
    addSyllabusTitle(){
      this.syllabus_title_subtitle_section.push(this.createSyllabusTitleItem());
    }
    addtabContentItem(){
      this.sneak_peek_section.push(this.createContentItem());
    }
    addStudyItem(){
      this.self_study_section.push(this.createStudyItem());
    }
    addBusinessItem(){
      this.business_impact_section.push(this.createBusinessItem());
    }
  
    addBoxItem(){
      this.enrol_single_plan_box.push(this.createBoxItem());
    }
  
    addblockItem(){
      this.syllabus_accordion_block.push(this.createBlockItem());
    }
  
    addContent(){
      this.blockContent.push(this.createBlockContentItem());
    }
  
    //formarray Intalize........................................................
     createBannerSectionItem() {
      return this.__fb.group({
        title: [''],
        description: [''],
        image: ['']
      });
    }
  
    createBottomSectionItem() {
      return this.__fb.group({
        title: [''],
        description: ['']
      });
    }
  
    createSlideItem() {
      return this.__fb.group({
        title: [''],
        icon: ['']
      });
    }
  
    createTagItem() {
      return this.__fb.group({
        title: ['']
      });
    }
  
    createSyllabusTitleItem() {
      return this.__fb.group({
        title: ['']
      });
    }
  
    createBlockItem() {
      return this.__fb.group({
        title: [''],
        time: [''],
        description: [''],
        image: [''],
      });
    }  
  
    createBlockContentItem(){
      return this.__fb.group({
        title: [''],
        icon: ['']
      })
    }
  
    createAreaItem() {
      return this.__fb.group({
        title: [''],
        description: ['']
      });
    }
  
    createExternalItem() {
      return this.__fb.group({
        title: ['']
      });
    }
  
    createLogoItem (){
      return this.__fb.group({
        image: ['']
      });
    }
  
    createMeetBottomItem() {
      return this.__fb.group({
        title: [''],
        description: [''],
        image: ['']
      });
    }
  
    createContentItem() {
      return this.__fb.group({
        tab_title: [''],
        tab_content_title: [''],
        tab_content_description: [''],
        tab_content_type: ['video'],
        tab_content_media: ['']
      });
    }
  
    createStudyItem() {
      return this.__fb.group({
        title: [''],
        description: ['']
      });
    }
  
    createBusinessItem() {
      return this.__fb.group({
        title: [''],
        description: ['']
      });
    }
  
    createBoxItem(){
      return this.__fb.group({
        description: ['']
      });
    }
  
    //Ensure formarray...............................................................
    private bannerSection(): void{
      if (this.banner_icon_section.length === 0) {
        this.addbannerIcontem();
      }
    }
  
    private bannerBottomSection(): void{
      if (this.banner_bottom_section.length === 0) {
        this.addBannerBottom();
      }
    }
  
    private slideSection(): void{
      if (this.banner_slide_data.length === 0) {
        this.addSlideItem();
      }
    }
  
    private tagSection(): void{
      if (this.address_to_taglist.length === 0) {
        this.addTag();
      }
    }
    private areaSection(): void{
      if (this.hospitality_area.length === 0) {
        this.addArea();
      }
    }
  
    private externalSection(): void{
      if (this.external_consultants_list.length === 0) {
        this.addExternal();
      }
    }
  
    private logoSection(): void{
      if (this.meet_author_logo.length === 0) {
        this.addLogo();
      }
    }
  
    private bottomSection(): void{
      if (this.mett_author_bottom_section.length === 0) {
        this.addbottomItem();
      }
    }
  
    private syllabusTitleSection(): void{
      if (this.syllabus_title_subtitle_section.length === 0) {
        this.addSyllabusTitle();
      }
    }
  
    private blockSection(): void{
      if (this.syllabus_accordion_block.length === 0) {
        this.addblockItem();
      }
    }
  
    private blockContentSection(): void{
      if (this.blockContent.length === 0) {
        this.addContent();
      }
    }
  
    private sneakPeekSection(): void{
      if (this.sneak_peek_section.length === 0) {
        this.addtabContentItem();
      }
    }
  
    private studySection(): void{
      if (this.self_study_section.length === 0) {
        this.addStudyItem();
      }
    }
  
    private businessSection(): void{
      if (this.business_impact_section.length === 0) {
        this.addBusinessItem();
      }
    }
  
    private boxSection(): void{
      if (this.enrol_single_plan_box.length === 0) {
        this.addBoxItem();
      }
    }
  
  
    //Remove formarray..................................................................
    removeBannerSection(index: number) {
      this.banner_bottom_section.removeAt(index);
      this.bannerBottomSection(); // Ensure at least one item remains
    }
  
  
    //Get Sana Course...............
    getSanaCourse(){
      this.isLoading = true;
      this.__spinner.show(); // Start visual spinner
      this._product.getSanaCourseList()
      .subscribe((response)=>{
        this.isLoading = false;
        this.__spinner.hide(); // Start visual spinner
        if(response.error == false)
        {
          this.getCourseList = response?.data?.data;
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
  
    getDetail() {
      this.__program1.getDetailById(this.detailsId).subscribe(
        (response: any) => {
          if (!response.error) {
            this.getDetails = response?.data;
            // console.log("this.getDetails====",this.getDetails);
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
        course_name: this?.getDetails?.course_name || '',
        sana_course_id: this.getDetails?.sana_course_id || '',
        course_description: this?.getDetails?.course_description || '',
        course_category: this.getDetails?.course_category || [''],
        banner_type: this?.getDetails?.banner_type || '',
        banner_bottom_section_title: this?.getDetails?.banner_bottom_section_title || '',
        banner_bottom_section_description: this?.getDetails?.banner_bottom_section_description || '',
        program_overview_title: this?.getDetails?.program_overview_title || '',
        program_overview_type: this?.getDetails?.program_overview_type || '',
        program_overview_description: this?.getDetails?.program_overview_description || '',
        address_to_title: this?.getDetails?.address_to_title || '',
        address_to_description: this?.getDetails?.address_to_description || '',
        address_to_type: this?.getDetails?.address_to_type || '',
        hospitality_title: this?.getDetails?.hospitality_title || '',
        external_consultants_title: this?.getDetails?.external_consultants_title || '',
        external_consultants_description: this?.getDetails?.external_consultants_description || '',
        meet_author_title: this?.getDetails?.meet_author_title || '',
        meet_author_title_subtitle: this?.getDetails?.meet_author_title_subtitle || '',
        mett_author_description: this?.getDetails?.mett_author_description || '',
        meet_author_program_description: this?.getDetails?.meet_author_program_description || '',
        sneak_peek_title: this?.getDetails?.sneak_peek_title || '',
        self_study_title: this?.getDetails?.self_study_title || '',
        self_study_description: this?.getDetails?.self_study_description || '',
        business_impact_title: this?.getDetails?.business_impact_title || '',
        business_impact_description: this?.getDetails?.business_impact_description || '',
        // business_impact_image: [''],
        enrol_title: this?.getDetails?.enrol_title || '',
        enrol_description: this?.getDetails?.enrol_description || '',
        enrol_single_title: this?.getDetails?.enrol_single_title || '',
        enrol_single_duration: this?.getDetails?.enrol_single_duration || '',
        enrol_single_price: this?.getDetails?.enrol_single_price || '',
        enrol_single_discount: this?.getDetails?.enrol_single_discount || '',
        certificate_title: this?.getDetails?.certificate_title || '',
        certificate_description: this?.getDetails?.certificate_description || '',
        // certificate_image: [''],
        faq_title: this?.getDetails?.faq_title || '',
      });
  
      
      // Handle media preview
    const mediaUrl = this.getDetails?.banner_media;
    if (mediaUrl) {
      if (this.getDetails.banner_type === 'image') {
        this.imagePreview = mediaUrl; // Set the preview URL for images
        this.mediaType = 'image'; // Set the media type to image
      } else if (this.getDetails.banner_type === 'video') {
        this.videoPreview = mediaUrl; // Set the preview URL for videos
        this.mediaType = 'video'; // Set the media type to video
      }
    }

    this.bottomImagePreview = this.getDetails?.banner_bottom_section_media || '';

    const programmediaUrl = this.getDetails?.program_overview_media;
    if (programmediaUrl) {
      if (this.getDetails.program_overview_type === 'image') {
        this.imagePreview1 = programmediaUrl; // Set the preview URL for images
        this.overViewType = 'image'; // Set the media type to image
      } else if (this.getDetails.program_overview_type === 'video') {
        this.videoPreview1 = programmediaUrl; // Set the preview URL for videos
        this.overViewType = 'video'; // Set the media type to video
      }
    }
  
      const addressmediaUrl = this.getDetails?.address_to_media;
      if (addressmediaUrl) {
        if (this.getDetails.address_to_type === 'image') {
          this.imagePreview2 = addressmediaUrl; // Set the preview URL for images
          this.addressType = 'image'; // Set the media type to image
        } else if (this.getDetails.address_to_type === 'video') {
          this.videoPreview2 = addressmediaUrl; // Set the preview URL for videos
          this.addressType = 'video'; // Set the media type to video
        }
      }
  
      this.authorMediaPreview = this.getDetails?.meet_author_media || '';
      this.authorSubtitleMediaPreview = this.getDetails?.meet_author_subtitle_media || '';
      this.syllabusIconPreview = this.getDetails?.syllabus_title_icon || '';
      this.businessImpactImage = this.getDetails?.business_impact_image || '';
      this.certificateImagePreview = this.getDetails?.certificate_image || '';
  
      const bannerArray = this.addEditForm.get('banner_icon_section') as FormArray;;
      bannerArray.clear(); // Clear existing
      if (this.getDetails?.banner_icon_section?.length) {
        this.getDetails.banner_icon_section.forEach((banner: any, index: number) => {
          bannerArray.push(
            this.__fb.group({
              title: [banner.title || ''],
              description: [banner.description || ''],
              image: [banner.image || ''],
            })
          );
          // Update the image preview array
          this.bannerIconPreviews[index] = banner?.image || '';
        });
      } else {
        this.bannerSection();
      }
  
      const bannerBottomSectionArray = this.addEditForm.get('banner_bottom_section') as FormArray;
       bannerBottomSectionArray.clear(); // Clear existing
       if (this.getDetails?.banner_bottom_section?.length) {
         this.getDetails.banner_bottom_section.forEach((bottom: any, index: number) => {
           bannerBottomSectionArray.push(
             this.__fb.group({
               title: [bottom.title || ''],
               description: [bottom.description || '']
             })
           );
         });
       } else {
         this.bannerBottomSection(); 
       }
  
  
      const bannerSlideArray = this.addEditForm.get('banner_slide_data') as FormArray;;
      bannerSlideArray.clear(); // Clear existing
      if (this.getDetails?.banner_slide_data?.length) {
        this.getDetails.banner_slide_data.forEach((banner: any, index: number) => {
          bannerSlideArray.push(
            this.__fb.group({
              title: [banner.title || ''],
              icon: [banner.icon || ''],
            })
          );
          // Update the image preview array
          this.slideIconPreviews[index] = banner?.icon || '';
        });
      } else {
        this.slideSection();
      }
  
      const addressTagSectionArray = this.addEditForm.get('address_to_taglist') as FormArray;
       addressTagSectionArray.clear(); // Clear existing
       if (this.getDetails?.address_to_taglist?.length) {
         this.getDetails.address_to_taglist.forEach((tag: any, index: number) => {
           addressTagSectionArray.push(
             this.__fb.group({
               title: [tag.title || '']
             })
           );
         });
       } else {
         this.tagSection(); 
       }
  
       const hospitialitySectionArray = this.addEditForm.get('hospitality_area') as FormArray;
       hospitialitySectionArray.clear(); // Clear existing
       if (this.getDetails?.hospitality_area?.length) {
         this.getDetails.hospitality_area.forEach((area: any, index: number) => {
           hospitialitySectionArray.push(
             this.__fb.group({
               title: [area.title || ''],
               description: [area.description || '']
             })
           );
         });
       } else {
         this.areaSection(); 
       }
  
       const externalSectionArray = this.addEditForm.get('external_consultants_list') as FormArray;
       externalSectionArray.clear(); // Clear existing
       if (this.getDetails?.external_consultants_list?.length) {
         this.getDetails.external_consultants_list.forEach((external: any, index: number) => {
           externalSectionArray.push(
             this.__fb.group({
               title: [external.title || '']
             })
           );
         });
       } else {
         this.areaSection(); 
       }
  
       const logoArray = this.addEditForm.get('meet_author_logo') as FormArray;;
       logoArray.clear(); // Clear existing
       if (this.getDetails?.meet_author_logo?.length) {
         this.getDetails.meet_author_logo.forEach((logo: any, index: number) => {
           logoArray.push(
             this.__fb.group({
               image: [logo.image || ''],
             })
           );
           // Update the image preview array
           this.logoPreviews[index] = logo?.image || '';
         });
       } else {
         this.logoSection();
       }
  
      const authorArray = this.addEditForm.get('mett_author_bottom_section') as FormArray;;
      authorArray.clear(); // Clear existing
      if (this.getDetails?.mett_author_bottom_section?.length) {
        this.getDetails.mett_author_bottom_section.forEach((author: any, index: number) => {
          authorArray.push(
            this.__fb.group({
              title: [author.title || ''],
              description: [author.description || ''],
              image: [author.image || ''],
            })
          );
          // Update the image preview array
          this.bottomImagePreviews[index] = author?.image || '';
        });
      } else {
        this.bottomSection();
      }
  
      const syllabusSectionArray = this.addEditForm.get('syllabus_title_subtitle_section') as FormArray;
       syllabusSectionArray.clear(); // Clear existing
       if (this.getDetails?.syllabus_title_subtitle_section?.length) {
         this.getDetails.syllabus_title_subtitle_section.forEach((syllabus: any, index: number) => {
           syllabusSectionArray.push(
             this.__fb.group({
               title: [syllabus.title || '']
             })
           );
         });
       } else {
         this.syllabusTitleSection(); 
       }
  
      const accordingArray = this.addEditForm.get('syllabus_accordion_block') as FormArray;;
      accordingArray.clear(); // Clear existing
      if (this.getDetails?.syllabus_accordion_block?.length) {
        this.getDetails.syllabus_accordion_block.forEach((according: any, index: number) => {
          accordingArray.push(
            this.__fb.group({
              title: [according.title || ''],
              time: [according.time || ''],
              description: [according.description || ''],
              image: [according.image || ''],
            })
          );
          // Update the image preview array
          this.blockImagePreviews[index] = according?.image || '';
        });
      } else {
        this.blockSection();
      }
  
  
      const sneakArray = this.addEditForm.get('sneak_peek_section') as FormArray;;
      sneakArray.clear(); // Clear existing
      if (this.getDetails?.sneak_peek_section?.length) {
        this.getDetails.sneak_peek_section.forEach((peek: any, index: number) => {
          sneakArray.push(
            this.__fb.group({
              tab_title: [peek.tab_title || ''],
              tab_content_title: [peek.tab_content_title || ''],
              tab_content_description: [peek.tab_content_description || ''],
              tab_content_media: [peek.tab_content_media || ''],
            })
          );
          // Update the tab_content_media preview array
          this.contentPreviews[index] = peek?.tab_content_media || '';
        });
      } else {
        this.sneakPeekSection();
      }
  
      const studyArray = this.addEditForm.get('self_study_section') as FormArray;;
      studyArray.clear(); // Clear existing
      if (this.getDetails?.self_study_section?.length) {
        this.getDetails.self_study_section.forEach((self: any, index: number) => {
          studyArray.push(
            this.__fb.group({
              title: [self.title || ''],
              description: [self.description || ''],
            })
          );
        });
      } else {
        this.studySection();
      }
  
      const businessArray = this.addEditForm.get('business_impact_section') as FormArray;;
      businessArray.clear(); // Clear existing
      if (this.getDetails?.business_impact_section?.length) {
        this.getDetails.business_impact_section.forEach((business: any, index: number) => {
          businessArray.push(
            this.__fb.group({
              title: [business.title || ''],
              description: [business.description || ''],
            })
          );
        });
      } else {
        this.businessSection();
      }
  
      const enrolArray = this.addEditForm.get('enrol_single_plan_box') as FormArray;;
      enrolArray.clear(); // Clear existing
      if (this.getDetails?.enrol_single_plan_box?.length) {
        this.getDetails.enrol_single_plan_box.forEach((enrol: any, index: number) => {
          enrolArray.push(
            this.__fb.group({
              description: [enrol.description || ''],
            })
          );
        });
      } else {
        this.boxSection();
      }
    }
  
    
  
    //save Data.............
    add(){
      //Validation for Banner Icon section..........
      const exploreArray = this.addEditForm.get('banner_icon_section') as FormArray;
      let hasIconErrors = false;
      exploreArray.controls.forEach((control, index) => {
        const exploreTitle = control.get('title')?.value;
        if (!exploreTitle) {
          hasIconErrors = true;
          this.errorMessage += `Banner Icon section Title ${index + 1}: is required.<br/>`;
        }
        const exploreDescription = control.get('description')?.value;
        if (!exploreDescription) {
          hasIconErrors = true;
          this.errorMessage += `Banner Icon section description ${index + 1}: is required.<br/>`;
        }
        const exploreImage = control.get('image')?.value;
        if (!exploreImage) {
          hasIconErrors = true;
          this.errorMessage += `Banner Icon section ${index + 1}: Image is required.\n`;
        }
      });
      if (hasIconErrors) {
        this.__shared.toastError(this.errorMessage);
        return;
      }
  
       //Validation for Banner Bottom section..........
       const bannerBottomArray = this.addEditForm.get('banner_bottom_section') as FormArray;
       let hasBannerBottomErrors = false;
       bannerBottomArray.controls.forEach((control, index) => {
         const bottomTitle = control.get('title')?.value;
         if (!bottomTitle) {
           hasBannerBottomErrors = true;
           this.errorMessage += `Banner bottom section Title ${index + 1}: is required.<br/>`;
         }
         const bottomDescription = control.get('description')?.value;
         if (!bottomDescription) {
           hasBannerBottomErrors = true;
           this.errorMessage += `Banner bottom section description ${index + 1}: is required.<br/>`;
         }
       });
       if (hasBannerBottomErrors) {
         this.__shared.toastError(this.errorMessage);
         return;
       }
  
       //Validation for Baner media..........
      if(this.mediaType === 'image'){
        if (!this.imagePreview) {
          this.__shared.toastError('Please upload ' + this.mediaType);
          return;
        }
      }
      if(this.mediaType === 'video'){
        if (!this.videoPreview) {
          this.__shared.toastError('Please upload ' + this.mediaType);
          return;
        }
      }
  
      //Validation for Baner bottom media..........
      if (!this.bottomImagePreview) {
        this.__shared.toastError('Please upload banner bottom image!');
        return;
      }
  
       //Validation for Banner Slide section..........
      const slideArray = this.addEditForm.get('banner_slide_data') as FormArray;
       let hasSlideErrors = false;
       slideArray.controls.forEach((control, index) => {
         const slideTitle = control.get('title')?.value;
         if (!slideTitle) {
           hasSlideErrors = true;
           this.errorMessage += `Banner slide section Title ${index + 1}: is required.<br/>`;
         }
        
         const slideIcon = control.get('icon')?.value;
         if (!slideIcon) {
           hasSlideErrors = true;
           this.errorMessage += `Banner slide section ${index + 1}: Icon is required.\n`;
         }
       });
       if (hasSlideErrors) {
         this.__shared.toastError(this.errorMessage);
         return;
       }
  
      //Validation for program overview media..........
      if(this.overViewType === 'image'){
        if (!this.imagePreview1) {
          this.__shared.toastError('Please upload ' + this.overViewType);
          return;
        }
      }
      if(this.overViewType === 'video'){
        if (!this.videoPreview1) {
          this.__shared.toastError('Please upload ' + this.overViewType);
          return;
        }
      }
  
      //Validation for tag section..........
      const tagArray = this.addEditForm.get('address_to_taglist') as FormArray;
       let hasTagErrors = false;
       tagArray.controls.forEach((control, index) => {
         const tagTitle = control.get('title')?.value;
         if (!tagTitle) {
           hasTagErrors = true;
           this.errorMessage += `Tag section Title ${index + 1}: is required.<br/>`;
         }
       });
       if (hasTagErrors) {
         this.__shared.toastError(this.errorMessage);
         return;
       }
  
  
      //Validation for program overview media..........
      if(this.addressType === 'image'){
        if (!this.imagePreview2) {
          this.__shared.toastError('Please upload ' + this.addressType);
          return;
        }
      }
      if(this.addressType === 'video'){
        if (!this.videoPreview2) {
          this.__shared.toastError('Please upload ' + this.addressType);
          return;
        }
      }
  
      //Validation for Banner Bottom section..........
      const areaArray = this.addEditForm.get('hospitality_area') as FormArray;
       let hasAreaErrors = false;
       areaArray.controls.forEach((control, index) => {
         const areaTitle = control.get('title')?.value;
         if (!areaTitle) {
           hasAreaErrors = true;
           this.errorMessage += `Hospitality area section Title ${index + 1}: is required.<br/>`;
         }
         const areaDescription = control.get('description')?.value;
         if (!areaDescription) {
           hasAreaErrors = true;
           this.errorMessage += `Hospitality area section description ${index + 1}: is required.<br/>`;
         }
       });
       if (hasAreaErrors) {
         this.__shared.toastError(this.errorMessage);
         return;
       }
  
      //Validation for External Consultants List section..........
      const externalArray = this.addEditForm.get('external_consultants_list') as FormArray;
       let hasExternalErrors = false;
       externalArray.controls.forEach((control, index) => {
         const externalTitle = control.get('title')?.value;
         if (!externalTitle) {
           hasExternalErrors = true;
           this.errorMessage += `External section Title ${index + 1}: is required.<br/>`;
         }
       });
       if (hasExternalErrors) {
         this.__shared.toastError(this.errorMessage);
         return;
       }
  
      //Validation for Meet author media..........
      if (!this.authorMediaPreview) {
        this.__shared.toastError('Please upload meet author media!');
        return;
      }
  
      //Validation for subtitle media preview..........
      if (!this.authorSubtitleMediaPreview) {
        this.__shared.toastError('Please upload meet author subtitle media!');
        return;
      }
  
      //Validation for media author section..........
      const logoArray = this.addEditForm.get('meet_author_logo') as FormArray;
       let hasLogoErrors = false;
       logoArray.controls.forEach((control, index) => {
         const logo = control.get('image')?.value;
         if (!logo) {
           hasLogoErrors = true;
           this.errorMessage += `Media author section ${index + 1}: logo is required.\n`;
         }
       });
       if (hasLogoErrors) {
         this.__shared.toastError(this.errorMessage);
         return;
       }
  
      //Validation for Meet Author Bottom Section..........
      const bottomArray = this.addEditForm.get('mett_author_bottom_section') as FormArray;
      let hasBottomErrors = false;
      bottomArray.controls.forEach((control, index) => {
        const meetBottomTitle = control.get('title')?.value;
        if (!meetBottomTitle) {
          hasBottomErrors = true;
          this.errorMessage += `Meet Author Bottom Section Title ${index + 1}: is required.<br/>`;
        }
        const meetBottomDescription = control.get('description')?.value;
        if (!meetBottomDescription) {
          hasBottomErrors = true;
          this.errorMessage += `Meet Author Bottom Section description ${index + 1}: is required.<br/>`;
        }
        const meetBottomImage = control.get('image')?.value;
        if (!meetBottomImage) {
          hasBottomErrors = true;
          this.errorMessage += `Meet Author Bottom Section ${index + 1}: Image is required.\n`;
        }
      });
      if (hasBottomErrors) {
        this.__shared.toastError(this.errorMessage);
        return;
      }
  
      //Validation for syllabus title icon preview..........
      if (!this.syllabusIconPreview) {
        this.__shared.toastError('Please upload syllabus title icon!');
        return;
      }
  
      //Validation for Syllabus Title Subtitle Section...........
      const syllabusTitleArray = this.addEditForm.get('syllabus_title_subtitle_section') as FormArray;
        let hasSyllabusTitleErrors = false;
        syllabusTitleArray.controls.forEach((control, index) => {
          const syllabusTitle = control.get('title')?.value;
          if (!syllabusTitle) {
            hasSyllabusTitleErrors = true;
            this.errorMessage += `Syllabus Title Subtitle Section ${index + 1}: is required.<br/>`;
          }
        });
        if (hasSyllabusTitleErrors) {
          this.__shared.toastError(this.errorMessage);
          return;
        }
  
      //Validation for syllabus accordion block Section..........
      const blockArray = this.addEditForm.get('syllabus_accordion_block') as FormArray;
      let hasBlockErrors = false;
      blockArray.controls.forEach((control, index) => {
        const blockTitle = control.get('title')?.value;
        if (!blockTitle) {
          hasBlockErrors = true;
          this.errorMessage += `Syllabus Accordion Block Section Title ${index + 1}: is required.<br/>`;
        }
        const blockTime = control.get('time')?.value;
        if (!blockTime) {
          hasBlockErrors = true;
          this.errorMessage += `Syllabus Accordion Block Section Time ${index + 1}: is required.<br/>`;
        }
        const blockDescription = control.get('description')?.value;
        if (!blockDescription) {
          hasBlockErrors = true;
          this.errorMessage += `Syllabus Accordion Block Section description ${index + 1}: is required.<br/>`;
        }
        const blockImage = control.get('image')?.value;
        if (!blockImage) {
          hasBlockErrors = true;
          this.errorMessage += `Syllabus Accordion Block Section ${index + 1}: Image is required.\n`;
        }
      });
      if (hasBlockErrors) {
        this.__shared.toastError(this.errorMessage);
        return;
      }   
  
      //Validation for Sneak Peek Section..........
      const sneakArray = this.addEditForm.get('sneak_peek_section') as FormArray;
      let hasSneakErrors = false;
      sneakArray.controls.forEach((control, index) => {
        const sneakTitle = control.get('tab_title')?.value;
        if (!sneakTitle) {
          hasSneakErrors = true;
          this.errorMessage += `Sneak Peek Section Title ${index + 1}: is required.<br/>`;
        }
        const sneakSubTitle = control.get('tab_content_title')?.value;
        if (!sneakSubTitle) {
          hasSneakErrors = true;
          this.errorMessage += `Sneak Peek Section Content Title ${index + 1}: is required.<br/>`;
        }
        const sneakDescription = control.get('tab_content_description')?.value;
        if (!sneakDescription) {
          hasSneakErrors = true;
          this.errorMessage += `Sneak Peek Section content description ${index + 1}: is required.<br/>`;
        }
        const sneakVideo = control.get('tab_content_media')?.value;
        if (!sneakVideo) {
          hasSneakErrors = true;
          this.errorMessage += `Sneak Peek Section ${index + 1}: Video is required.\n`;
        }
      });
      if (hasSneakErrors) {
        this.__shared.toastError(this.errorMessage);
        return;
      }
  
      //Validation for Self Study Section..........
      const studyArray = this.addEditForm.get('self_study_section') as FormArray;
      let hasStudyErrors = false;
      studyArray.controls.forEach((control, index) => {
        const studyTitle = control.get('title')?.value;
        if (!studyTitle) {
          hasStudyErrors = true;
          this.errorMessage += `Self Study Section Title ${index + 1}: is required.<br/>`;
        }
        const studyDescription = control.get('description')?.value;
        if (!studyDescription) {
          hasStudyErrors = true;
          this.errorMessage += `Self Study Section content description ${index + 1}: is required.<br/>`;
        }
      });
      if (hasStudyErrors) {
        this.__shared.toastError(this.errorMessage);
        return;
      }
  
     //Validation for Business Impact Section..........
      const businessArray = this.addEditForm.get('business_impact_section') as FormArray;
      let hasBusinessErrors = false;
      businessArray.controls.forEach((control, index) => {
        const businessTitle = control.get('title')?.value;
        if (!businessTitle) {
          hasBusinessErrors = true;
          this.errorMessage += `Business Impact Section Title ${index + 1}: is required.<br/>`;
        }
        const businessDescription = control.get('description')?.value;
        if (!businessDescription) {
          hasBusinessErrors = true;
          this.errorMessage += `Business Impact Section content description ${index + 1}: is required.<br/>`;
        }
      });
      if (hasBusinessErrors) {
        this.__shared.toastError(this.errorMessage);
        return;
      }
  
      //Validation for enrol single plan box Section..........
      const boxArray = this.addEditForm.get('enrol_single_plan_box') as FormArray;
      let hasBoxErrors = false;
      boxArray.controls.forEach((control, index) => {
        const boxDescription = control.get('description')?.value;
        if (!boxDescription) {
          hasBoxErrors = true;
          this.errorMessage += `Enrol single plan box Section description ${index + 1}: is required.<br/>`;
        }
      });
      if (hasBoxErrors) {
        this.__shared.toastError(this.errorMessage);
        return;
      }
  
      //Validation for syllabus title icon preview..........
      if (!this.certificateImagePreview) {
        this.__shared.toastError('Please upload certificate image!');
        return;
      }
  
      const data: any = {...this.addEditForm?.value};
      // Ensure description inside each `hospitality_area` item is a string
      // Ensure `description` is always an array
      data.hospitality_area = data.hospitality_area.map((item: any) => ({
        ...item,
        description: typeof item.description === 'string'
          ? item.description.split(',').map((d:any) => d.trim()) // Convert string to array
          : item.description
      }));
  
      const params: any = {
        course_name: data?.course_name || '',
        sana_course_id: data?.sana_course_id || 'MF73GVZix3Kx',
        course_description: data?.course_description || '',
        banner_icon_section: data?.banner_icon_section || [],
        banner_bottom_section: data?.banner_bottom_section || [],
        banner_type: data?.banner_type || '',
        banner_media: this.selectedFile || this.getDetails.banner_media,
        banner_bottom_section_media:  this.bottomImageUrl || this.getDetails.banner_bottom_section_media ,
        banner_bottom_section_title: data?.banner_bottom_section_title || '',
        banner_bottom_section_description: data?.banner_bottom_section_description || '',
        banner_slide_data: data?.banner_slide_data || [],
        program_overview_title: data?.program_overview_title || '',
        program_overview_type: data?.program_overview_type || '',
        program_overview_media: this.selectedFile1 || this.getDetails.program_overview_media,
        program_overview_description: data?.program_overview_description || '',
        address_to_title: data?.address_to_title || '',
        address_to_description: data?.address_to_description || '',
        address_to_taglist: data?.address_to_taglist || [],
        address_to_type: data?.address_to_type || '',
        address_to_media: this.selectedFile2 || this.getDetails.address_to_media,
        hospitality_title: data?.hospitality_title || '',
        hospitality_area: data?.hospitality_area || [],
        external_consultants_title: data?.external_consultants_title || '',
        external_consultants_description: data?.external_consultants_description || '',
        external_consultants_list: data?.external_consultants_list || [],
        meet_author_title: data?.meet_author_title || '',
        meet_author_title_subtitle: data?.meet_author_title_subtitle || '',
        meet_author_media: this.authorMediaUrl || this.getDetails.meet_author_media,
        meet_author_subtitle_media: this.authorSubtitleMediaUrl || this.getDetails.meet_author_subtitle_media,
        mett_author_description: data?.mett_author_description || '',
        meet_author_logo: data?.meet_author_logo || [],
        meet_author_program_description: data?.meet_author_program_description || '',
        mett_author_bottom_section: data?.mett_author_bottom_section || [],
        syllabus_title_icon: this.syllabusIconUrl || this.getDetails.syllabus_title_icon,
        syllabus_title_subtitle_section: data?.syllabus_title_subtitle_section || [],
        syllabus_accordion_block: data?.syllabus_accordion_block || [],
        sneak_peek_title: data?.sneak_peek_title || '',
        sneak_peek_section: data?.sneak_peek_section || [],
        self_study_title: data?.self_study_title || '',
        self_study_description: data?.self_study_description || '',
        self_study_section: data?.self_study_section || [],
        business_impact_title: data?.business_impact_title || '',
        business_impact_description: data?.business_impact_description || '',
        business_impact_image: this.businessImpactImageUrl || this.getDetails.business_impact_image,
        business_impact_section: data?.business_impact_section || [],
        enrol_title: data?.enrol_title || '',
        enrol_description: data?.enrol_description || '',
        enrol_single_title: data?.enrol_single_title || '',
        enrol_single_duration: data?.enrol_single_duration || '',
        enrol_single_price: data?.enrol_single_price || '',
        enrol_single_discount:data?.enrol_single_discount || '',
        enrol_single_plan_box: data?.enrol_single_plan_box || [],
        certificate_title: data?.certificate_title || '',
        certificate_description: data?.certificate_description || '',
        certificate_image: this.certificateImageUrl || this.getDetails.certificate_image,
        faq_title: data?.faq_title || '',
        
      }
      console.log("params.....",params);
       // Show loader
       this.isLoading = true;
       this.__spinner.show(); // Start visual spinner
       const apiCall = this.detailsId
       ? this.__program1.edit(this.detailsId, params)
       : this.__program1.create(params);
  
       apiCall.subscribe(
         response => {
           this.isLoading = false; // Stop loading spinner
           this.__spinner.hide(); // Hide visual spinner
           if (!response.error) {
               this.displayMessage = this.detailsId
                   ? "Details updated successfully."
                   : "Details added successfully.";
               this.__shared.toastSuccess(this.displayMessage);
               this.__route.navigate(['/exclusive-program/program1-list']);
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
        const reader = new FileReader();
        if(type === 'bannerIcon'){
          reader.onload = () => {
            this.bannerIconPreviews[index] = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else  if(type === 'bottomImage'){
          reader.onload = () => {
            this.bottomImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else if(type === 'slideIcon'){
          reader.onload = () => {
            this.slideIconPreviews[index] = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else  if(type === 'authorMedia'){
          reader.onload = () => {
            this.authorMediaPreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        else  if(type === 'authorSubTitleMedia'){
          reader.onload = () => {
            this.authorSubtitleMediaPreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'logo'){
          reader.onload = () => {
            this.logoPreviews[index] = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'meetBottomImage'){
          reader.onload = () => {
            this.bottomImagePreviews[index] = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'syllabusIcon'){
          reader.onload = () => {
            this.syllabusIconPreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'impactImage'){
          reader.onload = () => {
            this.businessImpactImage = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'certificateImage'){
          reader.onload = () => {
            this.certificateImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'blockImage'){
          reader.onload = () => {
            this.blockImagePreviews[index] = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'blockIcon'){
          reader.onload = () => {
            this.blockIconPreviews[index] = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
        
        // Upload the file and update the form with the actual URL
        this.uploadFile(file, index, type);
      }
    }
  
    //Upload Video..............................................
    onVideoSelected(event: Event, index: number,type: any): void {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
    
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a mp4, webm, ogg video.');
          return;
        }
    
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 80MB limit.');
          return;
        }
        const reader = new FileReader();
        if(type === 'tabContentMedia'){
          reader.onload = () => {
            this.contentPreviews[index] = reader.result as string; // Show preview image
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
            if(type === 'bannerIcon'){
              const exploreMediaArray = this.addEditForm.get('banner_icon_section') as FormArray;
              if (exploreMediaArray && exploreMediaArray.length > index) {
                if(this.detailsId){
                  exploreMediaArray.at(index).patchValue({ image: imageUrl });
                }
                else{
                  exploreMediaArray.at(index).patchValue({ image: imageUrl });
                }
                // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
            }
            else if(type === 'bannerMediaImage'){
              this.selectedFile  = imageUrl
            }
            else if(type === 'bannerMediaVideo'){
              this.selectedFile  = imageUrl
            }
            else if(type === 'bottomImage'){
              this.bottomImageUrl  = imageUrl
            }
            else if(type === 'slideIcon'){
              const slideMediaArray = this.addEditForm.get('banner_slide_data') as FormArray;
              if (slideMediaArray && slideMediaArray.length > index) {
                if(this.detailsId){
                  slideMediaArray.at(index).patchValue({ icon: imageUrl });
                }
                else{
                  slideMediaArray.at(index).patchValue({ icon: imageUrl });
                }
                // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
            }
            else if(type === 'overviewImage'){
              this.selectedFile1  = imageUrl
            }
            else if(type === 'overviewVideo'){
              this.selectedFile1  = imageUrl
            }
            else if(type === 'addressImage'){
              this.selectedFile2  = imageUrl
            }
            else if(type === 'addressVideo'){
              this.selectedFile2  = imageUrl
            }
            else if(type === 'authorMedia'){
              this.authorMediaUrl  = imageUrl
            }
            else if(type === 'authorSubTitleMedia'){
              this.authorSubtitleMediaUrl  = imageUrl
            }
            else if(type === 'logo'){
              const logoArray = this.addEditForm.get('meet_author_logo') as FormArray;
              if (logoArray && logoArray.length > index) {
                if(this.detailsId){
                  logoArray.at(index).patchValue({ image: imageUrl });
                }
                else{
                  logoArray.at(index).patchValue({ image: imageUrl });
                }
                // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
            }
            else if(type === 'meetBottomImage'){
              const meetBottomMediaArray = this.addEditForm.get('mett_author_bottom_section') as FormArray;
              if (meetBottomMediaArray && meetBottomMediaArray.length > index) {
                if(this.detailsId){
                  meetBottomMediaArray.at(index).patchValue({ image: imageUrl });
                }
                else{
                  meetBottomMediaArray.at(index).patchValue({ image: imageUrl });
                }
                // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
            }
            else if(type === 'syllabusIcon'){
              this.syllabusIconUrl  = imageUrl
            }
            else if(type === 'tabContentMedia'){
              const sneakVideoArray = this.addEditForm.get('sneak_peek_section') as FormArray;
              if (sneakVideoArray && sneakVideoArray.length > index) {
                if(this.detailsId){
                  sneakVideoArray.at(index).patchValue({ tab_content_media: imageUrl });
                }
                else{
                  sneakVideoArray.at(index).patchValue({ tab_content_media: imageUrl });
                }
                // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
            }
            else if(type === 'impactImage'){
              this.businessImpactImageUrl= imageUrl
            }
  
            else if(type === 'certificateImage'){
              this.certificateImageUrl= imageUrl
            }
  
            else if(type === 'blockImage'){
              const blockImageArray = this.addEditForm.get('syllabus_accordion_block') as FormArray;
              if (blockImageArray && blockImageArray.length > index) {
                if(this.detailsId){
                  blockImageArray.at(index).patchValue({ image: imageUrl });
                }
                else{
                  blockImageArray.at(index).patchValue({ image: imageUrl });
                }
                // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
            }
            else if(type === 'blockIcon'){
              const blockIconArray = this.addEditForm.get('blockContent') as FormArray;
              if (blockIconArray && blockIconArray.length > index) {
                if(this.detailsId){
                  blockIconArray.at(index).patchValue({ icon: imageUrl });
                }
                else{
                  blockIconArray.at(index).patchValue({ icon: imageUrl });
                }
                // console.log("Updated Form Value:", bannerImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
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
  
    selectOverviewType(event:any){
      this.resetOverViewFileSelection();
      this.overViewType = event?.target?.value;
    }
  
    selectAddressType(event:any){
      this.resetAddressileSelection();
      this.addressType = event?.target?.value;
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
  
    resetOverViewFileSelection(): void {
      // Reset the selected file and preview
      this.selectedFile1 = '';
      this.filename = null;
      this.imagePreview1 = null;
      this.videoPreview1 = null;
      // Optionally, reset the file input element itself (if needed)
      const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
      if (fileInput) {
        fileInput.value = '';  // Clear the file input value
      }
    }
  
    resetAddressileSelection(): void {
      // Reset the selected file and preview
      this.selectedFile2 = '';
      this.filename = null;
      this.imagePreview2 = null;
      this.videoPreview2 = null;
      // Optionally, reset the file input element itself (if needed)
      const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
      if (fileInput) {
        fileInput.value = '';  // Clear the file input value
      }
    }
  
    //Selected image or video
    onMediaSelected(event: Event, type: string): void {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        if(type === 'banner'){
          if (this.mediaType === 'image') {
            this.handleImage(file,type);
          } else if (this.mediaType === 'video') {
            this.handleVideo(file,type);
          }
        }
        else if(type === 'overview'){
          if (this.overViewType === 'image') {
            this.handleImage(file,type);
          } else if (this.overViewType === 'video') {
            this.handleVideo(file,type);
          }
        }
        else if(type === 'address'){
          if (this.addressType === 'image') {
            this.handleImage(file,type);
          } else if (this.addressType === 'video') {
            this.handleVideo(file,type);
          }
        }
      }
    }
  
    handleImage(file: File, type: string): void {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      if(type === 'banner'){
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
        this.uploadFile(file, 0, 'bannerMediaImage');
      }
      else if(type === 'overview'){
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
          this.resetOverViewFileSelection();
          return;
        }
    
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 2MB limit.');
          this.resetOverViewFileSelection();
          return;
        }
    
        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview1 = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, 0, 'overviewImage');
      }
      else if(type === 'address'){
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
          this.resetAddressileSelection();
          return;
        }
    
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 2MB limit.');
          this.resetAddressileSelection();
          return;
        }
    
        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview2 = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, 0, 'addressImage');
      }
    }
  
    handleVideo(file: File, type: String): void {
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if(type === 'banner'){
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
        this.uploadFile(file, 0, 'bannerMediaVideo');
      }
      else if(type === 'overview'){
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
          this.resetOverViewFileSelection();
          return;
        }
    
        const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 80MB limit.');
          this.resetOverViewFileSelection();
          return;
        }
    
        // Preview the video
        const reader = new FileReader();
        reader.onload = () => {
          this.videoPreview1 = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, 0, 'overviewVideo');
      }
      else if(type === 'address'){
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
          this.resetAddressileSelection();
          return;
        }
    
        const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 80MB limit.');
          this.resetAddressileSelection();
          return;
        }
        // Preview the video
        const reader = new FileReader();
        reader.onload = () => {
          this.videoPreview2 = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadFile(file, 0, 'addressVideo');
      }
    }
  
    allowOnlyPositiveNumbers(event: KeyboardEvent): void {
      const charCode = event.key;
      
      // Prevent "-" or any non-numeric characters except for allowed keys (e.g., Backspace, Tab).
      if (charCode === '-' || isNaN(Number(charCode))) {
        event.preventDefault();
      }
    }
  
    preventNegativeValues(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      if (parseFloat(inputElement.value) < 0) {
        inputElement.value = '0'; // Reset to 0 if negative
      }
    }

}
