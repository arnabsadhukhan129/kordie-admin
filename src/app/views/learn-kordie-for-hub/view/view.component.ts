import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LearnService } from '../../../services/learn-kordie-hub/learn.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../../app/services/editor/editor.service';
import { CourseService } from '../../../services/category-course/course.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  addEditForm:any
  displayMessage : string = '';
  errorMessage : string = '';
  imagePreview: string | null = null;
  iconPreview: string | null = null;
  selectedFile: File | null = null;
  iconSelectedFile: File | null = null;
  filename:any;
  mediaType:string = '';
  detailsId:string | null = null;
  getDetails:any;
  isLoading = false;
  editorConfig: any;
  listData: any;
  isDisabled = true;

  constructor(
    private __fb: FormBuilder,
    private _learnkordie: LearnService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService,
    private __category: CourseService,
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
    this.getCategoryList();
    if(this.detailsId){
      this.getDetail();
    }
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      title:[''],
      image: [''],
      icon: [''],
      description: [''],
      category_id: ['']
    });
  }

  //get details............
  getDetail(){
    this._learnkordie.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getDetails = response.data;
            this.imagePreview =  this.getDetails?.image ? this.getDetails?.image : 'assets/kordie-admin-image/no-image-found-01.png';
            this.iconPreview =  this.getDetails?.icon ? this.getDetails?.icon : 'assets/kordie-admin-image/no-image-found-01.png';
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
    this.addEditForm.patchValue({
      title: this.getDetails.title ? this.getDetails.title : '',
      description: this.getDetails.description ? this.getDetails.description : '',
      category_id: this.getDetails.category_id ? this.getDetails.category_id : '',
    });
  }

  //Course category List..............
  getCategoryList() {
    const params = {
      is_active: true
    }
    this.isLoading = true; // Stop loading spinner
    this.__spinner.show();
    this.__category.getList(params)
      .subscribe((response)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide();
        if(response.error == false)
        {
          this.listData = response?.data?.category;
          // console.log("listData0000========",this.listData);
        }
      },
      (err)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide();
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
      })
  }

}
