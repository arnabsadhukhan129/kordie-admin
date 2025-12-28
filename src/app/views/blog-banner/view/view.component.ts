import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BlogBannerService } from '../../../services/blog-banner/blog-banner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../../app/services/editor/editor.service';

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
  selectedFile: File | null = null;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private __banner: BlogBannerService,
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
    this.createForm();
    this.getDetail();
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  //Initalize Form......
  createForm()
  {
  this.addEditForm = this.__fb.group({
    title: [''],
    image: [''],
    description: [''],
    linktitlte: ['']
  })
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
      description:  this.getDetails.description ? this.getDetails.description : '',
      linktitlte: this.getDetails.linktitle ? this.getDetails.linktitle : '',
    });
  }

}
