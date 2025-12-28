import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LearnService } from '../../../services/learn-kordie-hub/learn.service';
import { EditorService } from '../../../../app/services/editor/editor.service';
import { CourseService } from '../../../services/category-course/course.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  addEditForm:any
  displayMessage : string = '';
  errorMessage : string = '';
  imagePreview: string | null = null;
  iconPreview: string | null = null;
  selectedFile: File | null = null;
  iconSelectedFile: File | null = null;
  filename:any;
  mediaType:string = '';
  detailsId:string | null = null;
  getDetails:any;
  isLoading = false;
  editorConfig: any;
  listData:any;

  constructor(
    private __fb: FormBuilder,
    private _learnkordie: LearnService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService,
    private __category: CourseService,
    
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
    this.getCategoryList();
    if(this.detailsId){
      this.getDetail();
    }
    this.editorConfig = this.editorSettings.editorConfig();
  }

  createForm()
    {
      this.addEditForm = this.__fb.group({
        title:['',[Validators.required]],
        image: [''],
        icon: [''],
        description: ['',[Validators.required]],
        category_id: ['',[Validators.required]]
      });
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
  
    add(){
      const data: any = this.addEditForm.value;
      
      if (!this.selectedFile && !this.getDetails?.image) {
        this.__shared.toastError('Please upload image');
        return;
      }
      if (!this.iconSelectedFile && !this.getDetails?.icon) {
        this.__shared.toastError('Please upload icon');
        return;
      }
      const formData = new FormData();
    
      // Append form data fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      // Check if a new image file is selected
      if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Add the selected file
      } else if (this.getDetails?.image && !this.detailsId) {
        formData.append('image', this.getDetails.image); // Add existing image only when editing
      }

      // Check if a new image file is selected
      if (this.iconSelectedFile) {
      formData.append('icon', this.iconSelectedFile); // Add the selected file
      } else if (this.getDetails?.icon && !this.detailsId) {
        formData.append('icon', this.getDetails.icon); // Add existing image only when editing
      }
      formData.append('category_id',data?.category_id);

      // Show loader
      this.isLoading = true;
      this.__spinner.show(); // Start visual spinner

      // Make the API call
      const apiCall = this.detailsId
        ? this._learnkordie.edit(this.detailsId, formData) // Edit existing title
        : this._learnkordie.create(formData); // Create new title
  
      apiCall.subscribe(
        (response: any) => {
          this.isLoading = false; // Stop loading spinner
            this.__spinner.hide(); // Hide visual spinner
          if (!response.error) {
            this.displayMessage = this.detailsId
              ? "Data has been updated successfully"
              : "Data has been saved successfully";
    
            this.__shared.toastSuccess(this.displayMessage);
            this.__route.navigate(['/learn-with-kordie/list']); // Navigate after success (optional)
          } else {
            this.handleError(response.message);
          }
        },
        (err) => {
          this.isLoading = false; // Stop loading spinner
          this.__spinner.hide(); // Hide visual spinner
          this.handleApiError(err);
        }
      );
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
  
    onImageSelected(event: Event, type: string): void {
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
        if(type === 'image'){
          this.selectedFile = file;
        }
        else if(type === 'icon'){
          this.iconSelectedFile = file;
        }
    
        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          if(type === 'image'){
            this.imagePreview = reader.result as string;
          }
          else if(type === 'icon'){
            this.iconPreview = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    }

  
     //get details............
     getDetail(){
      this._learnkordie.getDetailById(this.detailsId)
        .subscribe((response)=>{
          
          if(response.error == false)
          {
              this.getDetails = response.data;
              this.imagePreview =  this.getDetails?.image ? this.getDetails?.image : null;
              this.iconPreview =  this.getDetails?.icon ? this.getDetails?.icon : null;
              this.patchData();
          }
          else{
            this.__shared.toastError(response.message);
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
  
    patchData(){
      this.addEditForm.patchValue({
        title: this.getDetails.title ? this.getDetails.title : '',
        description: this.getDetails.description ? this.getDetails.description : '',
        category_id: this.getDetails.category_id ? this.getDetails.category_id : '',
      });
    }



  //Course category List..............
  getCategoryList() {
    const params = {
      active: true
    }
    this.isLoading = true; // Stop loading spinner
    this.__spinner.show();
    this.__category.getList(params)
      .subscribe((response)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide();
        if(response.error == false)
        {
          this.listData = response?.data?.category;
          // console.log("listData0000========",this.listData);
        }
      },
      (err)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide();
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
      })
  }

}
