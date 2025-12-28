import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InsightArticleService } from '../../../services/Insight-highlight/insight-article.service';
import { SharedService } from '../../../services/shared/shared.service';
import { PageService } from '../../../services/page/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  viewDetailsForm!: FormGroup
  detailsId: any;
  getDetails: any;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
        private _insights:InsightArticleService,
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
      tag:[''],
      description:[''],
      url:[''], 
    });
  }

  //Get Details.............
  getDetail(){
    this._insights.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getDetails = response.data;
            this.patchData();
            console.log('app-->', this.getDetails );
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
      tag: this.getDetails.tag ? this.getDetails.tag : '',
      description: this.getDetails.description ? this.getDetails.description : '',
      url: this.getDetails.url ? this.getDetails.url : '',
    });
  }

}
