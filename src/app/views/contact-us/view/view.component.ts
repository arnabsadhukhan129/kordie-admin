import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageService } from '../../../services/page/page.service';
import { ValidationService } from '../../../services/validator/validation.service';
import { ContactUsService } from '../../../services/contact-us/contact-us.service';
import { Subscription } from 'rxjs';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  isLoading = false;
  getData: any;
  typesubscription!: Subscription;
  getTypeData: any
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _contact: ContactUsService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private _pageService:PageService,
    private __validationService: ValidationService,
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
    this.getType();
    if(this.detailsId){
      this.getDetail();
    }
    this.editorConfig = this.editorSettings.viewEditorConfig();
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
  
    createForm()
      {
        this.addEditForm = this.__fb.group({
          title: [''],
          subtitle: [''],
          description: [''],
          email: [''],
          type: [''],
        });
      }
  
    //For course type details.......
    getType(){
      const params = {
        active: true
      }
      this.typesubscription = this._contact.getType(params)
      .subscribe((response)=>{
        if(response.error == false)
        {
          this.getTypeData = response?.data;
          // console.log("typeList.....",this.getTypeData);
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

     //get details............
  getDetail(){
    this._contact.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response?.data;
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
      title: this.getData.title  || '',
      subtitle: this.getData.subtitle || '',
      description: this.getData.description || '',
      email: this.getData.email || '',
      type: this.getData.type || '',
    });
  }

}
