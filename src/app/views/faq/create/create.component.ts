import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FaqService } from '../../../services/faq/faq.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageService } from '../../../services/page/page.service';
import { ValidationService } from '../../../services/validator/validation.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  isLoading = false;
  getData: any;
  faqList: any[] = []; // Initialize as an empty array
  dropdownSettings_faq = {
    singleSelection: false,
    idField: '_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true // Enable search for better UX
  };
  selectedFaqs: any = [];

  constructor(
    private __fb: FormBuilder,
    private _faq: FaqService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private _pageService:PageService,
    private __validationService: ValidationService
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
    setTimeout(() => {
      this.dropdownSettings_faq = {
        singleSelection: false,
        idField: '_id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
  
      this.faqList = [
        { _id: 'category', name: 'Category' },
        { _id: 'product', name: 'Product' },
        { _id: 'exclusive_program', name: 'Exclusive Program' }
      ];    
    }, 0);
    
      if (this.detailsId) {
        this.getDetail();
      }
  }
  

  createForm()
  {
    this.addEditForm = this.__fb.group({
      question: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
      answer: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
      faq_type: [[],[Validators.required]]
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
        ? this._faq.edit(this.detailsId, formData)
        : this._faq.create(formData);

    apiCall.subscribe(
        response => {
            this.isLoading = false; // Stop loading spinner
            if (!response.error) {
                this.displayMessage = this.detailsId
                    ? "Details updated successfully."
                    : "Details added successfully.";
                    this.__shared.toastSuccess(this.displayMessage);
                this.__route.navigate(['/faq/list']);
            } else {
                this.errorMessage = response.message;
                this.__shared.toastError(this.errorMessage);
                this.__shared.toastError(this.errorMessage);
            }
        },
        error => {
            this.isLoading = false; // Stop loading spinner
            this.errorMessage = "Question already exists.";
        }
    );
  }
      
  //get details............
  getDetail(){
    this._faq.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response.data;
            this.selectedFaqs = this.getData?.faq_type
              ?.map((id: string) => this.faqList.find((faq: any) => faq?._id === id))
              .filter((item: any) => item); // Transform IDs to objects
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
      question: this.getData.question ? this.getData.question : '',
      answer: this.getData.answer ? this.getData.answer : '',
      faq_type: this.selectedFaqs || [],
    });
  }

}
