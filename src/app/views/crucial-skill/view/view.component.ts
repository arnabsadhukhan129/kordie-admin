import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillService } from '../../../services/crucial-skill/skill.service';
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
  detailsId:string | null = null;
  getDetails:any;
  addEditForm!: FormGroup;
  stats!: FormArray;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  selectedFile: File | null = null;
  mediaType:string = '';
  editorConfig: any;
  isDisabled = true;
  isLoading = false;
  listData: any;

  constructor(
    private __fb: FormBuilder,
    private __skill: SkillService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService,
     private __category: CourseService,
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('key');
      },
      error: err => {}
    });
   }

  ngOnInit(): void {
    this.createForm();
    this.getCategoryList();
    this.getDetail();
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

    //Initalize Form......
     createForm()
     {
      this.addEditForm = this.__fb.group({
        title:[''],
        type: [''],
        media: [''],
        description:[''],
        stats: this.__fb.array([this.createteStatsItem()]),
        category_id: ['']
      });
      this.stats = this.addEditForm.get('stats') as FormArray;
     }
  
     get statsControls() {
      return (this.addEditForm.get('stats') as FormArray).controls;
    }

     // Create a new stats item form group
    createteStatsItem() {
      return this.__fb.group({
        percentage: [0],
        text: ['']
      });
    }

    //patch Details..........
  getDetail() {
    this.__skill.getDetailById(this.detailsId).subscribe((response: any) => {
      if (response.error == false) {
        this.getDetails = response?.data;
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
      description: this.getDetails.description ? this.getDetails.description : '',
      type: this.getDetails.type ? this.getDetails.type : '',
      category_id: this.getDetails.category_id ? this.getDetails.category_id : '',
    });
    // Handle media preview
    const mediaUrl = this.getDetails?.media;
    if (mediaUrl) {
      if (this.getDetails.type === 'image') {
        this.imagePreview = mediaUrl; // Set the preview URL for images
        this.mediaType = 'image'; // Set the media type to image
      } else if (this.getDetails.type === 'video') {
        this.videoPreview = mediaUrl; // Set the preview URL for videos
        this.mediaType = 'video'; // Set the media type to video
      }
    }
     // Handle `course_impact_testinomial` FormArray
     const statsArray = this.addEditForm.get('stats') as FormArray;
     statsArray.clear(); // Clear existing controls
    if (this.getDetails?.stats
      ) {
      this.getDetails.stats
      .forEach((stats: any) => {
        statsArray.push(
          this.__fb.group({
            percentage: [stats?.percentage || 0],
            text: [stats?.text || ''],
          })
        );
      });
    }
  }

    //Course category List..............
    getCategoryList() {
      const params = {
        active: true
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
