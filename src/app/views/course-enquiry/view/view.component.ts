import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../../services/validator/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../services/shared/shared.service';
import { EnquiryService } from '../../../services/course-enquiry/enquiry.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  addEditForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';
  detailsId:string | null = null;
  getData:any;
  isDisabled: boolean = true;
  
  constructor(
    private __fb: FormBuilder,
    private __enquiry: EnquiryService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
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
    if(this.detailsId){
      this.getDetail();
    }
  }

  //Initalize Form......
  createForm()
  {
    this.addEditForm = this.__fb.group({
      full_name:[''],
      email: [''],
      company: [''],
      messageDetails: [''],
      linkedin: [''],
      totalAmount: [''],
      discount: [''],
      paidAmount: [''],
      amountToBePaid: [''],
      paymentStatus: ['']
    });
  }

  //get details............
  getDetail(){
    this.__enquiry.getDetailById(this.detailsId)
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
      full_name: this.getData.full_name ? this.getData.full_name : '',
      email: this.getData.email ? this.getData.email : '',
      company: this.getData.company ? this.getData.company : '',
      messageDetails: this.getData.messageDetails ? this.getData.messageDetails : '',
      linkedin: this.getData.linkedin ? this.getData.linkedin : '',
      totalAmount: this.getData.totalAmount ? this.getData.totalAmount : '',
      discount: this.getData.discount ? this.getData.discount : '',
      paidAmount: this.getData.paidAmount ? this.getData.paidAmount : '',
      amountToBePaid: this.getData.amountToBePaid ? this.getData.amountToBePaid : '',
      paymentStatus: this.getData.paymentStatus ? this.getData.paymentStatus : '',
    });
  }

}
