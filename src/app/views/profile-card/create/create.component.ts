import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../../../services/profile-card/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditorService } from '../../../services/editor/editor.service';
import { CourseService } from '../../../services/category-course/course.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
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
    this.editorConfig = this.editorSettings.editorConfig();
  }

  //Initalize Form......
     createForm()
     {
      this.addEditForm = this.__fb.group({
        title:['',[Validators.required]],
        tag: ['',[Validators.required]],
        descryption:['',[Validators.required]],
        background_color: [''],
        link_url: ['']
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
  
    add() {
      const title = this.addEditForm.get('title')?.value?.trim();
      if (!title) {
        this.__shared.toastError("Please enter title!");
        return;
      }
      const tag = this.addEditForm.get('tag')?.value?.trim();
      if (!tag) {
        this.__shared.toastError("Please enter tag!");
        return;
      }
      const descryption = this.addEditForm.get('descryption')?.value?.trim();
      if (!descryption) {
        this.__shared.toastError("Please enter description!");
        return;
      }
      const data: any = { ...this.addEditForm.value };
      // Ensure color is not empty
      if (!data.color) {
        data.color = '#000000';
      }
      const apiCall = this.detailsId
        ? this.__card.edit(this.detailsId, data)
        : this.__card.create(data);
    
      apiCall.subscribe(
        (response: any) => {
          if (!response.error) {
            this.displayMessage = this.detailsId
              ? 'Data has been updated successfully'
              : 'Data has been saved successfully';
    
            this.__shared.toastSuccess(this.displayMessage);
            this.__route.navigate(['/profile-card/list']);
          } else {
            this.handleError(response.message);
          }
        },
        (err) => this.handleApiError(err)
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
        link_url: this.getDetails.link_url ? this.getDetails.link_url : '',
      });
    }

}
