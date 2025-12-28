import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HospitialitySchoolService } from '../../../../app/services/hospitiality-school/hospitiality-school.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { TitleService } from '../../../../app/services/title/title.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  detailsId:string | null = null;
  viewSchoolForm!: FormGroup;
  getDetails:any;

  constructor(
    private __fb: FormBuilder,
    private _school: HospitialitySchoolService,
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
    this.viewForm();
    this.getDetail();
  }

  viewForm()
  {
    this.viewSchoolForm = this.__fb.group({
      title:[''] 
    });
  }

  //get details............
  getDetail(){
    this._school.getSchoolDetail(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getDetails = response.data?.hospitality;
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
    this.viewSchoolForm.patchValue({
      title: this.getDetails.title ? this.getDetails.title : ''
    });
    // Handle media preview
    const mediaUrl = this.getDetails?.media;
  }

}
