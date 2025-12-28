import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../services/editor/editor.service';
import { UpcomingService } from '../../../services/upcoming-course/upcoming.service';
import { ProductService } from '../../../services/product/product.service';
import { CourseService } from '../../../services/category-course/course.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
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
    // Start loader immediately
    // this.isLoading = true;
    // this.__spinner.show();
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

  createForm()
  {
    this.addEditForm = this.__fb.group({
      title:['',[Validators.required]],
      tag:['',[Validators.required]],
      description:['',[Validators.required]],
      image:[''],
      year: ['',[Validators.required]],
      month: ['',[Validators.required]],
      time:['',[Validators.required]],
      categeoryId: [[],[Validators.required]],
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

  add(){
    const data: any = this.addEditForm?.value;
    if(!this.imagePreview){
      this.__shared.toastError('Please upload image!');
      return;
    }
    const params: any = {
      'title': data?.title ? data?.title : '',
      'tag': data?.tag ? data?.tag : '',
      'description': data?.description ? data?.description : '',
      'image': this.getImageUrl ? this.getImageUrl : this.getDetails.image,
      'year': data?.year ? data?.year : '',
      'month': data?.month ? data?.month : '',
      'time': data?.time ? data?.time : '',
      'categeoryId': data?.categeoryId ? data?.categeoryId : [],
    }
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    const apiCall = this.detailsId
    ? this._course.edit(this.detailsId, params)
    : this._course.create(params);

    apiCall.subscribe(
        response => {
          this.isLoading = false; // Stop loading spinner
          this.__spinner.hide(); // Hide visual spinner
          if (!response.error) {
              this.displayMessage = this.detailsId
                  ? "Details updated successfully."
                  : "Details added successfully.";
              this.__shared.toastSuccess(this.displayMessage);
              this.__route.navigate(['/upcoming-course/upcoming-course-list']);
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
  }

}
