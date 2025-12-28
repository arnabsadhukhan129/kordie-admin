import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { title } from 'process';
import { Subscription } from 'rxjs';
import { PageService } from '../../../../app/services/page/page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { WeTrustedService } from '../../../../app/services/we-trusted/we-trusted.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  trustedSubscription!: Subscription
  viewDetailsForm!: FormGroup
  detailsId: any;
  getDetails: any;
  editorConfig: any;

  constructor(
    private _trusted:WeTrustedService,
    private __fb: FormBuilder,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
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

  viewForm()
  {
    this.viewDetailsForm = this.__fb.group({
      title:[''],
      icon: [''],
      description:[''],
    });
  }

  //Get Details.............
  getDetail(){
    this.trustedSubscription= this._trusted.getDetailById(this.detailsId)
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
      title: this.getDetails.title ? this.getDetails.title : '',
      description: this.getDetails.description ? this.getDetails.description : ''
    });
  }

}
