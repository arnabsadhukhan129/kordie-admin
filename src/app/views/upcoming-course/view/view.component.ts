import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from '../../../services/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../services/editor/editor.service';
import { UpcomingService } from '../../../services/upcoming-course/upcoming.service';
import { ProductService } from '../../../services/product/product.service';
import { CourseService } from '../../../services/category-course/course.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  getImageUrl: string = '';
  displayMessage : string = '';
  errorMessage : string = '';
  detailsId:string | null = null;
  editorConfig: any;
  addEditForm!: FormGroup;
  dropdownSettings_category: any = {};
  categoryList: any;
  getDetails: any;
  selectedCategories:any = [];
  isDisabled:boolean = true;

  constructor(
    private __fb: FormBuilder,
    private __shared:SharedService,
    private __route:Router,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService,
    private _course: UpcomingService,
    private _product: ProductService,
    private _category: CourseService,
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
    this.getData();
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      title:[''],
      tag:[''],
      description:[''],
      image:[''],
      year: [''],
      month: [''],
      time:[''],
      categeoryId: [[]],
    })
  }

  getData(){
    this.getCategory();
    this.dropdownSettings_category = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };
  }

  //For category details.......
  getCategory(){
    const params = {
      active: true
    }
    this._category.getList(params)
    .subscribe((response)=>{
      if(response.error == false)
      {
        this.categoryList = response?.data?.category;
        if(this.detailsId){
          this.getDetail();
        }
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

   //patch Details..........
   getDetail() {
    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._course.getDetailById(this.detailsId).subscribe((response: any) => {
      if (response.success == true) {
        this.getDetails = response?.data;
        this.selectedCategories = this.getDetails?.categeoryId
          ?.map((id: string) => this.categoryList.find((category: any) => category?._id === id))
          .filter((item: any) => item); // Transform IDs to objects
        this.imagePreview = this.getDetails.image ? this.getDetails.image : null;
        this.patchData();
      }
      else {
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
    }
    )
  }

  patchData() {
    this.addEditForm.patchValue({
      title: this.getDetails?.title,
      tag: this.getDetails?.tag,
      description: this.getDetails?.description,
      year: this.getDetails?.year,
      month: this.getDetails?.month,
      time: this.getDetails?.time,
      categeoryId: this.selectedCategories,
    })
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

}
