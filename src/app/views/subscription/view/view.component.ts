import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { SharedService } from '../../../services/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(
    private __fb: FormBuilder,
    private __subscription: SubscriptionService,
    private __route:Router,
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
    if(this.detailsId){
      this.getDetail();
    }
  }

  //Initalize Form......
  createForm()
  {
    this.addEditForm = this.__fb.group({
      plan_name:[''],
      sub_title: [''],
      tag: [''],
      price: [''],
      discount: [''],
      details: [''],
      is_membership: [''],
      special_note: ['']
    });
  }

  processLearnTitle(): void {
    const learnOutcomes = this.addEditForm.get('details')?.value;
  
    if (typeof learnOutcomes === 'string') {
      // It's a string, so we can split
      const outcomesArray = learnOutcomes
        .split(',')
        .map((outcome: string) => outcome.trim())
        .filter((outcome: string) => outcome);
  
      this.addEditForm.patchValue({ details: outcomesArray });
  
      console.log('Processed Learn Outcomes:', outcomesArray);
    } else if (Array.isArray(learnOutcomes)) {
      // It's already an array — maybe we just want to trim each item
      const outcomesArray = learnOutcomes
        .map((outcome: string) => outcome.trim())
        .filter((outcome: string) => outcome);
  
      this.addEditForm.patchValue({ details: outcomesArray });
  
      console.log('Processed Learn Outcomes (array input):', outcomesArray);
    } else {
      console.warn('Unexpected learnOutcomes format:', learnOutcomes);
    }
  }
  

   //get details............
   getDetail(){
    this.__subscription.getDetailById(this.detailsId)
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
      plan_name: this.getData[0].plan_name ? this.getData[0].plan_name : '',
      sub_title: this.getData[0].sub_title ? this.getData[0].sub_title : '',
      tag: this.getData[0].tag ? this.getData[0].tag : '',
      price: this.getData[0].price ? this.getData[0].price : '',
      discount: this.getData[0].discount ? this.getData[0].discount : '',
      details: this.getData[0].details ? this.getData[0].details : '',
      is_membership: this.getData[0].is_membership,
      special_note: this.getData[0].special_note ? this.getData[0].special_note : '',
    });
  }


}
