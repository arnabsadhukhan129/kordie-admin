import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BannerService } from '../../../services/contact-banner/banner.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  detailsId:string | null = null;
  getDetails:any;
  addEditForm!: FormGroup;
  stats!: FormArray;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  selectedFile: File | null = null;
  mediaType:string = '';
  
  constructor(
      private __fb: FormBuilder,
      private __banner: BannerService,
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
    this.getDetail();
  }

  //Initalize Form......
      createForm()
      {
      this.addEditForm = this.__fb.group({
        title: [''],
        image: [''],
        stats: this.__fb.array([this.createteStatsItem()]),
      });
      this.stats = this.addEditForm.get('stats') as FormArray;
      }
  
      get statsControls() {
      return (this.addEditForm.get('stats') as FormArray).controls;
    }

    // Create a new stats item form group
    createteStatsItem() {
      return this.__fb.group({
        title: [''],
        link: ['']
      });
    }

    //patch Details..........
  getDetail() {
    this.__banner.getDetailById(this.detailsId).subscribe((response: any) => {
      if (response.error == false) {
        this.getDetails = response?.data;
        this.imagePreview = this.getDetails?.image || null;
        this.patchData();
      } else {
        this.__shared.toastError(response.message);
      }
    }, (err) => {
      console.log(err);
      if (err.status == 403) {
        this.__shared.sessionExpired();
      }
    });
  }

  patchData(){
    this.addEditForm.patchValue({
      title: this.getDetails.title ? this.getDetails.title : '',
    });
    // Handle course_impact_testinomial FormArray
     const statsArray = this.addEditForm.get('stats') as FormArray;
     statsArray.clear(); // Clear existing controls
      if (this.getDetails?.stats
      ) {
      this.getDetails.stats
      .forEach((stats: any) => {
        statsArray.push(
          this.__fb.group({
            title: [stats?.title || ''],
            link: [stats?.link || ''],
          })
        );
      });
    }
  }

}
