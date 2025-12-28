import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsightArticleService } from '../../../services/Insight-highlight/insight-article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  getData:any;
  isLoading = false;
  editorConfig: any;

  constructor(
        private __fb: FormBuilder,
        private _insights:InsightArticleService,
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
    this.editorConfig = this.editorSettings.editorConfig();
  }

  createForm()
    {
      this.addEditForm = this.__fb.group({
        title:['',[Validators.required]],
        description: ['',[Validators.required]],
        tag: ['',[Validators.required]],
        url:['']
      });
    }
  
    checkMessage() {
      if (this.displayMessage != '') {
        setTimeout(() => {
          this.displayMessage = '';
  
        }, 2000);
  
        return true;
      }
      else if (this.errorMessage != '') {
        setTimeout(() => {
          this.errorMessage = '';
  
        }, 2000);
  
        return true;
      }
      else {
        return false;
      }
    }
  
    add(): void {
      if (this.addEditForm.invalid) {
          return;
      }
  
      this.isLoading = true; // Start loading spinner
      const formData = this.addEditForm.value;
  
      const apiCall = this.detailsId
          ? this._insights.edit(this.detailsId, formData)
          : this._insights.create(formData);
  
      apiCall.subscribe(
          response => {
              this.isLoading = false; // Stop loading spinner
              if (!response.error) {
                  this.displayMessage = this.detailsId
                      ? "Details updated successfully."
                      : "Details added successfully.";
                  this.__route.navigate(['/section-title-mangement/insights-highlights/list']);
              } else {
                  this.errorMessage = response.message;
              }
          },
          error => {
              this.isLoading = false; // Stop loading spinner
              this.errorMessage = "An error occurred.";
          }
      );
  }
    
    
    
    // Common error handler for API responses
    private handleError(message: string): void {
      this.errorMessage = message;
      this.__shared.toastError(this.errorMessage);
    }
    
    // Common API error handler
    private handleApiError(err: any): void {
      this.errorMessage = err.error?.message || "An error occurred";
    
      if (err.status === 403) {
        this.__shared.sessionExpired();
      } else {
        this.__shared.toastError(this.errorMessage);
      }
    }
    
    //get details............
    getDetail(){
      this._insights.getDetailById(this.detailsId)
        .subscribe((response)=>{
          
          if(response.error == false)
          {
              this.getData = response.data;
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
        tag: this.getData.tag ? this.getData.tag : '',
        description: this.getData.description ? this.getData.description : '',
        url: this.getData.url ? this.getData.url : '',
      });
    }

}
