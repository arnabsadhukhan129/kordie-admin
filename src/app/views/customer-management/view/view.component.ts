import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from 'src/app/services/customer-management/customer.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ValidationService } from 'src/app/services/validator/validation.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  addEditForm!: FormGroup;
  displayMessage: string = '';
  errorMessage: string = '';
  detailsId: string | null = null;
  getData: any;

  constructor(
    private __fb: FormBuilder,
    private __customer: CustomerService,
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
      first_name:[''],
      last_name: [''],
      email:[''],
      phone: [''],
    });
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

}
