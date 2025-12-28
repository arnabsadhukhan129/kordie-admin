import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../../../services/profile-card/card.service';
import { SharedService } from '../../../services/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../services/editor/editor.service';
import { CourseService } from '../../../services/category-course/course.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  displayMessage : string = '';
  errorMessage : string = '';
  addEditForm!: FormGroup;
  detailsId:string | null = null;
  getDetails:any;
  editorConfig: any;
  isLoading = false;
  listData:any;

  constructor(
    private __fb: FormBuilder,
    private __card: CardService,
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
    if(this.detailsId){
      this.getDetail();
    }
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  //Initalize Form......
  createForm()
  {
  this.addEditForm = this.__fb.group({
    title:[''],
    tag: [''],
    descryption:[''],
    background_color: [''],
    link_url: ['']
  });
  }

  //patch Details..........
  getDetail() {
    this.__card.getDetailById(this.detailsId).subscribe((response: any) => {
      if (response.success == true) {
        this.getDetails = response?.data;
        this.patchData();
        console.log("getDetails=====",this.getDetails);
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
      tag: this.getDetails.tag ? this.getDetails.tag : '',
      descryption: this.getDetails.descryption ? this.getDetails.descryption : '',
      background_color: this.getDetails.background_color ? this.getDetails.background_color : '#000000',
      link_url: this.getDetails.link_url ? this.getDetails.link_url : 'N/A',
    });
  }

}
