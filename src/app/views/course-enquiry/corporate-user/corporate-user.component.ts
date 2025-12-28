import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnquiryService } from '../../../services/course-enquiry/enquiry.service';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from '../../../services/validator/validation.service';

@Component({
  selector: 'app-corporate-user',
  templateUrl: './corporate-user.component.html',
  styleUrls: ['./corporate-user.component.scss']
})
export class CorporateUserComponent implements OnInit {
  
  addEditForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';
  detailsId:string | null = null;
  isLoading = false;
  getCourseList:any =[];
  loaded_data : boolean = false;
  dropdownSettings_course: any = {};
  users!: FormArray;

  constructor(
    private _product: ProductService,
    private __fb: FormBuilder,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private __enquiry: EnquiryService,
    private __validationService: ValidationService,
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
    this.getList();
    // this.getSanaCourse();
  }

  //Initalize Form......
  createForm()
  {
    this.addEditForm = this.__fb.group({
      courses: [[],[Validators.required]],
      users: this.__fb.array([]),
    });

    this.users = this.addEditForm.get('users') as FormArray;
    this.ensureItem(); // Always ensure one about banner item
  }

  //Getter.....................................................................
  get userControls() {
    return (this.addEditForm.get('users') as FormArray)?.controls || [];
  }

  //Create.............................................................
  createItem() {
    return this.__fb.group({
      first_name: ['',[Validators.required, this.__validationService.noSpace]],
      last_name: ['',[Validators.required, this.__validationService.noSpace]],
      email: ['',[Validators.required,this.__validationService.isEmail]],
      user_type: ['corporate_user']
    });
  }

  //Add....................................................................
  addItem(){
    this.users.push(this.createItem());
  }

  //Remove...................................................................
  removeItem(index: number) {
    this.users.removeAt(index);
    this.ensureItem(); // Ensure at least one item remains
  }

  //Ensure...................................................................
  private ensureItem(): void {
    if (this.users.length === 0) {
      this.addItem();
    }
  }

  getData(){
    this.dropdownSettings_course = {
      singleSelection: false, // Allow multiple selection
      idField: '_id', // Unique identifier for options
      textField: 'course_name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
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

  // //Get sana Course List........
  // getSanaCourse(){
  //   this.isLoading = true;
  //   this.__spinner.show(); // Start visual spinner
  //   this.loaded_data = false;
  //   this._product.getSanaCourseList()
  //   .subscribe((response)=>{
  //     this.isLoading = false;
  //     this.__spinner.hide(); // Start visual spinner
  //     if(response.error == false)
  //     {
  //       this.getCourseList = response?.data?.data;
  //       // console.log("this.getCourseList====",this.getCourseList);
        
  //     }
  //   },
  //   (err)=>{
  //     this.isLoading = false;
  //     this.__spinner.hide(); // Start visual spinner
  //     console.log(err);
  //     if(err.status == 403)
  //         {
  //               this.__shared.sessionExpired();
  //         }
  //   })
  // }


  //List..............
  getList() {
  const params ={
    is_active: true
  }
  this._product.getList(params)
    .subscribe({
      next: (response)=>{
        if(response.error == false)
        {
          this.getCourseList = response?.data?.items;
           console.log("listData.....",this.getCourseList);
        }
      },
      error: (err)=>{
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
      }
    });
  }

  add(){
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    const data: any = this.addEditForm?.value;
    const params: any = {
      courses: data?.courses?.map((course:any) => course._id) || [],
      users: data?.users || []
    }
    if (this.detailsId) {
      params['enquiryId'] = this.detailsId;
    }

    this.__enquiry.createCorporateUser(params).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.__spinner.hide(); // Start visual spinner
        if (!response.error) {
          this.displayMessage = "Data has been saved successfully";
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/enquiry/list']); // Navigate after success (optional)
        } else {
          this.handleError(response.message);
        }
      },
      (err:any) => {
        this.isLoading = false;
        this.__spinner.hide(); // Start visual spinner
        this.handleApiError(err)
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


}
