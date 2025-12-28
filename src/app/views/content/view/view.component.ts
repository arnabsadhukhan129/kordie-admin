import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ContentServiceService } from '../../../services/content-management/content-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageService } from '../../../services/page/page.service';
import { ValidationService } from '../../../services/validator/validation.service';
import { ProductService } from '../../../services/product/product.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  addEditForm!: FormGroup;
  sections!: FormArray;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  detailsId:string | null = null;
  selectedFile: File | null = null;
  videoSelectedFile: File | null = null;
  imageUrl: string = '';
  videoUrl: string = '';
  isLoading = false;
  getData:any;
  editorConfig: any;
  isEditorVisible = false;

  constructor(
    private __fb: FormBuilder,
    private _content: ContentServiceService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private _pageService:PageService,
    private __validationService: ValidationService,
    private _product: ProductService,
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
      // console.log(this.detailsId);
      this.getDetail();
    }
    // Delay CKEditor initialization
    setTimeout(() => {
      this.isEditorVisible = true;
    }, 500); 
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  //Initalize Form......
    createForm()
    {
    this.addEditForm = this.__fb.group({
      title:[''],
      url: [''],
      body: [''],
      meta_title: [''],
      meta_description: [''],
      meta_keywords: [[]],
      images: [''],
      videos: [''],
      sections: this.__fb.array([this.createteSectionItem()]),
    });
    this.sections = this.addEditForm.get('sections') as FormArray;
    }

    get sectionControls() {
    return (this.addEditForm.get('sections') as FormArray).controls;
  }
  
  // Create a new stats item form group
    createteSectionItem() {
    return this.__fb.group({
      title: [''],
      content: ['']
    });
  }

  //get details............
   getDetail(){
    this._content.getDetailById(this.detailsId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.getData = response?.data;
            this.imagePreview =  this.getData?.images ? this.getData?.images[0] : [];
            this.videoPreview =  this.getData?.videos ? this.getData?.videos[0] : [];
            this.patchData();
            // console.log('app-->', this.getData );
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
      url: this.getData.url  || '',
      body: this.getData.body  || '',
      meta_title: this.getData?.meta?.title  || '',
      meta_description: this.getData?.meta?.description  || '',
      meta_keywords: this.getData?.meta?.keywords?.join(', ') || '',
      
    });
    const sectionsArray = this.addEditForm.get('sections') as FormArray;
    sectionsArray.clear(); // Clear existing sections
    if (this.getData?.sections?.length) {
      this.getData.sections.forEach((val: any) => {
        sectionsArray.push(
          this.__fb.group({
            title: [val.title || ''],
            content: [val.content || '']
          })
        );
      });
    }
    else{
      this.addSectionItem();
    }
  }


  //add stats item...........
  addSectionItem() {
    const sectionItem = this.__fb.group({
      title: [''],
      content: ['']
    });

    this.sections.push(sectionItem);
  }

}
