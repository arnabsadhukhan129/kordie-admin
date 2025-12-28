import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogCategoryService } from '../../../../app/services/blog-category/blog-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageService } from '../../../../app/services/page/page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../../../app/services/shared/shared.service';

@Component({
  selector: 'app-create-edit-blog-category',
  templateUrl: './create-edit-blog-category.component.html',
  styleUrls: ['./create-edit-blog-category.component.scss']
})
export class CreateEditBlogCategoryComponent implements OnInit {

  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  isLoading = false;
  getData: any;

  constructor(
    private _blog_category: BlogCategoryService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private __activatedRoute:ActivatedRoute,
    private __fb: FormBuilder,
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
    if(this.detailsId){
      this.getDetail();
    }
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      name:['',[Validators.required]],
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

  add(): void {
    if (this.addEditForm.invalid) {
        return;
    }

    this.isLoading = true; // Start loading spinner
    const formData = this.addEditForm.value;

    const apiCall = this.detailsId
        ? this._blog_category.edit(this.detailsId, formData)
        : this._blog_category.create(formData);

    apiCall.subscribe(
        response => {
            this.isLoading = false; // Stop loading spinner
            if (!response.error) {
                this.displayMessage = this.detailsId
                    ? "Details updated successfully."
                    : "Details created successfully.";
                this.__shared.toastSuccess(this.displayMessage);
                this.__route.navigate(['/blog-category/blog-list']);
            } else {
                
                this.errorMessage = response.message;
                this.__shared.toastError(this.errorMessage);
            }
        },
        error => {
            this.isLoading = false; // Stop loading spinner
            this.errorMessage = error.error.message;
            this.__shared.toastError(this.errorMessage);
        }
    );
  }

  //get details............
  getDetail(){
    this._blog_category.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response.data;
            this.patchData();
            // console.log('app-->', this.titleData );
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
      name: this.getData.name ? this.getData.name : '',
    });
  }

}
