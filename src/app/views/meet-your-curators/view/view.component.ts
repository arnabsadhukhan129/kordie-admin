import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CuratorsService } from '../../../../app/services/meet-your-curators/curators.service';
import { PageService } from '../../../../app/services/page/page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  cutaorSubscription!: Subscription;
  viewDetailsForm!: FormGroup
  detailsId: any;
  getDetails: any;

  constructor(
    private _cutaors: CuratorsService,
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
    if(this.cutaorSubscription){
      this.cutaorSubscription.unsubscribe();
    }
  }

  viewForm()
  {
    this.viewDetailsForm = this.__fb.group({
      name:[''],
      image: [''],
      desgination:[''],
      at:[''], 
    });
  }

  //Get Details.............
  getDetail(){
    this.cutaorSubscription= this._cutaors.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.success == true)
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
      desgination: this.getDetails.desgination ? this.getDetails.desgination : '',
      at: this.getDetails.at ? this.getDetails.at : '',
    });
  }

}
