import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListService } from '../../../services/master-list/list.service';
import { Subscription } from 'rxjs';
import { CourseService } from '../../../services/category-course/course.service';
import { DatePipe } from '@angular/common';
import { EditorService } from '../../../../app/services/editor/editor.service';
import { get } from 'http';

interface Icon {
  label: string;
  url: string;
}

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss'],
  providers: [DatePipe] // Add DatePipe here
})
export class AddEditProductComponent implements OnInit, OnDestroy {
  timeSubscription!: Subscription;
  goalSubscription!: Subscription;
  topicSubscription!: Subscription;
  categorySubscription!: Subscription;
  teacherSubscription!: Subscription;
  typeubscription!: Subscription;
  interestSubscription!: Subscription;
  industrySubscription!: Subscription;
  addEditForm:any
  displayMessage : string = '';
  errorMessage : string = '';
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  selectedFile: File | null = null;
  mediaType:string = '';
  detailsId:string | null = null;
  getDetails:any;
  loaded_data : boolean = false;
  topicList: any;
  courseList: any;
  timeList: any;
  goalList:any;
  categoryList: any;
  teacherList: any;
  interestList: any;
  industryList: any;
  typeList: any;
  isLoading = false;
  getImageUrl: string = '';
  addressImagePreview: string | null = null;
  impactImagePreview: string | null = null;
  selectedFile1: File | null = null;
  selectedFile2: File | null = null;
  selectedFile3: File | null = null;
  getImageUrl1: string = '';
  getImageUrl2: string = '';
  getImageUrl3: string = '';
  syllabus!: FormArray;
  whytakecourse!: FormArray;
  course_impact_testinomial!: FormArray;
  course_tag!: FormArray;
  form: any;
  syllabusImagePreviews: any = [];
  selectedTopics: any = [];
  dropdownSettings_industry: any = {};
  dropdownSettings_goal: any = {};
  dropdownSettings_topic: any = {};
  dropdownSettings_course: any = {};
  dropdownSettings_category: any = {};
  dropdownSettings_teacher: any = {};
  dropdownSettings_interest: any = {};
  subscriptions: Subscription[] = [];
  selectedCategories:any = [];
  selectedGoals: any = [];
  selectedIndustries: any = [];
  selectedInterests: any = [];
  selectedTeachers: any = [];
  selectednextCourse: any = [];
  getCourseList:any =[];
  editorConfig: any;
  takeCourseImagePreviews:any = [];
  
 
  iconList: Icon[] = [
    { label: 'Icon 1', url: 'https://kordie.com/assets/images/accro-list-icon-01.svg' },
    { label: 'Icon 2', url: 'https://kordie.com/assets/images/accro-list-icon-02.svg' },
    { label: 'Icon 3', url: 'https://kordie.com/assets/images/accro-list-icon-03.svg' }
  ];
  

  constructor(
    private _product: ProductService,
    private __fb: FormBuilder,
    private _category: CourseService,
    private _serv: ListService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private datePipe: DatePipe,
    private editorSettings: EditorService,
    private elementRef: ElementRef
  ) { 
    // Start loader immediately
    this.isLoading = true;
    this.__spinner.show();

    // setTimeout(() => {
    //   // Hide loader after some time (e.g., 2 seconds)
    //   this.isLoading = false;
    //   this.__spinner.hide();
    // }, 2000);
    
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {}
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.getData();
    this.getSanaCourse();
    this.editorConfig = this.editorSettings.editorConfig();
  }

 

  ngOnDestroy(): void {
    // this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  //Initalize Form......
    createForm()
    {
      this.addEditForm = this.__fb.group({
        course_name:['',[Validators.required]],
        sana_course_id: [''],
        course_intro: ['',[Validators.required]],
        course_description: ['',[Validators.required]],
        course_topic: [[], [Validators.required]],
        course_time: ['',[Validators.required]],
        course_goal: [[],[Validators.required]],
        course_category: [[],[Validators.required]],
        course_teacher: [[],[Validators.required]],
        course_type: ['',[Validators.required]],
        course_image: [''],
        course_price: ['',[Validators.required]],
        course_price_text: ['',[Validators.required]],
        course_certificate: ['',[Validators.required]],
        // course_link_text: ['',[Validators.required]],
        // course_link_membership_text: ['',[Validators.required]],
        learn_title: ['',[Validators.required]],
        learn_description: ['',[Validators.required]],
        //learn_subtitle: ['',[Validators.required]],
        learn_outcomes: [[], [Validators.required]],
        address_title: ['',[Validators.required]],
        address_description: ['',[Validators.required]],
        address_image: [''],
        //syllabus_title: ['',[Validators.required]],
        syllabus: this.__fb.array([this.createSyllabusItem()]), // FormArray for syllabus items
        whytakecourse: this.__fb.array([]), // FormArray for syllabus items
        curator_title: ['',[Validators.required]],
        kordie_title: ['',[Validators.required]],
        // plan_title: ['',[Validators.required]],
        // plan_subtitle: ['',[Validators.required]],
        // plan_description:  ['',[Validators.required]],   for now plan will inctive
        plan_duration: [0,[Validators.required]],
        course_impact_title: ['',[Validators.required]],
        course_impact_image: [''],
        course_impact_summary: [[],[Validators.required]],
        course_impact_testinomial_heading: ['',[Validators.required]],
        course_impact_testinomial: this.__fb.array([this.createtestimonialsItem()]),
        course_tag: this.__fb.array([]),
        course_next_title: ['',[Validators.required]],
        //course_next_subtitle: ['',[Validators.required]],
        course_next_id: [[]],
        //faq_title: ['',[Validators.required]],
        course_interest: [[],[Validators.required]],
        course_industry: [[],[Validators.required]],
        last_updated_date: [''],
        skill_track: ['']
      });
      this.syllabus = this.addEditForm.get('syllabus') as FormArray;
      this.whytakecourse = this.addEditForm.get('whytakecourse') as FormArray;
      this.ensureCourse();
      this.course_impact_testinomial = this.addEditForm.get('course_impact_testinomial') as FormArray;
      this.course_tag = this.addEditForm.get('course_tag') as FormArray;
      this.ensureCourseTag();
    }

    get syllabusControls() {
      return (this.addEditForm.get('syllabus') as FormArray).controls;
    }
    get testimonialsControls() {
      return (this.addEditForm.get('course_impact_testinomial') as FormArray).controls;
    }

    get whytakecourseControls(){
      return (this.addEditForm.get('whytakecourse') as FormArray).controls;
    }

    get course_tagControls(){
      return (this.addEditForm.get('course_tag')as FormArray).controls;
    }
    

    addSyllabusItem() {
      if(!this.detailsId){
        const syllabusItem = this.__fb.group({
          title: ['', [Validators.required]],
          images: [''],
          time: ['', [Validators.required]],
          description: ['', [Validators.required]],
          chapter1: [''],
          chapter2: [''],
          chapter3: [''],
          chapter4: [''],
          icon1: [this.iconList[0]?.url || ''],
          icon2: [this.iconList[0]?.url || ''],
          icon3: [this.iconList[0]?.url || ''],
          icon4: [this.iconList[0]?.url || ''],
          // chapter: [[]]
        });
    
        this.syllabus.push(syllabusItem);
      }
      else{
        const syllabusItem = this.__fb.group({
          title: ['', [Validators.required]],
          image: [''],
          time: ['', [Validators.required]],
          description: ['', [Validators.required]],
          chapter1: [''],
          chapter2: [''],
          chapter3: [''],
          chapter4: [''],
          icon1: [this.iconList[0]?.url || ''],
          icon2: [this.iconList[0]?.url || ''],
          icon3: [this.iconList[0]?.url || ''],
          icon4: [this.iconList[0]?.url || ''],
          // chapter: [[]]
        });
    
        this.syllabus.push(syllabusItem);
      }
    }

    addTestimonialsItem() {
      const testimoinialsItem = this.__fb.group({
        date: ['', [Validators.required]],
        name: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        feedback: ['', [Validators.required]],
      });
  
      this.course_impact_testinomial.push(testimoinialsItem);
    }

    addCourseItem(){
      this.whytakecourse.push(this.createCourseItem())
    }

    addCourseTag(){
      this.course_tag.push(this.createTagItem());
      this.course_tag.push(this.createTagItem())
    }

    createCourseItem(){
      return this.__fb.group({
        title: [''],
        image: [''],
        description: ['']
      })
    }

    // Create a new syllabus item form group
    createSyllabusItem() {
      return this.__fb.group({
        title: ['', [Validators.required]],
        images: [''],
        time: ['', [Validators.required]],
        description: ['', [Validators.required]],
        chapter1: [''],
        chapter2: [''],
        chapter3: [''],
        chapter4: [''],
        icon1: [this.iconList[0]?.url || ''],
        icon2: [this.iconList[0]?.url || ''],
        icon3: [this.iconList[0]?.url || ''],
        icon4: [this.iconList[0]?.url || ''],
        // chapter: [[]]
      });
    }

    // Create a new syllabus item form group
    createtestimonialsItem() {
      return this.__fb.group({
        date: ['', [Validators.required]],
        name: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        feedback: ['', [Validators.required]],
      });
    }

    //Create Tag....
    createTagItem (){
      return this.__fb.group({
        tag: [''],
        color: ['#000000'],
        text_color: ['']
      })
    }
  
    //Remove Syllabus Section
    removeSyllabusItem(index: number) {
      this.syllabus.removeAt(index);
    }

    //Remove Testimonials Section
    removetestimonialsItem(index: number) {
      this.course_impact_testinomial.removeAt(index);
    }

    removecourseItem(index: number){
      this.whytakecourse.removeAt(index);
      this.ensureCourse();
    }

    private ensureCourse(): void {
      if (this.whytakecourse.length === 0) {
        this.addCourseItem();
      }
    }

    private ensureCourseTag() {
      if (this.course_tag.length === 0) {
        this.addCourseTag();
      }
    }
    

    getData(){
      this.getTopic();
      // this.getTime();
      // this.getGoal();
      // this.getCategory();
      // this.getTeacher();
      // this.getCourseType();
      // this.getIndustry();
      // this.getInterest();
      // this.getCourse();

      // if(this.detailsId){
      //   this.getDetail();
      // }

      this.dropdownSettings_industry = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true // Enable search
      };

      this.dropdownSettings_interest = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true // Enable search
      };

      this.dropdownSettings_teacher = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true // Enable search
      };

      this.dropdownSettings_category = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true // Enable search
      };

      this.dropdownSettings_goal = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true // Enable search
      };

      this.dropdownSettings_topic = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true // Enable search
      };

      this.dropdownSettings_course = {
        singleSelection: false, // Allow multiple selection
        idField: '_id', // Unique identifier for options
        textField: 'course_name', // Display field
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3, // Limit the number of selected items shown
        allowSearchFilter: true, // Enable search
        disabledField: 'isDisabled', // Add this line to enable disabling
      };
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


  processLearnTitle(): void {
    const learnOutcomes = this.addEditForm.get('learn_outcomes')?.value;
  
    if (learnOutcomes) {
      // Split by commas, trim each entry, and filter out empty values
      const outcomesArray = learnOutcomes
        .split('|')
        .map((outcome: string) => outcome.trim())
        .filter((outcome: string) => outcome)
        .join(' | ');
        // console.log("outcomesArray====",outcomesArray);
        
  
      // Update the form control with the processed array
      this.addEditForm.patchValue({ learn_outcomes: outcomesArray });
  
      console.log('Processed Learn Outcomes:', outcomesArray);
    }
  }

  
  processLearnTitle1(): void {
    const learnOutcomes = this.addEditForm.get('course_impact_summary')?.value;
  
    if (learnOutcomes) {
      const cleanedString = learnOutcomes
        .split('|')
        .map((outcome: string) => outcome.trim())
        .filter((outcome: string) => outcome)
        .join(' | '); // keep it as a string, but cleaned
  
      this.addEditForm.patchValue({ course_impact_summary: cleanedString });
  
      console.log('Cleaned Learn Outcomes (String):', cleanedString);
    }
  }
  

  validateSyllabusImages(): boolean {
    const syllabusFormArray = this.addEditForm.get('syllabus') as FormArray;
    // console.log("syllabusFormArray....",syllabusFormArray);
    
    // Check if syllabus exists and has at least one entry
    if (syllabusFormArray && syllabusFormArray.length > 0) {
      for (let i = 0; i < syllabusFormArray.length; i++) {
        const syllabusItem = syllabusFormArray.at(i)?.value;
        // console.log("syllabusItem=====",syllabusItem);
        // console.log("syllabusItem-image=====",syllabusItem.image);
        // If image is not set, return false
        if(this.detailsId){
          // if (!syllabusItem.image || syllabusItem.image.trim() === '' ) {
          if (!syllabusItem.image || syllabusItem.image.trim() === '') {
            this.__shared.toastError(`Please upload an image for syllabus item ${i + 1}.`);
            return false;
          }
        }
        else{
          if (!syllabusItem.images || syllabusItem.images.trim() === '') {
          // if (!this.syllabusImagePreviews[i]) {
            this.__shared.toastError(`Please upload an image for syllabus item ${i + 1}.`);
            return false;
          }
        }
      }
    } else {
      this.__shared.toastError('Syllabus cannot be empty.');
      return false;
    }
  
    // All syllabus items have images
    return true;
  }
  

  add(){
    const data: any = this.addEditForm?.value;
    // console.log("data....",data);
    // return;
    if (data?.syllabus) {
      data.syllabus = data.syllabus.map((item: any) => {
        // If chapter is empty, clear related icon
        if (!item.chapter1?.trim()) {
          item.icon1 = '';
        }
        if (!item.chapter2?.trim()) {
          item.icon2 = '';
        }
        if (!item.chapter3?.trim()) {
          item.icon3 = '';
        }
        if (!item.chapter4?.trim()) {
          item.icon4 = '';
        }
    
        return {
          ...item,
        };
      });
    
      if (!this.detailsId) {
        data.syllabus = data.syllabus.map((item: any) => {
          const { images, ...rest } = item;
          return {
            ...rest,
            image: images,
          };
        });
      }
    }
    

   //Validation.................................
   if(!data?.course_name){
    this.__shared.toastError("Please enter course name");
    return;
   }
   if(!data?.course_intro){
    this.__shared.toastError("Please enter course intro");
    return;
   }
   if(!data?.course_description){
    this.__shared.toastError("Please enter course description");
    return;
   }
   if(data?.course_topic?.length === 0){
    this.__shared.toastError("Please enter course topic.");
    return;
   }
   if(!data?.course_time){
    this.__shared.toastError("Please select course time");
    return;
   }
   if(data?.course_goal?.length === 0){
    this.__shared.toastError("Please select course goal");
    return;
   }
   if(data?.course_category?.length === 0){
    this.__shared.toastError("Please select course category");
    return;
   }
   if(data?.course_teacher?.length === 0){
    this.__shared.toastError("Please select course teacher");
    return;
   }
   if(!data?.course_type){
    this.__shared.toastError("Please select course type");
    return;
   }

   if(!data?.course_price){
    this.__shared.toastError("Please select course price");
    return;
   }
   if(!data?.course_price_text){
    this.__shared.toastError("Please enter price text");
    return;
   }
   if(!data?.course_certificate){
    this.__shared.toastError("Please enter course certificate");
    return;
   }
   if(!data?.learn_title){
    this.__shared.toastError("Please enter learn title");
    return;
   }
   if(!data?.learn_description){
    this.__shared.toastError("Please enter learn description");
    return;
   }
   if(!data?.learn_outcomes){
    this.__shared.toastError("Please enter learn outcomes");
    return;
   }
   if(!data?.address_title){
    this.__shared.toastError("Please enter address title");
    return;
   }
   if(!data?.address_description){
    this.__shared.toastError("Please enter address description");
    return;
   }
   if(!data?.curator_title){
    this.__shared.toastError("Please enter curator title");
    return;
   }
   if(!data?.kordie_title){
    this.__shared.toastError("Please enter kordie title");
    return;
   }
   if(!data?.plan_duration){
    this.__shared.toastError("Please enter plan duration");
    return;
   }
   if(!data?.course_impact_title){
    this.__shared.toastError("Please enter course impact title");
    return;
   }
   if(!data?.course_impact_summary){
    this.__shared.toastError("Please enter course impact summary");
    return;
   }
   if(!data?.course_impact_testinomial_heading){
    this.__shared.toastError("Please enter course impact testinomial heading");
    return;
   }
   if(!data?.course_next_title){
    this.__shared.toastError("Please enter course next title");
    return;
   }
   if(data?.course_next_id?.length === 0){
    this.__shared.toastError("Please select next course");
    return;
   }
   if(data?.course_interest?.length === 0){
    this.__shared.toastError("Please select course interest");
    return;
   }
   if(data?.course_industry?.length === 0){
    this.__shared.toastError("Please select course industry");
    return;
   }

   if (!this.validateSyllabusImages()) {
    return; // Stop submission if validation fails
  }

    //Validation for Course.........
    const nextServiceArray = this.addEditForm.get('whytakecourse') as FormArray;
    let hasNextErrors = false;
    nextServiceArray.controls.forEach((control, index) => {
      const nextTitle = control.get('title')?.value;
      if (!nextTitle) {
        hasNextErrors = true;
        this.errorMessage += `Kordie title section Title ${index + 1}: is required.<br/>`;
      }
      const nextDescription = control.get('description')?.value;
      if (!nextDescription) {
        hasNextErrors = true;
        this.errorMessage += `Kordie title section description ${index + 1}: is required.<br/>`;
      }
      const nextImage = control.get('image')?.value;
      // if(this.detailsId){
        if(!nextImage){
          hasNextErrors = true;
          this.errorMessage += `Kordie title section ${index + 1}: Image is required.\n`;
        }
      // }
      // else{
      //   if(!this.takeCourseImagePreviews[index]){
      //     hasNextErrors = true;
      //     this.errorMessage += `Kordie title section ${index + 1}: Image is required.\n`;
      //   }
      // }
    });
    if (hasNextErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }

    // console.log("data......",data);
    
    // return;
    // // Log blank fields
    //     const blankFields: string[] = [];
    //     Object.keys(this.addEditForm.controls).forEach((key) => {
    //         if (!data[key]) {
    //             blankFields.push(key);
    //         }
    //     });
    //     if (blankFields.length > 0) {
    //         console.log('The following fields are blank:', blankFields);
    //     }
    // console.log("data=====",data);
    // console.log();
    
    if(!this.imagePreview){
      this.__shared.toastError('Please upload course image!');
      return;
    }
    if(!this.addressImagePreview){
      this.__shared.toastError('Please upload address image!');
      return;
    }
    if(!this.impactImagePreview){
      this.__shared.toastError('Please upload course impact image!');
      return;
    }


    //Validation For Course Tag
    // const courseTagArray = this.addEditForm.get('course_tag') as FormArray;
    // let hasTagErrors = false;
    // courseTagArray.controls.forEach((control, index) => {
    //   const tagData = control.get('tag')?.value;
    //   if (!tagData) {
    //     hasTagErrors = true;
    //     this.errorMessage += `Tag ${index + 1} is required.<br/>`;
    //   }
    //   const colorData = control.get('color')?.value;
    //   if (!colorData) {
    //     hasTagErrors = true;
    //     this.errorMessage += `Color ${index + 1} is required.<br/>`;
    //   }
    //   const textColorData = control.get('text_color')?.value;
    //   if (!textColorData) {
    //     hasTagErrors = true;
    //     this.errorMessage += `Text color ${index + 1} is required.\n`;
    //   }
    // });
    // if (hasTagErrors) {
    //   this.__shared.toastError(this.errorMessage);
    //   return;
    // }

    const courseTagArray = this.addEditForm.get('course_tag') as FormArray;
    this.errorMessage = ''; // Reset error message
    let hasTagErrors = false;

    // Validate only the first item (index 0)
    const firstControl = courseTagArray.at(0);

    if (firstControl) {
      const tagData = firstControl.get('tag')?.value;
      if (!tagData) {
        hasTagErrors = true;
        this.errorMessage += `Tag 1 is required.<br/>`;
      }

      const colorData = firstControl.get('color')?.value;
      if (!colorData) {
        hasTagErrors = true;
        this.errorMessage += `Color 1 is required.<br/>`;
      }

      const textColorData = firstControl.get('text_color')?.value;
      if (!textColorData) {
        hasTagErrors = true;
        this.errorMessage += `Text color 1 is required.<br/>`;
      }
    }

    if (hasTagErrors) {
      this.__shared.toastError(this.errorMessage);
      return;
    }
    const summaryValue = this.addEditForm.value.course_impact_summary;
    const courseImpactSummaryArray = summaryValue
      ? summaryValue.split('|').map((val: string) => val.trim()).filter(Boolean)
      : [];

    const params: any = {
      'course_name': data?.course_name ? data?.course_name : '',
      'sana_course_id': data?.sana_course_id ? data?.sana_course_id : '',
      'course_intro':  data?.course_intro ? data?.course_intro : '',
      'course_description': data?.course_description ? data?.course_description : '',
      'course_topic': data?.course_topic ? data?.course_topic : [],
      'course_time': data?.course_time ? data?.course_time : '',
      'course_goal': data?.course_goal ? data?.course_goal : [],
      'course_category': data?.course_category ? data?.course_category : [],
      'course_teacher': data?.course_teacher ? data?.course_teacher : [],
      'course_type': data?.course_type ? data?.course_type : '',
      'course_image': this.getImageUrl ? this.getImageUrl : this.getDetails.course_image,
      'course_price': data?.course_price ? data?.course_price : '',
      'course_price_text': data?.course_price_text ? data?.course_price_text : '',
      'course_certificate': data?.course_certificate ? data?.course_certificate : '',
      // 'course_link_text': data?.course_link_text ? data?.course_link_text : '',
      // 'course_link_membership_text': data?.course_link_membership_text ? data?.course_link_membership_text : '',
      'learn_title': data?.learn_title ? data?.learn_title : '',
      'learn_description': data?.learn_description ? data?.learn_description : '',
      'learn_subtitle': data?.learn_subtitle ? data?.learn_subtitle : '',
      // 'learn_outcomes': data?.learn_outcomes ? data?.learn_outcomes : [],
      'learn_outcomes': Array.isArray(this.addEditForm.value.learn_outcomes)
          ? this.addEditForm.value.learn_outcomes
          : this.addEditForm.value.learn_outcomes
          ? this.addEditForm.value.learn_outcomes.split('|').map((outcome: string) => outcome.trim())
          : [],
      'address_title': data?.address_title ? data?.address_title : '',
      'address_description': data?.address_description ? data?.address_description : '',
      'address_image': this.getImageUrl1 ? this.getImageUrl1 : this.getDetails.address_image ,
      'syllabus_title': data?.syllabus_title ? data?.syllabus_title : '',
      'curator_title': data?.curator_title ? data?.curator_title : '',
      'kordie_title': data?.kordie_title ? data?.kordie_title : '',
      'plan_title': data?.plan_title ? data?.plan_title : '',
      'plan_subtitle': data?.plan_subtitle ? data?.plan_subtitle : '',
      'plan_description': data?.plan_description ? data?.plan_description : '',
      'plan_duration': data?.plan_duration ? data?.plan_duration : '',
      'course_impact_title': data?.course_impact_title ? data?.course_impact_title : '',
      'course_impact_image': this.getImageUrl2 ? this.getImageUrl2 : this.getDetails.course_impact_image,
      // 'course_impact_summary': data?.course_impact_summary ? data?.course_impact_summary : '',
      // 'course_impact_summary': courseImpactSummaryArray,
      'course_impact_summary': Array.isArray(this.addEditForm.value.course_impact_summary)
          ? this.addEditForm.value.course_impact_summary
          : this.addEditForm.value.course_impact_summary
          ? this.addEditForm.value.course_impact_summary.split('|').map((outcome: string) => outcome.trim())
          : [],
      'course_impact_testinomial_heading': data?.course_impact_testinomial_heading ? data?.course_impact_testinomial_heading : '',
      'course_next_title': data?.course_next_title ? data?.course_next_title : '',
      'course_next_subtitle': data?.course_next_subtitle ? data?.course_next_subtitle : '',
      'course_next_id': data?.course_next_id ? data?.course_next_id : [],
      'faq_title': data?.faq_title ? data?.faq_title : '',
      'course_interest': data?.course_interest ? data?.course_interest : [],
      'course_industry': data?.course_industry ? data?.course_industry : [],
      'syllabus': data?.syllabus,
      'whytakecourse': data?.whytakecourse || [],
      'course_impact_testinomial': data?.course_impact_testinomial,
      'course_tag': data?.course_tag || [],
      'last_updated_date': data?.last_updated_date ? data?.last_updated_date : '',
      'skill_track': data?.skill_track ? data?.skill_track : '',
    };

    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    const apiCall = this.detailsId
    ? this._product.edit(this.detailsId, params)
    : this._product.create(params);

    apiCall.subscribe(
        response => {
          this.isLoading = false; // Stop loading spinner
          this.__spinner.hide(); // Hide visual spinner
          if (!response.error) {
              this.displayMessage = this.detailsId
                  ? "Details updated successfully."
                  : "Details added successfully.";
              this.__shared.toastSuccess(this.displayMessage);
              this.__route.navigate(['/course/course-list']);
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
    // console.log("params======",params)
  }

  //For topic details.......
  getTopic(){
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    const params = {
      active: true
    }
    this.loaded_data = false;
    this._serv.tpicList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.topicList = response?.data?.items;
        this.getTime();
        // console.log("topicList.....",this.topicList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  //For next course details.......
  getCourse(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this._product.getList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.courseList = response?.data?.items;
        this.getInterest();
        // console.log("courseList.....",this.courseList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  //For time details.......
  getTime(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this._serv.timeList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.timeList = response?.data?.items;
        this.getGoal();
        // console.log("timeList.....",this.topicList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  //For time details.......
  getGoal(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this.goalSubscription = this._serv.goalList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.goalList = response?.data?.items;
        this.getCategory();
        // console.log("goalList.....",this.goalList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

 
  //For category details.......
  getCategory(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this._category.getList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.categoryList = response?.data?.category;
        this.getTeacher();
        // console.log("data....",response?.data);
        
        // console.log("teacherList.....",this.teacherList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  //For teacher details.......
  getTeacher(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this._serv.taughtList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.teacherList = response?.data?.items;
        this.getCourseType();
        // console.log("teacherList.....",this.teacherList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  //For interest details.......
  getInterest(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this._serv.interestList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.interestList = response?.data?.items;
        this.getIndustry();
        // console.log("teacherList.....",this.interestList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  //For indusry details.......
  getIndustry(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this._serv.industryList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.industryList = response?.data?.items;
        if(this.detailsId){
          this.getDetail();
        }
        // console.log("teacherList.....",this.industryList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  //For course type details.......
  getCourseType(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this._serv.typeList(params)
    .subscribe((response)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      if(response.error == false)
      {
        this.typeList = response?.data?.items;
        this.getCourse();
        // console.log("typeList.....",this.typeList);
        this.loaded_data = true;
      }
    },
    (err)=>{
      // this.isLoading = false;
      // this.__spinner.hide(); // Start visual spinner
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
    })
  }

  onImageSelect(event: Event, index: number,type: any): void{
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

      if(type === 'courseImage'){
        reader.onload = () => {
          if (!this.takeCourseImagePreviews) {
            this.takeCourseImagePreviews = [];
          }
          this.takeCourseImagePreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }
      // Upload the file and update the form with the actual URL
      this.uploadedFile(file, index, type);
    }
  }

  uploadedFile(file: File, index: number, type:any): void{
    const formData = new FormData();
    formData.append('media', file);
    this.isLoading = true;
      this._product.upload(formData).subscribe(
        (response) => {
          this.isLoading = false;
          if (!response.error) {
            const imageUrl = response?.data?.mediaUrl?.fileUrl;
            if(type === 'courseImage'){
              const courseImageArray = this.addEditForm.get('whytakecourse') as FormArray;
              if (courseImageArray && courseImageArray.length > index) {
                if(this.detailsId){
                  courseImageArray.at(index).patchValue({ image: imageUrl });
                }
                else{
                  courseImageArray.at(index).patchValue({ image: imageUrl });
                }
                // console.log("Updated Form Value:", courseImageArray.at(index)?.value);
              } else {
                console.error(`FormArray is invalid or index ${index} is out of range.`);
              }
            }
            else {
              this.isLoading = false;
              this.__shared.toastError(response.message || 'Upload failed.');
            }
          }
        },
        (error) => {
          this.isLoading = false;
          this.__shared.toastError('An error occurred while uploading the file.');
          console.error("Upload Error:", error);
        });
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
  
    if (file) {
      // Allowed file types
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
  
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
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
        this.imagePreview = reader.result as string; // Show preview image
      };
      reader.readAsDataURL(file);
  
      // Upload the file
      this.uploadFile(file);
    }
  }

  onImageSelected1(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
  
    if (file) {
      // Allowed file types
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
  
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
        return;
      }
  
      // Validate file size (e.g., 2MB max)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 2MB limit.');
        return;
      }
  
      this.selectedFile1 = file;
  
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.addressImagePreview = reader.result as string; // Show preview image
      };
      reader.readAsDataURL(file);
  
      // Upload the file
      this.uploadFile1(file);
    }
  }

  onImageSelected3(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    // console.log("file====", file);
  
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
  
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
        return;
      }
  
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 2MB limit.');
        return;
      }
  
      // Preview the image (optional)
      const reader = new FileReader();
      reader.onload = () => {
        if (!this.syllabusImagePreviews) {
          this.syllabusImagePreviews = [];
        }
        this.syllabusImagePreviews[index] = reader.result as string; // Store the preview
      };
      reader.readAsDataURL(file);
  
      // Upload the file and update the form with the actual URL
      this.uploadFile3(file, index);
    }
  }
  
  
  


  //Using for course image impact
  onImageSelected2(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
  
    if (file) {
      // Allowed file types
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
  
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
        return;
      }
  
      // Validate file size (e.g., 2MB max)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 2MB limit.');
        return;
      }
  
      this.selectedFile2 = file;
  
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.impactImagePreview = reader.result as string; // Show preview image
      };
      reader.readAsDataURL(file);
  
      // Upload the file
      this.uploadFile2(file);
    }
  }
  
  
  
  uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('media', file);
  
    console.log("File being uploaded: ", file);
  
    this.isLoading = true; // Show loader
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false; // Stop loading spinner
        if (!response.error) {
          // Handle successful response
          this.getImageUrl = response?.data?.mediaUrl?.fileUrl;
          console.log("Uploaded Image URL: ", this.getImageUrl);
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
  
  uploadFile1(file: File): void {
    const formData = new FormData();
    formData.append('media', file);
  
    console.log("File being uploaded: ", file);
  
    this.isLoading = true; // Show loader
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false; // Stop loading spinner
        if (!response.error) {
          // Handle successful response
          this.getImageUrl1 = response?.data?.mediaUrl?.fileUrl;
          console.log("Uploaded Image URL1111: ", this.getImageUrl1);
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

  uploadFile2(file: File): void {
    const formData = new FormData();
    formData.append('media', file);
  
    console.log("File being uploaded: ", file);
  
    this.isLoading = true; // Show loader
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false; // Stop loading spinner
        if (!response.error) {
          // Handle successful response
          this.getImageUrl2 = response?.data?.mediaUrl?.fileUrl;
          console.log("Uploaded Image URL1111: ", this.getImageUrl2);
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

  uploadFile3(file: File, index: number): void {
    const formData = new FormData();
    formData.append('media', file);
  
    this.isLoading = true;
  
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false;
  
        if (!response.error) {
          const imageUrl = response?.data?.mediaUrl?.fileUrl;
          console.log("Uploaded Image URL:", imageUrl);
  
          // Update the image field in the syllabus form array with the URL
          const syllabusFormArray = this.addEditForm.get('syllabus') as FormArray;
          if (syllabusFormArray && syllabusFormArray.length > index) {
            if(this.detailsId){
              syllabusFormArray.at(index).patchValue({ image: imageUrl });
            }
            else{
              syllabusFormArray.at(index).patchValue({ images: imageUrl });
            }
            console.log("Updated Form Value:", syllabusFormArray.at(index)?.value);
          } else {
            console.error(`Syllabus FormArray is invalid or index ${index} is out of range.`);
          }
        } else {
          this.__shared.toastError(response.message || 'Upload failed.');
        }
      },
      (error) => {
        this.isLoading = false;
        this.__shared.toastError('An error occurred while uploading the file.');
        console.error("Upload Error:", error);
      }
    );
  }
  
  

  //patch Details..........
  getDetail() {
    if (this.detailsId) {
      this.courseList = this.courseList.map((element: any) => {
        return {
          ...element,
          isDisabled: element._id === this.detailsId, // Disable the item if it matches `detailsId`
        };
      });
      // console.log('Updated courseList:', this.courseList);
    }
    
     // Show loader
      this.isLoading = true;
      this.__spinner.show(); // Start visual spinner
      this._product.getDetailById(this.detailsId).subscribe((response: any) => {
      if (response.error == false) {
        this.getDetails = response?.data;

        this.selectedTopics = this.getDetails?.course_topic
          ?.map((id: string) => this.topicList.find((topic: any) => topic?._id === id))
          .filter((item: any) => item); // Transform IDs to objects
        
        this.selectedGoals = this.getDetails?.course_goal
          ?.map((id: string) => this.goalList.find((goal: any) => goal?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedCategories = this.getDetails?.course_category
          ?.map((id: string) => this.categoryList.find((category: any) => category?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedTeachers = this.getDetails?.course_teacher
          ?.map((id: string) => this.teacherList.find((teacher: any) => teacher?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedIndustries = this.getDetails?.course_industry
          ?.map((id: string) => this.industryList.find((indusry: any) => indusry?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedInterests = this.getDetails?.course_interest
          ?.map((id: string) => this.interestList.find((interest: any) => interest?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectednextCourse = this.getDetails?.course_next_id
          ?.map((id: string) => this.courseList.find((nextId: any) => nextId?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.imagePreview = this.getDetails.course_image ? this.getDetails.course_image : null;
        this.addressImagePreview = this.getDetails.address_image ? this.getDetails.address_image : null;
        this.impactImagePreview = this.getDetails.course_impact_image ? this.getDetails.course_impact_image : null; // new variable for course_impact_image preview
        // this.getDetails?.syllabus.forEach((element:any,index:number) => {
        //   this.syllabusImagePreviews[index]= element?.image;
        // });
        this.patchData();
      } else {
        this.__shared.toastError(response.message);
      }
      this.isLoading = false; // Stop loading spinner
      this.__spinner.hide(); // Hide visual spinner
    }, (err) => {
      this.isLoading = false; // Stop loading spinner
      this.__spinner.hide(); // Hide visual spinner
      console.log(err);
      if (err.status == 403) {
        this.__shared.sessionExpired();
      }
    });
  }
  
  patchData() {
    // Patch scalar values directly to the form
    this.addEditForm.patchValue({
      course_name: this.getDetails?.course_name,
      sana_course_id: this.getDetails?.sana_course_id,
      course_intro: this.getDetails?.course_intro,
      course_description: this.getDetails?.course_description,
      course_topic: this.selectedTopics,
      course_time: this.getDetails?.course_time,
      course_goal: this.selectedGoals,
      course_category: this.selectedCategories,
      course_teacher: this.selectedTeachers,
      course_industry: this.selectedIndustries,
      course_interest: this.selectedInterests,  
      course_next_id: this.selectednextCourse,  
      // Other scalar fields
      course_type: this.getDetails?.course_type,
      course_price: this.getDetails?.course_price,
      course_price_text: this.getDetails?.course_price_text,
      course_certificate: this.getDetails?.course_certificate,
      learn_title: this.getDetails?.learn_title,
      learn_description: this.getDetails?.learn_description,
      learn_subtitle: this.getDetails?.learn_subtitle,
      learn_outcomes: this.getDetails?.learn_outcomes.join(' | '),
      address_title: this.getDetails?.address_title,
      address_description: this.getDetails?.address_description,
      syllabus_title: this.getDetails?.syllabus_title,
      curator_title: this.getDetails?.curator_title,
      kordie_title: this.getDetails?.kordie_title,
      plan_title: this.getDetails?.plan_title,
      plan_subtitle: this.getDetails?.plan_subtitle,
      plan_description: this.getDetails?.plan_description,
      plan_duration: this.getDetails?.plan_duration,
      course_impact_title: this.getDetails?.course_impact_title,
      course_impact_summary: this.getDetails?.course_impact_summary.join(' | '),
      course_impact_testinomial_heading: this.getDetails?.course_impact_testinomial_heading,
      course_next_title: this.getDetails?.course_next_title,
      course_next_subtitle: this.getDetails?.course_next_subtitle,
      faq_title: this.getDetails?.faq_title,
      last_updated_date: this.getDetails?.last_updated_date,
      skill_track: this.getDetails?.skill_track
    });
  
    // Handle `course_impact_testinomial` FormArray
    const testimonialsArray = this.addEditForm.get('course_impact_testinomial') as FormArray;
    testimonialsArray.clear(); // Clear existing controls
  
    if (this.getDetails?.course_impact_testinomial) {
      this.getDetails.course_impact_testinomial.forEach((testimonial: any) => {
        const formattedDate = this.datePipe.transform(testimonial?.date, 'yyyy-MM-dd');
        testimonialsArray.push(
          this.__fb.group({
            date: [formattedDate || '', [Validators.required]],
            name: [testimonial?.name || '', [Validators.required]],
            designation: [testimonial?.designation || '', [Validators.required]],
            feedback: [testimonial?.feedback || '', [Validators.required]],
          })
        );
      });
    }
  
    console.log("Patched testimonials array:", testimonialsArray.value);
  
    // Handle syllabus FormArray
    const syllabusArray = this.addEditForm.get('syllabus') as FormArray;
    syllabusArray.clear(); // Clear existing syllabus items
  
    if (this.getDetails?.syllabus) {
      this.getDetails.syllabus.forEach((syllabus: any, index: number) => {
        syllabusArray.push(
          this.__fb.group({
            title: [syllabus?.title || '', [Validators.required]],
            description: [syllabus?.description || '', [Validators.required]],
            image: [syllabus?.image || '', [Validators.required]],
            time: [syllabus?.time || '', [Validators.required]],
            // chapter: [syllabus?.chapter.join(' | ') || ''],
            chapter1: [syllabus?.chapter1 || ''],
            chapter2: [syllabus?.chapter2 || ''],
            chapter3: [syllabus?.chapter3 || ''],
            chapter4: [syllabus?.chapter4 || ''],
            icon1: [syllabus?.icon1 || this.iconList[0]?.url],
            icon2: [syllabus?.icon2 || this.iconList[0]?.url],
            icon3: [syllabus?.icon3 || this.iconList[0]?.url],
            icon4: [syllabus?.icon4 || this.iconList[0]?.url],
          })
        );
  
        // Update the image preview array
        this.syllabusImagePreviews[index] = syllabus?.image || '';
      });
    }

    const courseArray = this.addEditForm.get('whytakecourse') as FormArray;
    courseArray.clear(); 
     if (this.getDetails?.whytakecourse?.length) {
       this.getDetails.whytakecourse.forEach((course: any, index: number) => {
        courseArray.push(
           this.__fb.group({
             title: [course.title || ''],
             description: [course.description || ''],
             image: [course.image || ''],
           })
         );
           this.takeCourseImagePreviews[index] = course.image || '';

       }); 
     } else {
       this.ensureCourse(); 
     }

    const courseTagArray = this.addEditForm.get('course_tag') as FormArray;
    courseTagArray.clear(); 
     if (this.getDetails?.course_tag?.length) {
       this.getDetails.course_tag.forEach((courseTag: any, index: number) => {
        courseTagArray.push(
           this.__fb.group({
             tag: [courseTag.tag || ''],
             color: [courseTag.color || ''],
             text_color: [courseTag.text_color || ''],
           })
         );
       }); 
     } else {
       this.ensureCourseTag(); 
     }
  
    // console.log("Patched syllabus array:", syllabusArray.value);
  }

   // Handle topic selection changes
   onTopicChange(event: Event, topic: any): void {
    const checkbox = event.target as HTMLInputElement;
    const selectedValues = this.addEditForm.get('course_topic')?.value || [];

    if (checkbox.checked) {
      // Add selected topic
      selectedValues.push(topic._id);
    } else {
      // Remove deselected topic
      const index = selectedValues.indexOf(topic._id);
      if (index !== -1) {
        selectedValues.splice(index, 1);
      }
    }

    // Update form control and selected topics
    this.addEditForm.get('course_topic')?.setValue(selectedValues);
    this.selectedTopics = [...selectedValues];
  }
  
  // //allow only positive number.....
  allowOnlyPositiveDecimalNumbers(event: KeyboardEvent): void {
    const charCode = event.key;
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Allow numbers, one '.', and control keys like Backspace and Delete
    if (
      !/[0-9.]/.test(charCode) || // Block any character that is not a number or '.'
      (charCode === '.' && inputValue.includes('.')) // Block multiple '.'
    ) {
      event.preventDefault();
    }
  }
  // allowOnlyPositiveNumbers(event: KeyboardEvent): void {
  //   const charCode = event.key;
  //   // Prevent "-" or any non-numeric characters except for allowed keys (e.g., Backspace, Tab).
  //   if (charCode === '-' || isNaN(Number(charCode))) {
  //     event.preventDefault();
  //   }
  // }

  preventNegativeValues(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (parseFloat(inputElement.value) < 0) {
      inputElement.value = '0'; // Reset to 0 if negative
    }
  }
  
  getSanaCourse(){
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    this.loaded_data = false;
    this._product.getSanaCourseList()
    .subscribe((response)=>{
      console.log("response");
      
      if(response.error == false)
      {
        this.getCourseList = response?.data?.data;
      }
      if(!this.detailsId){    
        this.isLoading = false;
        this.__spinner.hide(); // Start visual spinner
      }
    },
    (err)=>{
      console.log(err);
      if(err.status == 403)
          {
                this.__shared.sessionExpired();
          }
          if(!this.detailsId){    
            this.isLoading = false;
            this.__spinner.hide(); // Start visual spinner
          }
    })
  }

  processChapter(index: number): void {
    let chapterValue = this.syllabus.controls[index].get('chapter')?.value;
  
    if (chapterValue) {
      const chapterArray = chapterValue
        .split('|')
        .map((chapter: string) => chapter.trim())
        .filter((chapter: string) => chapter)
        .join(' | ');
  
      console.log('Processed Chapter:', chapterArray);
  
      // Update the form control with the array
      this.syllabus.controls[index].patchValue({ chapter: chapterArray });
    }
  }
  

}
