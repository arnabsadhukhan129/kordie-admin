import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactUsService } from '../../../services/contact-us/contact-us.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageService } from '../../../services/page/page.service';
import { ValidationService } from '../../../services/validator/validation.service';
import { Subscription } from 'rxjs';
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
  selectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  isLoading = false;
  getData: any;
  typesubscription!: Subscription;
  getTypeData: any;
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
    this.editorConfig = this.editorSettings.editorConfig();
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
        title: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
        subtitle: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
        description: ['',[Validators.required,this.__validationService.isEmpty]],
        email: ['',[Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace, this.__validationService.isEmail]],
        type: ['',[Validators.required]],
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

  add(): void {
    if (this.addEditForm.invalid) {
        return;
    }

    this.isLoading = true; // Start loading spinner
    const formData = this.addEditForm.value;

    const apiCall = this.detailsId
        ? this._contact.edit(this.detailsId, formData)
        : this._contact.create(formData);

    apiCall.subscribe(
        response => {
            this.isLoading = false; // Stop loading spinner
            if (!response.error) {
                this.displayMessage = this.detailsId
                    ? "Details updated successfully."
                    : "Details added successfully.";
                this.__route.navigate(['/contact-us/list']);
                this.__shared.toastSuccess(this.displayMessage);
            } else {
                this.errorMessage = response.message;
                this.__shared.toastError(this.errorMessage);
            }
        },
        error => {
            this.isLoading = false; // Stop loading spinner
            this.errorMessage = "An error occurred.";
            this.__shared.toastError(this.errorMessage);
        }
    );
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
