import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '../../../services/take-course/course.service';
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
  addEditForm!: FormGroup;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  getData:any;
  imagePreview: string | null = null;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _takeCourse: CourseService,
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
    if(this.detailsId){
      this.getDetail();
    }
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

   //Intialize Form....................
      createForm()
      {
        this.addEditForm = this.__fb.group({
          title:[''],
          description: [''],
          image: ['']
        });
      }

      //get details............
      getDetail(){
        this._takeCourse.getDetailById(this.detailsId)
          .subscribe((response)=>{
            
            if(response.error == false)
            {
                this.getData = response?.data;
                this.imagePreview =  this.getData?.image ? this.getData?.image : null;
                this.patchData();
                // console.log('app-->', this.titleData );
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
          title: this.getData.title ? this.getData.title : '',
          description: this.getData.description ? this.getData.description : '',
        });
      }

}
