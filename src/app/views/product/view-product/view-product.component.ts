import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../../app/services/product/product.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { CourseService } from '../../../services/category-course/course.service';
import { ListService } from '../../../services/master-list/list.service';
import { DatePipe } from '@angular/common';
import { EditorService } from '../../../../app/services/editor/editor.service';
interface Icon {
  label: string;
  url: string;
}

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
  providers: [DatePipe]
})
export class ViewProductComponent implements OnInit {

  isDisabled:boolean = true;
  viewForm : any;
  courseSlug: any;
  courseData: any;
  // categoryNames: string = 'N/A';
  // goalNames: string = 'N/A';
  // impactDetails: any = 'N/A';
  // industryDetails: string = 'N/A'
  // interestDetails: string = 'N/A'
  // topicDetails: string = 'N/A'
  // outcomesDetails: string = 'N/A'

  timeSubscription!: Subscription;
  goalSubscription!: Subscription;
  topicSubscription!: Subscription;
  categorySubscription!: Subscription;
  teacherSubscription!: Subscription;
  typeubscription!: Subscription;
  interestSubscription!: Subscription;
  industrySubscription!: Subscription;
  displayMessage : string = '';
  errorMessage : string = '';
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  selectedFile: File | null = null;
  mediaType:string = '';
  detailsId:string | null = null;
  // getDetails:any;
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
  selectedTopics: string[] = [];
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
    // private __fb: FormBuilder,
    private _course: ProductService,
    // private __route:Router,
    // private __shared:SharedService,
    // private __spinner: NgxSpinnerService,
    // private __activatedRoute:ActivatedRoute,
    private _serv: ListService,
    private _category: CourseService,
    private _product: ProductService,
    private __fb: FormBuilder,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private datePipe: DatePipe,
    private editorSettings: EditorService
  ) {
    // Start loader immediately
    this.isLoading = true;
    this.__spinner.show();
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {
        console.log("ERRRRRR ===============", err);
      }
    });
  }

  ngOnInit(): void {
    this.viewDetailsForm();
    this.getData();
    this.getSanaCourse();
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  viewDetailsForm()
  {
     this.viewForm = this.__fb.group({
        course_name:[''],
        sana_course_id: [''],
        course_intro: [''],
        course_description: [''],
        course_topic: [[]],
        course_time: [''],
        course_goal: [[]],
        course_category: [[]],
        course_teacher: [[]],
        course_type: [''],
        course_image: [''],
        course_price: [''],
        course_price_text: [''],
        course_certificate: [''],
        // course_link_text: ['',],
        // course_link_membership_text: ['',],
        learn_title: [''],
        learn_description: [''],
        //learn_subtitle: ['',],
        learn_outcomes: [[]],
        address_title: [''],
        address_description: [''],
        address_image: [''],
        //syllabus_title: ['',],
        syllabus: this.__fb.array([this.createSyllabusItem()]), // FormArray for syllabus items
        whytakecourse: this.__fb.array([]),
        curator_title: [''],
        kordie_title: [''],
        // plan_title: ['',],
        // plan_subtitle: ['',],
        // plan_description:  ['',],   for now plan will inctive
        // plan_link: ['',],
        plan_duration: [0],
        course_impact_title: [''],
        course_impact_image: [''],
        course_impact_summary: [[]],
        course_impact_testinomial_heading: [''],
        course_impact_testinomial: this.__fb.array([this.createtestimonialsItem()]),
        course_tag: this.__fb.array([]),
        course_next_title: [''],
        //course_next_subtitle: ['',],
        course_next_id: [[]],
        //faq_title: ['',],
        course_interest: [[]],
        course_industry: [[]],
        last_updated_date: [''],
        skill_track: ['']
      });
      this.syllabus = this.viewForm.get('syllabus') as FormArray;
      this.whytakecourse = this.viewForm.get('whytakecourse') as FormArray;
      this.ensureCourse();
      this.course_impact_testinomial = this.viewForm.get('course_impact_testinomial') as FormArray;
      this.course_tag = this.viewForm.get('course_tag') as FormArray;
      this.ensureCourseTag();
  }

  get syllabusControls() {
    return (this.viewForm.get('syllabus') as FormArray).controls;
  }
  get whytakecourseControls(){
    return (this.viewForm.get('whytakecourse') as FormArray).controls;
  }
  get testimonialsControls() {
    return (this.viewForm.get('course_impact_testinomial') as FormArray).controls;
  }
  get course_tagControls(){
    return (this.viewForm.get('course_tag')as FormArray).controls;
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

  removecourseItem(index: number){
    this.whytakecourse.removeAt(index);
    this.ensureCourse();
  }

  //Remove Testimonials Section
  removetestimonialsItem(index: number) {
    this.course_impact_testinomial.removeAt(index);
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
      // itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };

    this.dropdownSettings_interest = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };

    this.dropdownSettings_teacher = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };

    this.dropdownSettings_category = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };

    this.dropdownSettings_goal = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3, // Limit the number of selected items shown
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
      // itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true, // Enable search
      disabledField: 'isDisabled', // Add this line to enable disabling
    };
  }

  // getDetail(){
  //   this._course.getDetailBySlug(this.courseSlug)
  //     .subscribe((response)=>{
        
  //       if(response.error == false)
  //       {
  //           this.courseData = response.data;
           
  //            // Process category names
  //             this.categoryNames = this.courseData?.course_category
  //             ?.map((cat: any) => cat?.name || 'N/A')
  //             .join(', ') || 'N/A';

  //           // Process goal names
  //            this.goalNames = this.courseData?.course_goal
  //            ?.map((goal: any) => goal?.name || 'N/A')
  //            .join(', ') || 'N/A';

  //           // Handle course_impact_summary mapping
  //           if (this.courseData?.course_impact_summary?.length > 0) {
  //             this.impactDetails = `<ul>` + 
  //               this.courseData.course_impact_summary
  //                 .map((imp: string) => `<li>${imp || 'N/A'}</li>`)
  //                 .join('') +
  //               `</ul>`;
  //           } else {
  //             this.impactDetails = 'N/A';
  //           }

  //           // // Process industry names
  //           // this.industryDetails = this.courseData?.course_industry
  //           // ?.map((indName: any) => indName?.name || 'N/A')
  //           // .join(', ') || 'N/A';


  //            // Handle course industry details
  //            if (this.courseData?.course_industry?.length > 0) {
  //             this.industryDetails = `<ul>` + 
  //               this.courseData.course_industry
  //                 .map((indName: any) => `<li>${indName?.name || 'N/A'}</li>`)
  //                 .join('') +
  //               `</ul>`;
  //           } else {
  //             this.industryDetails = 'N/A';
  //           }


  //           // Handle course interest details
  //           if (this.courseData?.course_interest?.length > 0) {
  //             this.interestDetails = `<ul>` + 
  //               this.courseData.course_interest
  //                 .map((intName: any) => `<li>${intName?.name || 'N/A'}</li>`)
  //                 .join('') +
  //               `</ul>`;
  //           } else {
  //             this.interestDetails = 'N/A';
  //           }


  //           // Process interest names
  //           // this.interestDetails = this.courseData?.course_interest
  //           // ?.map((intName: any) => intName?.name || 'N/A')
  //           // .join(', ') || 'N/A';



  //           // Handle course topic details
  //            if (this.courseData?.course_topic?.length > 0) {
  //             this.topicDetails = `<ul>` + 
  //               this.courseData.course_topic
  //                 .map((topic: any) => `<li>${topic?.name || 'N/A'}</li>`)
  //                 .join('') +
  //               `</ul>`;
  //           } else {
  //             this.topicDetails = 'N/A';
  //           }

  //            // Handle learn outcomes details
  //            if (this.courseData?.learn_outcomes?.length > 0) {
  //             this.outcomesDetails = `<ul>` + 
  //               this.courseData.learn_outcomes
  //                 .map((outcomes: any) => `<li>${outcomes || 'N/A'}</li>`)
  //                 .join('') +
  //               `</ul>`;
  //           } else {
  //             this.outcomesDetails = 'N/A';
  //           }
  //           this.patchProductData();
  //           console.log('app-->', this.courseData );
  //       }
  //       else{
  //         this.__shared.toastError(response.message);
  //       }
        
  //     },
  //     (err)=>{
  //       console.log(err);
  //       if(err.status == 403)
  //       {
  //             this.__shared.sessionExpired();
  //       }
  //     })
  // }

  addSyllabusItem() {
    if(!this.detailsId){
      const syllabusItem = this.__fb.group({
        title: [''],
        images: [''],
        time: [''],
        description: [''],
        // chapter: [[], [Validators.required]]
        chapter1: [''],
        chapter2: [''],
        chapter3: [''],
        chapter4: [''],
        icon1: [''],
        icon2: [''],
        icon3: [''],
        icon4: [''],
      });
  
      this.syllabus.push(syllabusItem);
    }
    else{
      const syllabusItem = this.__fb.group({
        title: [''],
        image: [''],
        time: [''],
        description: [''],
        // chapter: [[], [Validators.required]]
        chapter1: [''],
        chapter2: [''],
        chapter3: [''],
        chapter4: [''],
        icon1: [''],
        icon2: [''],
        icon3: [''],
        icon4: [''],
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

  // Create a new syllabus item form group
  createSyllabusItem() {
    return this.__fb.group({
      title: ['', [Validators.required]],
      images: [''],
      time: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // chapter: [[], [Validators.required]]
      chapter1: [''],
      chapter2: [''],
      chapter3: [''],
      chapter4: [''],
      icon1: [''],
      icon2: [''],
      icon3: [''],
      icon4: [''],
    });
  }

  // Create a new syllabus item form group
  getTopic(){
    // this.isLoading = true;
    // this.__spinner.show(); // Start visual spinner
    const params = {
      active: true
    }
    this.loaded_data = false;
    this._serv.tpicList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.topicList = response?.data?.items;
        this.getTime();
        // console.log("topicList.....",this.topicList);
        this.loaded_data = true;
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
  

  //For next course details.......
  getCourse(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._product.getList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.courseList = response?.data?.items;
        this.getInterest();
        // console.log("courseList.....",this.courseList);
        this.loaded_data = true;
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

  //For time details.......
  getTime(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._serv.timeList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.timeList = response?.data?.items;
        this.getGoal();
        // console.log("timeList.....",this.topicList);
        this.loaded_data = true;
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

  //For time details.......
  getGoal(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this.goalSubscription = this._serv.goalList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.goalList = response?.data?.items;
        this.getCategory();
        // console.log("goalList.....",this.goalList);
        this.loaded_data = true;
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

 
  //For category details.......
  getCategory(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._category.getList(params)
    .subscribe((response)=>{
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
      this.isLoading = false;
      this.__spinner.hide(); // Start visual spinner
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
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._serv.taughtList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.teacherList = response?.data?.items;
        this.getCourseType();
        // console.log("teacherList.....",this.teacherList);
        this.loaded_data = true;
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

  //For interest details.......
  getInterest(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._serv.interestList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.interestList = response?.data?.items;
        this.getIndustry();
        // console.log("teacherList.....",this.interestList);
        this.loaded_data = true;
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

  //For indusry details.......
  getIndustry(){
    const params = {
      active: true
    }
    this.loaded_data = false;
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
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
      this.isLoading = false;
      this.__spinner.hide(); // Start visual spinner
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
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._serv.typeList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.typeList = response?.data?.items;
        this.getCourse();
        // console.log("typeList.....",this.typeList);
        this.loaded_data = true;
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
          const syllabusFormArray = this.viewForm.get('syllabus') as FormArray;
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

  // patchProductData(){
  //   this.viewForm.patchValue({
  //     course_name: this.courseData?.course_name || "",
  //     sana_course_id: this.courseData?.sana_course_id || '',
  //     course_description: this.courseData?.course_description || "",
  //     course_topic: this.courseData?.course_topic || "",
  //     course_time: this.courseData?.course_time || "",
  //     goalNames: this.goalNames || [],
  //     categoryNames: this.categoryNames || [],
  //     course_teacher: this.courseData?.course_teacher || [],
  //     industryDetails: this.industryDetails,
  //     interestDetails: this.interestDetails,  
  //     course_next_id: this?.courseData?.course_next_id || [],
  //     // Other scalar fields
  //     course_type: this.courseData?.course_type ||"",
  //     course_price: this.courseData?.course_price || "",
  //     course_price_text: this.courseData?.course_price_text || "",
  //     course_certificate: this.courseData?.course_certificate || "",
  //     learn_title: this.courseData?.learn_title || "",
  //     learn_description: this.courseData?.learn_description || "",
  //     learn_subtitle: this.courseData?.learn_subtitle || "",
  //     outcomesDetails: this.outcomesDetails || "",
  //     address_title: this.courseData?.address_title,
  //     address_description: this.courseData?.address_description,
  //     syllabus_title: this.courseData?.syllabus_title,
  //     curator_title: this.courseData?.curator_title,
  //     kordie_title: this.courseData?.kordie_title,
  //     plan_title: this.courseData?.plan_title,
  //     plan_subtitle: this.courseData?.plan_subtitle,
  //     plan_description: this.courseData?.plan_description,
  //     plan_link: this.courseData?.plan_link,
  //     course_impact_title: this.courseData?.course_impact_title,
  //     course_impact_summary: this.courseData?.course_impact_summary.join(', '),
  //     course_impact_testinomial_heading: this.courseData?.course_impact_testinomial_heading,
  //     course_next_title: this.courseData?.course_next_title,
  //     course_next_subtitle: this.courseData?.course_next_subtitle,
  //     faq_title: this.courseData?.faq_title,
  //   });
  // }

  getDetail() {
    if (this.detailsId) {
      this.courseList = this.courseList.map((element: any) => {
        return {
          ...element,
          isDisabled: element._id === this.detailsId, // Disable the item if it matches `detailsId`
        };
      });
      console.log('Updated courseList:', this.courseList);
    }
    
     // Show loader
      this.isLoading = true;
      this.__spinner.show(); // Start visual spinner
      this._product.getDetailById(this.detailsId).subscribe((response: any) => {
      this.isLoading = false; // Stop loading spinner
      this.__spinner.hide(); // Hide visual spinner
      if (response.error == false) {
        this.courseData = response?.data;

        this.selectedTopics = this.courseData?.course_topic
          ?.map((id: string) => this.topicList.find((topic: any) => topic?._id === id))
          .filter((item: any) => item); // Transform IDs to objects
        
        this.selectedGoals = this.courseData?.course_goal
          ?.map((id: string) => this.goalList.find((goal: any) => goal?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedCategories = this.courseData?.course_category
          ?.map((id: string) => this.categoryList.find((category: any) => category?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedTeachers = this.courseData?.course_teacher
          ?.map((id: string) => this.teacherList.find((teacher: any) => teacher?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedIndustries = this.courseData?.course_industry
          ?.map((id: string) => this.industryList.find((indusry: any) => indusry?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectedInterests = this.courseData?.course_interest
          ?.map((id: string) => this.interestList.find((interest: any) => interest?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.selectednextCourse = this.courseData?.course_next_id
          ?.map((id: string) => this.courseList.find((nextId: any) => nextId?._id === id))
          .filter((item: any) => item); // Transform IDs to objects

        this.imagePreview = this.courseData.course_image ? this.courseData.course_image : null;
        this.addressImagePreview = this.courseData.address_image ? this.courseData.address_image : null;
        this.impactImagePreview = this.courseData.course_impact_image ? this.courseData.course_impact_image : null; // new variable for course_impact_image preview
        // this.getDetails?.syllabus.forEach((element:any,index:number) => {
        //   this.syllabusImagePreviews[index]= element?.image;
        // });
        this.patchData();
      } else {
        this.__shared.toastError(response.message);
      }
      this.isLoading = false;
      this.__spinner.hide(); // Stop visual spinner
    }, (err) => {
      this.isLoading = false; // Stop loading spinner
      this.__spinner.hide(); // Hide visual spinner
      console.log(err);
      if (err.status == 403) {
        this.__shared.sessionExpired();
      }
      this.isLoading = false;
      this.__spinner.hide(); // Stop visual spinner
    });
  }

  patchData() {
    // Patch scalar values directly to the form
    this.viewForm.patchValue({
      course_name: this.courseData?.course_name,
      sana_course_id: this.courseData?.sana_course_id,
      course_intro: this.courseData?.course_intro,
      course_description: this.courseData?.course_description,
      course_topic: this.selectedTopics,
      course_time: this.courseData?.course_time,
      course_goal: this.selectedGoals,
      course_category: this.selectedCategories,
      course_teacher: this.selectedTeachers,
      course_industry: this.selectedIndustries,
      course_interest: this.selectedInterests,  
      course_next_id: this.selectednextCourse,  
      // Other scalar fields
      course_type: this.courseData?.course_type,
      course_price: this.courseData?.course_price,
      course_price_text: this.courseData?.course_price_text,
      course_certificate: this.courseData?.course_certificate,
      learn_title: this.courseData?.learn_title,
      learn_description: this.courseData?.learn_description,
      learn_subtitle: this.courseData?.learn_subtitle,
      learn_outcomes: this.courseData?.learn_outcomes.join(' | '),
      address_title: this.courseData?.address_title,
      address_description: this.courseData?.address_description,
      syllabus_title: this.courseData?.syllabus_title,
      curator_title: this.courseData?.curator_title,
      kordie_title: this.courseData?.kordie_title,
      plan_title: this.courseData?.plan_title,
      plan_subtitle: this.courseData?.plan_subtitle,
      plan_description: this.courseData?.plan_description,
      plan_link: this.courseData?.plan_link,
      plan_duration: this.courseData?.plan_duration,
      course_impact_title: this.courseData?.course_impact_title,
      course_impact_summary: this.courseData?.course_impact_summary.join(' | '),
      course_impact_testinomial_heading: this.courseData?.course_impact_testinomial_heading,
      course_next_title: this.courseData?.course_next_title,
      course_next_subtitle: this.courseData?.course_next_subtitle,
      faq_title: this.courseData?.faq_title,
      last_updated_date: this.courseData?.last_updated_date,
      skill_track: this.courseData?.skill_track,
    });
  
    // Handle `course_impact_testinomial` FormArray
    const testimonialsArray = this.viewForm.get('course_impact_testinomial') as FormArray;
    testimonialsArray.clear(); // Clear existing controls
  
    if (this.courseData?.course_impact_testinomial) {
      this.courseData.course_impact_testinomial.forEach((testimonial: any) => {
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
    const syllabusArray = this.viewForm.get('syllabus') as FormArray;
    syllabusArray.clear(); // Clear existing syllabus items
  
    if (this.courseData?.syllabus) {
      this.courseData.syllabus.forEach((syllabus: any, index: number) => {
        syllabusArray.push(
          this.__fb.group({
            title: [syllabus?.title || ''],
            description: [syllabus?.description || ''],
            image: [syllabus?.image || ''],
            time: [syllabus?.time || ''],
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

    const courseArray = this.viewForm.get('whytakecourse') as FormArray;
    courseArray.clear(); 
     if (this.courseData?.whytakecourse?.length) {
       this.courseData.whytakecourse.forEach((course: any, index: number) => {
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

     const courseTagArray = this.viewForm.get('course_tag') as FormArray;
    courseTagArray.clear(); 
     if (this.courseData?.course_tag?.length) {
       this.courseData.course_tag.forEach((courseTag: any, index: number) => {
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
  
  
    console.log("Patched syllabus array:", syllabusArray.value);
  }

  getSanaCourse(){
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this.loaded_data = false;
    this._product.getSanaCourseList()
    .subscribe((response)=>{
      console.log("response");
      
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
}
