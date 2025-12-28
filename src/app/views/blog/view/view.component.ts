import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlogService } from '../../../services/blog/blog.service';
import { DatePipe } from '@angular/common';
import { ListService } from '../../../services/master-list/list.service';
import { Subscription } from 'rxjs';
import { BlogCategoryService } from '../../../services/blog-category/blog-category.service';
import { CourseService } from '../../../services/category-course/course.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [DatePipe]
})
export class ViewComponent implements OnInit, OnDestroy {
  typeubscription!: Subscription;
  blogCategorySubscription!: Subscription;
  categorySubscription!: Subscription;
  blogTypeubscription!: Subscription;
  addEditForm!: FormGroup;
  getBlogData:any;
  detailsId:string | null = null;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  typeList: any;
  categoryList: any;
  blogCategoryList:any;
  editorConfig: any;
  isLoading = false;
  blogTypeList: any;
  dropdownSettings_blog_type: any = {};
  selectedBlogType: any = [];
  isDisabled:boolean = true;

  constructor(
    private __fb: FormBuilder,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private _blog: BlogService,
    private datePipe: DatePipe,
    private _serv: ListService,
    private _blogCategory: BlogCategoryService,
    private _category: CourseService,
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
    this.getDetail();
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  ngOnDestroy(): void {
    if(this.typeubscription){
      this.typeubscription.unsubscribe();
    }
    if(this.blogCategorySubscription){
      this.blogCategorySubscription.unsubscribe();
    }
    if(this.blogTypeubscription){
      this.blogTypeubscription.unsubscribe();
    }
  }
  getData(){
    this.getBlogCategory();
    this.dropdownSettings_blog_type = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };
  }

  createForm()
    {
      this.addEditForm = this.__fb.group({
        title:[''],
        description: [''],
        categoryId: [''],
        author: [''],
        date: [''],
        meta_title: [''],
        meta_description: [''],
        meta_keywords: [[]],
        course_category: [[]],
        course_type: [''],
        blog_type: [[]],
        timetoread: [''],
        blogImage: [''],
        blogVideo: ['']
      });
    }

    //get blog details............
  getDetail(){
    this._blog.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getBlogData = response.data;
            this.selectedBlogType = this.getBlogData?.blog_type
              ?.map((id: string) => this.blogTypeList?.find((type: any) => type?._id === id) || null)
              .filter((item: any) => item);

            // console.log("selectedBlogType.......",this.selectedBlogType);
            
            this.imagePreview =  this.getBlogData?.image ? this.getBlogData?.image : 'assets/kordie-admin-image/no-image-found-01.png';
            this.videoPreview =  this.getBlogData?.video ? this.getBlogData?.video : 'assets/kordie-admin-image/no-image-found-01.png';
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
      title: this.getBlogData.title || 'N/A',
      description: this.getBlogData.description || 'N/A',
      categoryId: this.getBlogData.categoryId || 'N/A',
      author: this.getBlogData.author || 'N/A',
      date: this.getBlogData.date
        ? this.datePipe.transform(this.getBlogData.date, 'yyyy-MM-dd')
        : 'N/A',
      meta_title: this.getBlogData.meta?.title || 'N/A', // Adjusted for correct meta title
      meta_description: this.getBlogData.meta?.description || 'N/A', // Correct access for meta description
      meta_keywords: this.getBlogData.meta?.keywords?.join(', ') || 'N/A', // Join keywords array into a string
      course_category: this.getBlogData.course_category || 'N/A',
      course_type: this.getBlogData.course_type || 'N/A',
      blog_type: this.selectedBlogType || [],
      timetoread: this.getBlogData.timetoread || 'N/A',
    });
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
    //     // console.log("typeList.....",this.typeList);
    //     this.getBlogType();
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

  //For blog type details.......
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

  //For category details.......
  getCategory(){
    const params = {}
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

}
