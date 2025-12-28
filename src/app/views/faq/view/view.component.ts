import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FaqService } from '../../../services/faq/faq.service';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
 
  addEditForm!: FormGroup;
  detailsId:string | null = null;
  getData: any;
  isLoading = false;
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
  isDisabled= true;

  constructor(
    private __fb: FormBuilder,
     private _faq: FaqService,
     private __shared:SharedService,
     private __spinner: NgxSpinnerService,
     private __activatedRoute:ActivatedRoute,
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
    if(this.detailsId){
      this.getDetail();
    }
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      question: [''],
      answer: [''],
      faq_type: [[]]
    });
  }

    
  //get details............
  getDetail(){
    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._faq.getDetailById(this.detailsId)
      .subscribe((response)=>{
        this.isLoading = false;
        this.__spinner.hide(); 

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
        this.isLoading = false;
        this.__spinner.hide(); 

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
