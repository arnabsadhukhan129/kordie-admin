import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListService } from '../../../services/master-list/list.service';
import { Subscription } from 'rxjs';
import { CourseService } from '../../../services/category-course/course.service';
import {BlogService} from '../../../services/blog/blog.service';
import {BlogCategoryService} from '../../../services/blog-category/blog-category.service';
import { DatePipe } from '@angular/common';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [DatePipe]
})
export class CreateComponent implements OnInit, OnDestroy {
  typeubscription!: Subscription;
  categorySubscription!: Subscription;
  blogCategorySubscription!: Subscription;
  blogTypeubscription!: Subscription;
  detailsId:string | null = null;
  addEditForm!: FormGroup;
  selectedFile: File | null = null;
  videoSelectedFile: File | null = null;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  isLoading = false;
  getImageUrl: string = '';
  displayMessage : string = '';
  errorMessage : string = '';
  typeList: any;
  blogTypeList: any;
  categoryList: any;
  blogCategoryList:any;
  getBlogData: any;
  editorConfig: any;
  dropdownSettings_blog_type: any = {};
  selectedBlogType: any = [];

  constructor(
    private _product: ProductService,
    private __fb: FormBuilder,
    private _category: CourseService,
    private _serv: ListService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private _blog: BlogService,
    private _blogCategory: BlogCategoryService,
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
      error: err => {}
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.getData();
    this.editorConfig = this.editorSettings.editorConfig();
  }

  getData(){
    this.getBlogCategory();
    this.dropdownSettings_blog_type = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };
  }

  ngOnDestroy(): void {
    if(this.typeubscription){
      this.typeubscription.unsubscribe();
    }
    if(this.categorySubscription){
      this.categorySubscription.unsubscribe();
    }
    if(this.blogCategorySubscription){
      this.blogCategorySubscription.unsubscribe();
    }
    if(this.blogTypeubscription){
      this.blogTypeubscription.unsubscribe();
    }
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

  createForm()
  {
    this.addEditForm = this.__fb.group({
      title:['',[Validators.required]],
      description: ['',[Validators.required]],
      categoryId: ['',[Validators.required]],
      author: ['',[Validators.required]],
      date: ['',[Validators.required]],
      meta_title: ['',[Validators.required]],
      meta_description: ['',[Validators.required]],
      meta_keywords: [[],[Validators.required]],
      course_category: [[]],
      course_type: [''],
      blog_type: [[],[Validators.required]],
      timetoread: ['',[Validators.required]],
      blogImage: [''],
      blogVideo: ['']
    });
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
  }

  //For course type details.......
  getCourseType(){
    this.typeList = [
      {'name':'Interview', 'value':'interview'},
      {'name':'Article', 'value':'article'},
      {'name':'Blog post', 'value':'blog_post'}
    ];
    this.getBlogType();
    // const params = {}
    // this.typeubscription = this._serv.typeList(params)
    // .subscribe((response)=>{
    //   if(response.error == false)
    //   {
    //     this.typeList = response?.data?.items;
    //     this.getBlogType();
    //     // console.log("typeList.....",this.typeList);
    //   }
    // },
    // (err)=>{
    //   console.log(err);
    //   if(err.status == 403)
    //       {
    //             this.__shared.sessionExpired();
    //       }
    // })
  }

  //For course type details.......
  getBlogType(){
    const params = {
      active: true
    }
    this.blogTypeubscription = this._serv.blogTypeList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.blogTypeList = response?.data?.items;
        // console.log("typeList.....",this.blogTypeList);
        if(this.detailsId){
          this.getDetail();
        }
      }
      if(!this.detailsId){
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide visual spinner
      }
    },
    (err)=>{
      this.isLoading = false; // Stop loading spinner
      this.__spinner.hide(); // Hide visual spinner
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
    this.categorySubscription = this._category.getList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.categoryList = response?.data?.category;
        this.getCourseType();
        // console.log("teacherList.....",this.teacherList);
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

   //For blog category details.......
   getBlogCategory(){
    const params = {}
    this.blogCategorySubscription = this._blogCategory.getList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.blogCategoryList = response?.data?.topics;
        this.getCategory();
        // console.log("teacherList.....",this.teacherList);
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

  add(): void {
    this.ensureArrayValues('meta_keywords');
    this.ensureArrayValues('course_category');
  
    const data: any = this.addEditForm.value;
  
    if (!this.selectedFile && !this.getBlogData?.image) {
      this.__shared.toastError('Please upload image!');
      return;
    }
  
    const formData = new FormData();
  
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId);
    formData.append('author', data.author);
    formData.append('date', data.date);
    formData.append('meta_title', data.meta_title);
    formData.append('meta_description', data.meta_description);
  
    formData.append(
      'meta_keywords', 
      Array.isArray(data.meta_keywords) ? JSON.stringify(data.meta_keywords) : '[]'
    );
  
    formData.append(
      'course_category', 
      Array.isArray(data.course_category) ? JSON.stringify(data.course_category) : '[]'
    );
  
    formData.append('course_type', data.course_type);
  
    formData.append(
      'blog_type', 
      data.blog_type && typeof data.blog_type === 'object' ? JSON.stringify(data.blog_type) : '{}'
    );
  
    formData.append('timetoread', data.timetoread);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.getBlogData?.image && !this.detailsId) {
      formData.append('image', this.getBlogData.image);
    }
  
    if (this.videoSelectedFile) {
      formData.append('video', this.videoSelectedFile);
    } else if (this.getBlogData?.video && !this.detailsId) {
      formData.append('video', this.getBlogData.video);
    }

    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
  
    const apiCall = this.detailsId
      ? this._blog.edit(this.detailsId, formData)
      : this._blog.create(formData);
  
    apiCall.subscribe(
      (response: any) => {
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide visual spinner
        if (!response.error) {
          this.displayMessage = this.detailsId
            ? 'Data has been updated successfully'
            : 'Data has been saved successfully';
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/blog/blog-list']);
        } else {
          this.handleError(response.message);
          this.__shared.toastError(response.message);
        }
      },
      (err: any) => this.handleApiError(err)
    );
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

  //get blog details............
  getDetail(){
    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._blog.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getBlogData = response.data;

            this.selectedBlogType = this.getBlogData?.blog_type
            ?.map((id: string) => this.blogTypeList.find((type: any) => type?._id === id))
            .filter((item: any) => item);
            // console.log("selectedBlogType.......",this.selectedBlogType);
            
            this.imagePreview =  this.getBlogData?.image ? this.getBlogData?.image : null;
            this.videoPreview =  this.getBlogData?.video ? this.getBlogData?.video : null;
            this.patchData();
            // console.log('app-->', this.titleData );
        }
        else{
          this.__shared.toastError(response.message);
        }
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide visual spinner
      },
      (err)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide visual spinner
        console.log(err);
        if(err.status == 403)
        {
              this.__shared.sessionExpired();
        }
      })
  }

  patchData() {
    this.addEditForm.patchValue({
      title: this.getBlogData.title || '',
      description: this.getBlogData.description || '',
      categoryId: this.getBlogData.categoryId || '',
      author: this.getBlogData.author || '',
      date: this.getBlogData.date
        ? this.datePipe.transform(this.getBlogData.date, 'yyyy-MM-dd')
        : '',
      meta_title: this.getBlogData.meta?.title || '', // Adjusted for correct meta title
      meta_description: this.getBlogData.meta?.description || '', // Correct access for meta description
      meta_keywords: this.getBlogData.meta?.keywords?.join(', ') || '', // Join keywords array into a string
      course_category: this.getBlogData.course_category || [],
      course_type: this.getBlogData.course_type || '',
      blog_type: this.selectedBlogType || [],
      timetoread: this.getBlogData.timetoread || '',
    });
  }

}
