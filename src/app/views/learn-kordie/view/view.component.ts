import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { LearnKordieService } from '../../../../app/services/learn-kordie/learn-kordie.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  detailsId:string | null = null;
  viewDetailsForm!: FormGroup;
  getDetails:any;
  learnKordoeSubscription!: Subscription;
  getDescription:string = '';
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _learnkordie: LearnKordieService,
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

  ngOnDestroy(): void {
    if(this.learnKordoeSubscription){
      this.learnKordoeSubscription.unsubscribe();
    }
  }

  viewForm()
  {
    this.viewDetailsForm = this.__fb.group({
      title:[''],
      description: [''] 
    });
  }

  //get details............
  getDetail(){
    this.learnKordoeSubscription = this._learnkordie.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.success == true)
        {
            this.getDetails = response?.data;
            this.getDescription = response.data.body;
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
      title: this.getDetails.title || '',
      description: '',
    });
    setTimeout(() => {
      this.viewDetailsForm.patchValue({
        description: this.getDetails.body || '' // Patch the description after CKEditor is ready
      });
    }, 100); // Delay slightly
    // Handle media preview
    const mediaUrl = this.getDetails?.media;
  }

  onEditorReady(event: any): void {
    console.log('CKEditor is ready!');
    // Optionally, patch the description value here
    this.viewDetailsForm.patchValue({
      description: this.getDescription || '',
    });
  }

}
