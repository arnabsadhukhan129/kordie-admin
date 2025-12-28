import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CourseService } from '../../../../app/services/category-course/course.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss']
})
export class ViewCategoryComponent implements OnInit {

  viewForm : any;
  categoryId: any;
  categoryData: any;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _category: CourseService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.categoryId = params.get('id');
      },
      error: err => {}
    });
   }

  ngOnInit(): void {
    this.viewDetailsForm();
    this.getDetail();
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  viewDetailsForm()
  {
    this.viewForm = this.__fb.group({
      name:[''],
      slug: [''],
      bannerTitle: [''],
      bannerSubtitle: [''],
      bannerDescription: [''],
      bannerTag: [''],
      link: [''],
      crucialSkillsetTitle: [''],
      productsectionTitle:[''],
      productsectionDescription: [''],
      brandsectionTitle: [''],
      collectionsectionTitle: [''],
      collectionsectionDescription: [''],
      relatedsectionTitle: [''],
      relatedsectionDescription: [''],
      relatedsectionLink: [''],
      socialmediaTitle: [''],
      socialmediaDescription: [''],
      socialmediaLink: [''],
      whylearnTitle: [''],
      faqTitle: [''],
      schoolTitle: ['']
    });
  }

  getDetail(){
    this._category.getDetailById(this.categoryId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.categoryData = response.data;
            this.patchUserData();
            console.log('app-->', this.categoryData );
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

  patchUserData(){
    this.viewForm.patchValue({
      name: this.categoryData.name ? this.categoryData.name : 'N/A',
      slug: this.categoryData.slug ? this.categoryData.slug : 'N/A',
      bannerTitle: this.categoryData.herosection.title ? this.categoryData.herosection.title : 'N/A',
      bannerSubtitle: this.categoryData.herosection.subtitle ? this.categoryData.herosection.subtitle : 'N/A',
      bannerDescription: this.categoryData.herosection.description ? this.categoryData.herosection.description : 'N/A',
      bannerTag: this.categoryData.herosection.tags
      ? this.categoryData.herosection.tags.join(', ')
      : 'N/A',
      link: this.categoryData.herosection.link ? this.categoryData.herosection.link : 'N/A',
      crucialSkillsetTitle: this.categoryData.crucialskillset.title ? this.categoryData.crucialskillset.title : 'N/A',
      productsectionTitle: this.categoryData.productsection.title ? this.categoryData.productsection.title : 'N/A',
      productsectionDescription: this.categoryData.productsection.description ? this.categoryData.productsection.description : 'N/A',
      brandsectionTitle: this.categoryData.brandsection.title ? this.categoryData.brandsection.title : 'N/A',
      collectionsectionTitle: this.categoryData.collectionsection.title ? this.categoryData.collectionsection.title : 'N/A',
      collectionsectionDescription: this.categoryData.collectionsection.description ? this.categoryData.collectionsection.description : 'N/A',
      relatedsectionTitle: this.categoryData.relatedmaterial.title ? this.categoryData.relatedmaterial.title : 'N/A',
      relatedsectionDescription: this.categoryData.relatedmaterial.description ? this.categoryData.relatedmaterial.description : 'N/A',
      relatedsectionLink: this.categoryData.relatedmaterial.link ? this.categoryData.relatedmaterial.link : 'N/A',
      socialmediaTitle: this.categoryData.socialmedia.name ? this.categoryData.socialmedia.name : 'N/A',
      socialmediaDescription: this.categoryData.socialmedia.description ? this.categoryData.socialmedia.description : 'N/A',
      socialmediaLink: this.categoryData.socialmedia.link ? this.categoryData.socialmedia.link : 'N/A',
      whylearnTitle: this.categoryData.whylearn.title ? this.categoryData.whylearn.title : 'N/A',
      faqTitle: this.categoryData.faq.title ? this.categoryData.faq.title : 'N/A',
      schoolTitle: this.categoryData.school.title ? this.categoryData.school.title : 'N/A',
    });
  }

}
