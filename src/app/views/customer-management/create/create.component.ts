import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from '../../../../app/services/customer-management/customer.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { ValidationService } from '../../../../app/services/validator/validation.service';
import { ProductService } from '../../../services/product/product.service';
import { SubscriptionService } from '../../../services/subscription/subscription.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  addEditForm!: FormGroup;
  displayMessage: string = '';
  errorMessage: string = '';
  detailsId: string | null = null;
  getData: any;
  courseList: any;
  subscriptionList:any;
  customerList:any;
  loaded_data : boolean = false;
  dropdownSettings_course: any = {};
  originalCourseList:any

  constructor(
    private __fb: FormBuilder,
    private __customer: CustomerService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private __validationService: ValidationService,
    private _product: ProductService,
    private _subscription: SubscriptionService,
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
    this.getMultipleData();
    if(this.detailsId){
      this.getDetail();
    }
  }

  getMultipleData(){
    this.getCourse();
    this.getSubscriptionList();
    this.getnonCustomerList();
    this.dropdownSettings_course = {
      singleSelection: false, // Allow multiple selection
      idField: 'course_id', // Unique identifier for options
      textField: 'course_name', // Display field
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, // Limit the number of selected items shown
      allowSearchFilter: true // Enable search
    };
  }

  //Initalize Form......
      createForm()
      {
        this.addEditForm = this.__fb.group({
          courses: [[]],
          subcription_plan: [''],
          customer_id: [''],
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
    
      //Save Data..................
      add() {
        const data: any = this.addEditForm.value;
        const isCoursesEmpty = !data.courses || data.courses.length === 0;
        const isSubscriptionEmpty = !data.subcription_plan;
      
        let subscriptionData: any = null;
      
        if (!isSubscriptionEmpty) {
          try {
            subscriptionData = JSON.parse(data.subcription_plan);
          } catch (e) {
            this.__shared.toastError("Invalid subscription plan data!");
            return;
          }
        }
      
        if (!data.customer_id) {
          this.__shared.toastError("Please Select customer!");
          return;
        }
      
        if (isCoursesEmpty && isSubscriptionEmpty) {
          this.__shared.toastError("Please select either courses or a subscription plan!");
          return;
        }
      
        const params: any = {
          customer_id: this.detailsId || data.customer_id || '',
          session_id: '',
          status: 'success',
          product_name: subscriptionData?.product_name || '',
          subcription_plan_id: subscriptionData?.subcription_plan_id || '',
          courses: data?.courses || [],
          price: 0,
          discount_amount: 0,
          paid_amount: 0,
          payment_method_type: 'Made by Super-Admin',
        };
      
        const apiCall = this.detailsId
          ? this.__customer.edit(this.detailsId, params)
          : this.__customer.create(params);
      
        apiCall.subscribe(
          (response: any) => {
            if (!response.error) {
              this.__shared.toastSuccess("Data has been updated successfully");
              this.__route.navigate(['/customer-management/list']);
            } else {
              this.handleError(response.message);
            }
          },
          (err: any) => this.handleApiError(err)
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
    
       //get details............
       getDetail(){
        this.__customer.getDetailById(this.detailsId)
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
          first_name: this.getData.first_name ? this.getData.first_name : '',
          last_name: this.getData.last_name ? this.getData.last_name : '',
          email: this.getData.email ? this.getData.email : '',
          phone: this.getData.phone ? this.getData.phone : '',
        });
      }

  //For course details.......
  getCourse(){
    const params = {}
    this.loaded_data = false;
    this._product.getList(params)
    .subscribe({
      next: (response)=>{
        if(response.error == false)
        {
          this.originalCourseList = response?.data?.items;
          this.courseList = this.originalCourseList.map((course:any) => ({
            ...course,
            course_id: course._id,
            course_name: this.stripHtml(course.course_name)
          }));
          // console.log("listData.....",this.courseList);
          this.loaded_data = true;
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

  stripHtml(text: string): string {
    return text.replace(/<[^>]*>/g, '');
  }

  //For Subscription Details..................
  getSubscriptionList() {
    const params = {}
    this.loaded_data = false;

    this._subscription.getList(params)
        .subscribe(
            (response) => {
                if (!response.error) {
                    this.subscriptionList = response?.data?.data;
                    // console.log("subscriptionList====",this.subscriptionList);
                    
                    this.loaded_data = true;
                }
            },
            (err) => {
                console.log(err);
                if (err.status === 403) {
                    this.__shared.sessionExpired();
                }
            }
        );
  } 

  //For non Customer List......
  getnonCustomerList() {
    const params = {}
    this.loaded_data = false;

    this.__customer.getnonCustomer(params)
        .subscribe(
            (response) => {
                if (!response.error) {
                    this.customerList = response?.data;
                    // console.log("customerList====",this.customerList);
                    
                    this.loaded_data = true;
                }
            },
            (err) => {
                console.log(err);
                if (err.status === 403) {
                    this.__shared.sessionExpired();
                }
            }
        );
  }

  getSubsValue(getSubs:any){
    return JSON.stringify({
      product_name: getSubs.plan_name,
      subcription_plan_id: getSubs._id
    });
  }
}
