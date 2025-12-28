import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageService } from '../../../../app/services/page/page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { StudentSpeakService } from '../../../../app/services/student-speak-us/student-speak.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  speakSubscription!: Subscription;
  viewDetailsForm!: FormGroup;
  detailsId: any;
  getDetails: any;


  constructor(
    private _speak:StudentSpeakService,
    private __fb: FormBuilder,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
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
    this.viewForm();
    this.getDetail();
  }

  ngOnDestroy(): void {
    if(this.speakSubscription){
      this.speakSubscription.unsubscribe();
    }
  }

  viewForm()
  {
    this.viewDetailsForm = this.__fb.group({
      name:[''],
      image: [''],
      designation:[''],
      feedback:[''], 
    });
  }

  //Get Details.............
  getDetail(){
    this.speakSubscription = this._speak.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getDetails = response?.data;
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
    this.viewDetailsForm.patchValue({
      name: this.getDetails.name ? this.getDetails.name : '',
      designation: this.getDetails.designation ? this.getDetails.designation : '',
      feedback: this.getDetails.feedback ? this.getDetails.feedback : '',
    });
  }
}
