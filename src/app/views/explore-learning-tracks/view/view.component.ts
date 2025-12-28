import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LearningTrackService } from '../../../../app/services/learning-track/learning-track.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  detailsId:string | null = null;
  viewDetailsForm!: FormGroup;
  trackingData:any;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _track: LearningTrackService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService
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
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  //Initalize Form............
  viewForm()
  {
    this.viewDetailsForm = this.__fb.group({
      name:[''],
      image: [''],
      description:[''],
      link:[''], 
    });
  }

  //Get Details...............
  getDetail(){
    this._track.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.trackingData = response?.data;
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

  //Patch Data................
  patchData(){
    this.viewDetailsForm.patchValue({
      name: this.trackingData.name ? this.trackingData.name : '',
      description: this.trackingData.description ? this.trackingData.description : '',
      link: this.trackingData.link ? this.trackingData.link : '',
    });
  }

}
