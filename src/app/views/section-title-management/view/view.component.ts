import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { TitleService } from '../../../../app/services/title/title.service';
import { EditorService } from '../../../../app/services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  viewTitleForm : any;
  titleId: any;
  titleData: any;
  title1: boolean = false;
  title2: boolean = false;
  title3: boolean = false;
  title4: boolean = false;
  title5: boolean = false;
  title6: boolean = false;
  title7: boolean = false;
  title8: boolean = false;
  title9: boolean = false;
  title10: boolean = false;
  title11: boolean = false;
  title12: boolean = false;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _title: TitleService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private editorSettings: EditorService
  ) { 
    // this.titleId = this.__activatedRoute.snapshot.queryParams['id'];
    // console.log("titleId====",this.titleId);
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.titleId = params.get('id');
      },
      error: err => {}
    });
  }

  ngOnInit(): void {
    this.viewForm();
    this.getDetail();
    this.showField();
    this.editorConfig = this.editorSettings.viewEditorConfig();
  }

  viewForm()
  {
    this.viewTitleForm = this.__fb.group({
      name:[''],
      subtitle: [''],
      image: [''],
      description:[''],
      url:[''], 
    });
  }

  getDetail(){
    this._title.getTitleDetail(this.titleId)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.titleData = response.data;
            this.patchUserData();
            console.log('app-->', this.titleData );
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
    this.viewTitleForm.patchValue({
      name: this.titleData.name ? this.titleData.name : '',
      subtitle: this.titleData.subtitle ? this.titleData.subtitle : '',
      description: this.titleData.description ? this.titleData.description : '',
      url: this.titleData.url ? this.titleData.url : '',
    });
  }

/**Show Fields depends on condition... */
  showField() {
    this.title1 = this.titleId === '67498e27ecf109fee481f59d';
    this.title2 = this.titleId === '6749abaa433825a3948ddea9';
    this.title3 = this.titleId === '674d9bf1f3f72fd1c4331597';
    this.title4 = this.titleId === '674dc2ab467464979dcc86ba';
    this.title5 = this.titleId === '674ed1ea6f534000dab852f6';
    this.title6 = this.titleId === '674eecb02a26a746f7a1fd8c';
    this.title7 = this.titleId === '674f00831afb687b4f195444';
    this.title8 = this.titleId === '674f01a21afb687b4f19545d';
    this.title9 = this.titleId === '674f02a61afb687b4f19546c';
    this.title10 = this.titleId === '674f06671afb687b4f19548c';
    this.title11 = this.titleId === '67568fdb383eacd473729dcd';
    this.title12 = this.titleId === '67a350434d4f691c82b89b1a';
  }

}
