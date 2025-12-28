import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { title } from 'process';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { GoalService } from '../../../../app/services/support-your-goal/goal.service';
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
  goalSubscription!: Subscription
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _goal: GoalService,
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
    if(this.goalSubscription){
      this.goalSubscription.unsubscribe();
    }
  }

  //Initalize Form............
  viewForm()
  {
    this.viewDetailsForm = this.__fb.group({
      title:[''],
      image: [''],
      description:[''],
      link:[''], 
    });
  }

  //Get Details...............
  getDetail(){
    this.goalSubscription = this._goal.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getDetails = response?.data?.supportGoal;
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
      title: this.getDetails.title ? this.getDetails.title : '',
      description: this.getDetails.description ? this.getDetails.description : '',
      link: this.getDetails.link ? this.getDetails.link : '',
    });
  }

}
