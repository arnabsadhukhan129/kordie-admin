import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { title } from 'process';
import { HighEndGranularService } from '../../../../app/services/high-end-granular/high-end-granular.service';
import { PageService } from '../../../../app/services/page/page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
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
  getDescription:string = '';
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _granular: HighEndGranularService,
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
      image: [''],
      description:[''],
      // link:[''], 
    });
  }

  //Get Details.............
  getDetail(){
    this._granular.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getDetails = response.data?.delivery;
            this.getDescription = response.data?.delivery?.description;
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
      description: '',
      // link: this.getDetails.link ? this.getDetails.link : '',
    });
    setTimeout(() => {
      this.viewDetailsForm.patchValue({
        description: this.getDetails.description || '' // Patch the description after CKEditor is ready
      });
    }, 100);
  }

  onEditorReady(event: any): void {
    // console.log('CKEditor is ready!');
    // Optionally, patch the description value here
    this.viewDetailsForm.patchValue({
      description: this.getDescription || '',
    });
  }

}
