import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SkillService } from '../../../services/crucial-skill/skill.service';
import { EditorService } from '../../../../app/services/editor/editor.service';
import { CourseService } from '../../../services/category-course/course.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  displayMessage : string = '';
  errorMessage : string = '';
  mediaType:string = '';
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  selectedFile: File | null = null;
  filename:any;
  addEditForm!: FormGroup;
  stats!: FormArray;
  detailsId:string | null = null;
  getDetails:any;
  editorConfig: any;
  isLoading = false;
  listData:any;

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
      type: [''],
      media: [''],
      description:[''],
      stats: this.__fb.array([this.createteStatsItem()]),
      category_id: ['',[Validators.required]]
    });
    this.stats = this.addEditForm.get('stats') as FormArray;
   }

   get statsControls() {
    return (this.addEditForm.get('stats') as FormArray).controls;
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

  //add stats item...........
  addStatsItem() {
    const statsItem = this.__fb.group({
      percentage: [0],
      text: ['']
    });

    this.stats.push(statsItem);
  }

   // Create a new stats item form group
   createteStatsItem() {
    return this.__fb.group({
      percentage: [0],
      text: ['']
    });
  }

  //Remove Stats Section
  removeStatsItem(index: number) {
    this.stats.removeAt(index);
  }

  onMediaSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.mediaType === 'image') {
        this.handleImage(file);
      } else if (this.mediaType === 'video') {
        this.handleVideo(file);
      }
    }
  }

  handleImage(file: File): void {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp','image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
      this.resetFileSelection();
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 2MB limit.');
      this.resetFileSelection();
      return;
    }

    this.selectedFile = file;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  handleVideo(file: File): void {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
      this.resetFileSelection();
      return;
    }

    const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 80MB limit.');
      this.resetFileSelection();
      return;
    }

    this.selectedFile = file;

    // Preview the video
    const reader = new FileReader();
    reader.onload = () => {
      this.videoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  selectType(event:any){
    this.resetFileSelection();
    this.mediaType = event?.target?.value;
  }

  resetFileSelection(): void {
    // Reset the selected file and preview
    this.selectedFile = null;
    this.filename = null;
    this.imagePreview = null;
    this.videoPreview = null;
  
    // Optionally, reset the file input element itself (if needed)
    const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
    if (fileInput) {
      fileInput.value = '';  // Clear the file input value
    }
  }

  add() {
    const data: any = this.addEditForm.value;
  
    // Validate type
    if (data.type) {
      if (!this.selectedFile && (!this.getDetails || !this.getDetails.media)) {
        this.__shared.toastError('Please upload ' + this.mediaType);
        return;
      }
    }
  
    // Filter valid stats entries
    const statsArray = (data.stats || []).filter((stat: any) => {
      return stat.text.trim() !== '' && stat.percentage > 0;
    });
  
    const formData = new FormData();
    formData.append('title', data.title);

    if(data.type){
      formData.append('type', data.type);
    }

    if (this.selectedFile) {
      formData.append('media', this.selectedFile); // Add the selected file
    } else if (this.getDetails?.media && !this.detailsId) {
      formData.append('media', this.getDetails.media); // Add existing image only when editing
    }
    
    formData.append('stats', JSON.stringify(statsArray));
    formData.append('description',data?.description || "");
    formData.append('category_id',data?.category_id);
    const apiCall = this.detailsId
      ? this.__skill.edit(this.detailsId, formData)
      : this.__skill.create(formData);
  
    apiCall.subscribe(
      (response: any) => {
        if (!response.error) {
          this.displayMessage = this.detailsId
            ? 'Data has been updated successfully'
            : 'Data has been saved successfully';
  
          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/crucial-skill/list']);
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
    this.__skill.getDetailById(this.detailsId).subscribe((response: any) => {
      if (response.error == false) {
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

  allowOnlyPositiveNumbers(event: KeyboardEvent): void {
    const charCode = event.key;
    
    // Prevent "-" or any non-numeric characters except for allowed keys (e.g., Backspace, Tab).
    if (charCode === '-' || isNaN(Number(charCode))) {
      event.preventDefault();
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
