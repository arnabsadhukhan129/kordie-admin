import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateService } from '../../../../services/master-list/create.service';
import { ViewService } from '../../../../services/master-list/view.service';
import { EditorService } from '../../../../services/editor/editor.service';

@Component({
  selector: 'app-add-edit-taught-by',
  templateUrl: './add-edit-taught-by.component.html',
  styleUrls: ['./add-edit-taught-by.component.scss']
})
export class AddEditTaughtByComponent implements OnInit,OnDestroy {

  addEditForm!: FormGroup;
  detailsId:string | null = null;
  displayMessage : string = '';
  errorMessage : string = '';
  selectedFile: File | null = null;
  deliveryData:any;
  imagePreview: string | null = null;
  isLoading = false;
  getData: any;
  editorConfig: any;

  constructor(
    private __fb: FormBuilder,
    private _taught: CreateService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private _detailsTaught: ViewService,
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

  ngOnDestroy(): void {
    
  }

  createForm()
    {
      this.addEditForm = this.__fb.group({
        name:['',[Validators.required]],
        image: [''],
        designation:['',[Validators.required]],
        description:['',[Validators.required]],
        experience:[''],
        benifit:[''],
        skill:[''],

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

    sanitizeAndTrimHtml(html: string): string {
      if (!html) return '';
  
      // Convert HTML to plain text by stripping tags
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
      return textContent.trim(); // Remove extra spaces
    }
  
    add(): void {
      const data: any = this.addEditForm.value;
      if (this.addEditForm.invalid) {
          return;
      }
      if (!this.selectedFile && !this.getData?.image) {
        this.__shared.toastError('Please upload image ');
        return;
      }

      //Validate description
      if (!data.description || data.description.trim() === '') { 
        this.__shared.toastError('Please enter description!');
        return;
      }
      const strippedText = this.sanitizeAndTrimHtml(data.description);
    
      if (!strippedText) {
        this.__shared.toastError('Please enter description!');
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('designation', data.designation || '');
      formData.append('experience', data.experience || '');
      formData.append('benifit', data.benifit || '');
      formData.append('skill', data.skill || '');
  
    // Check if a new image file is selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Add the selected file
    } else if (this.deliveryData?.image && !this.detailsId) {
      formData.append('image', this.deliveryData.image); // Add existing image only when editing
    }

     // Show loader
      this.isLoading = true;
      this.__spinner.show(); // Start visual spinner
  
      // this.isLoading = true; // Start loading spinner
      // const formData = this.addEditForm.value;
  
      const apiCall = this.detailsId
          ? this._taught.editTaughtByData(this.detailsId, formData)
          : this._taught.createTaughtByData(formData);
  
      apiCall.subscribe(
          response => {
            this.isLoading = false; // Stop loading spinner
            this.__spinner.hide(); // Hide visual spinner
            if (!response.error) {
                this.displayMessage = this.detailsId
                    ? "Details updated successfully."
                    : "Details added successfully.";
                this.__shared.toastSuccess(this.displayMessage);
                this.__route.navigate(['/master-list/taught-by-list']);
            } else {
                this.errorMessage = response.message;
                this.__shared.toastError(this.errorMessage);
            }
        },
          error => {
              this.isLoading = false; // Stop loading spinner
              this.__spinner.hide(); // Hide visual spinner
              // this.errorMessage = "An error occurred.";
              this.__shared.toastError(error.error.message);
          }
      );
    }
  
    //get details............
    getDetail(){
      this._detailsTaught.getTaughtDetailById(this.detailsId)
        .subscribe((response)=>{
          if(response.error == false)
          {
              this.getData = response?.data;
              this.imagePreview =  this.getData?.image ? this.getData?.image : null;
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
  
    patchData(){
      console.log("name........",this.getData.name);
      
      this.addEditForm.patchValue({
        name: this.getData.name ? this.getData.name : '',
        designation: this.getData.designation ? this.getData.designation : '',
        description: this.getData.description ? this.getData.description : '',
        experience: this.getData.experience ? this.getData.experience : '',
        benifit: this.getData.benifit ? this.getData.benifit : '',
        skill: this.getData.skill ? this.getData.skill : '',
      });
    }

    onImageSelected(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      
      if (file) {
        // Allowed file types
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
        
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
          this.resetFileSelection(fileInput);
          return;
        }
    
        // Validate file size (e.g., 2MB max)
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 2MB limit.');
          this.resetFileSelection(fileInput);
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
    }
    
    //Reset the selected file
    resetFileSelection(fileInput: HTMLInputElement): void {
      this.selectedFile = null;
      this.imagePreview = null;
      fileInput.value = ''; // Clear the input value to allow re-selection
    }

    allowOnlyPositiveDecimalNumbers(event: KeyboardEvent): void {
      const charCode = event.key;
      const inputValue = (event.target as HTMLInputElement).value;
    
      // Allow numbers, one '.', and control keys like Backspace and Delete
      if (
        !/[0-9.]/.test(charCode) || // Block any character that is not a number or '.'
        (charCode === '.' && inputValue.includes('.')) // Block multiple '.'
      ) {
        event.preventDefault();
      }
    }

    preventNegativeValues(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      if (parseFloat(inputElement.value) < 0) {
        inputElement.value = '0'; // Reset to 0 if negative
      }
    }
    

}
