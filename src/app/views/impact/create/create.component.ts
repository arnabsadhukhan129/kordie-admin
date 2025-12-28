import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImpactService } from '../../../services/impact/impact.service';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  displayMessage: string = '';
  errorMessage: string = '';
  mediaType: string = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  addEditForm!: FormGroup;
  hospitality_features!: FormArray;
  impactsubsection!: FormArray;
  employer_stats!: FormArray;
  sustainability_program!: FormArray;
  sustainability_strategy_program!: FormArray;
  goal_social!: FormArray;
  goal_climate!: FormArray;
  detailsId: string | null = null;
  getDetails: any;
  videoSelectedFile: File | null = null;
  videoPreview: string | null = null;
  impactImagePreviews: any = [];
  statImagePreviews: any = [];
  // sustainabilityImageImagePreviews: any = [];
  // sustainabilityvideoPreview:any= []
  strategyImageImagePreviews: any = [];
  strategyIconPreviews: any = [];
  climateImagePreviews: any = [];
  socialImagePreviews: any = [];
  isLoading = false;
  selectedFile1: File | null = null;
  hospitalityImagePreview: string | null = null;
  sustainabilityImagePreview: string | null = null;
  goalIconPreview: string | null = null;
  goalImagePreview: string | null = null;
  studentImagePreview: string | null = null;
  hospitalityImageUrl: string = '';
  studentImageUrl: string = '';
  sustainabilityImageUrl: string = '';
  goalIconUrl: string = '';
  goalImageUrl: string = '';
  videoUrl: string = '';
  mediaTypes: any = []; // initialize as an empty array
  sustainabilityImageImagePreviews: any =[]; // Track image previews
  sustainabilityvideoPreview: any = []; // Track video previews
  getType:any=[];
  filename:any;
  susSelectedImageFile:any=[];
  susSelectedVideoFile:any=[];

  constructor(
    private __fb: FormBuilder,
    private __impact: ImpactService,
    private __route: Router,
    private __shared: SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute: ActivatedRoute,
    private _product: ProductService,
    
  ) { 
    this.__activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.detailsId = params.get('id');
      },
      error: (err) => {},
    });
  }

  ngOnInit(): void {
    this.createForm();
    if (this.detailsId) {
      this.getDetail();
      // console.log("get detail done");
    }
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

   // Initialize Form
    createForm() {
      // console.log("form initialization started");
      this.addEditForm = this.__fb.group({
        impact_title: ['', [Validators.required]],
        impact_video: [''],
        impact_subtitle: ['', [Validators.required]],
        impactsubsection: this.__fb.array([]), // Start with an empty array
        hospitality_title: ['',[Validators.required]],
        hospitality_subtitle: ['',[Validators.required]],
        hospitality_description: ['',[Validators.required]],
        hospitality_image: [''],
        hospitality_features: this.__fb.array([]), // Start with an empty array
        hospitality_bottom_subtitle: ['',[Validators.required]],
        employer_title: ['',[Validators.required]],
        employer_description: ['',[Validators.required]],
        employer_stats: this.__fb.array([]), // Start with an empty array
        employer_action: ['',[Validators.required]],
        student_title: ['',[Validators.required]],
        student_subtitle:  ['',[Validators.required]],
        student_description: ['',[Validators.required]],
        student_image: [''],
        student_action: ['',[Validators.required]],
        sustainability_title: ['',[Validators.required]],
        sustainability_description: ['',[Validators.required]],
        sustainability_program: this.__fb.array([
          this.__fb.group({
            description: [''],
            type: [''],
            media: ['']
          })
        ]), // Corrected to use a FormGroup
        sustainability_text: ['',[Validators.required]],
        sustainability_strategy_title: ['',[Validators.required]],
        sustainability_strategy_description: ['',[Validators.required]],
        sustainability_strategy_program: this.__fb.array([]), // Start with an empty array,
        sustainability_strategy_subtitle: ['',[Validators.required]],
        sustainability_strategy_text: ['',[Validators.required]],
        sustainability_image: [''],
        goal_title: ['',[Validators.required]],
        goal_icon: [''],
        goal_image: [''],
        goal_description: ['',[Validators.required]],
        goal_social_title: ['',[Validators.required]],
        goal_social: this.__fb.array([]), // Start with an empty array,
        goal_climate_title: ['',[Validators.required]],
        goal_climate: this.__fb.array([]), // Start with an empty array,
        more_title: ['',[Validators.required]]
      });

      this.impactsubsection = this.addEditForm.get('impactsubsection') as FormArray;
      this.ensureAtLeastOneImpactSubsectionItem(); // Always ensure one impactsubsection item

      this.hospitality_features = this.addEditForm.get('hospitality_features') as FormArray;
      this.ensureAtLeastOneHospitalityFeaturesItem(); // Always ensure hospitality features item

      this.employer_stats = this.addEditForm.get('employer_stats') as FormArray;
      this.ensureAtLeastOneEmployerStatsItem(); // Always ensure employer stats item

      this.sustainability_program = this.addEditForm.get('sustainability_program') as FormArray;
      this.ensureAtLeastOneSustainabilityprogramItem(); // Always ensure sustainability_program item

      this.sustainability_strategy_program = this.addEditForm.get('sustainability_strategy_program') as FormArray;
      this.ensureAtLeastOneSustainabilitystrategyprogramItem(); // Always ensure sustainability_strategy_program item

      this.goal_social = this.addEditForm.get('goal_social') as FormArray;
      this.ensureAtLeastOnegoalSocialItem(); // Always ensure goal_social item

      this.goal_climate = this.addEditForm.get('goal_climate') as FormArray;
      this.ensureAtLeastOneGoalClimateItem(); // Always ensure goal_climate item
      // console.log("form initialization done");
    }
  

    //Getter.....................................................................

    // Getter for impactsubsection controls
    get impactsubsectionControls() {
      return (this.addEditForm.get('impactsubsection') as FormArray)?.controls || [];
    }

    // Getter for hospitalityFeatures controls
    get hospitalityFeaturesControls() {
      return (this.addEditForm.get('hospitality_features') as FormArray)?.controls || [];
    }

    // Getter for hospitalityFeatures controls
    get employerStatsControls() {
      return (this.addEditForm.get('employer_stats') as FormArray)?.controls || [];
    }

     // Getter for sustainability program controls
     get sustainabilityProgramControls() {
      return (this.addEditForm.get('sustainability_program') as FormArray)?.controls || [];
    }

    // Getter for sustainability strategy program controls
    get sustainabilityStrategyProgramControls() {
      return (this.addEditForm.get('sustainability_strategy_program') as FormArray)?.controls || [];
    }

    // Getter for goal social program controls
    get goalSocialProgramControls() {
      return (this.addEditForm.get('goal_social') as FormArray)?.controls || [];
    }

    // Getter for goal climate program controls
    get goalClimateProgramControls() {
      return (this.addEditForm.get('goal_climate') as FormArray)?.controls || [];
    }
  

    //Create.............................................................

    // Create a new impactsubsection item
    createImpactsubsectionItem() {
      return this.__fb.group({
        image:[''],
        title: [''],
      });
    }

    // Create a new hospitalityFeatures item
    createhospitalityFeaturesItem() {
      return this.__fb.group({
        title: [''],
      });
    }

    // Create a new employer stats item
    createEmployerStatsItem() {
      return this.__fb.group({
        image: [''],
        stat: [''],
        description: ['']
      });
    }

    // Create a new sustainability program item
    createSustainabilityProgramItem() {
      return this.__fb.group({
        description: [''],
        type: [''],
        media: [''],
      });
    }

    // Create a new sustainability strategy program item
    createSustainabilityStrategyProgramItem() {
      return this.__fb.group({
        icon:[''],
        image: [''],
        description: [''],
        title: ['']
      });
    }

    // Create a new goal social item
    createGoalSocialProgramItem() {
    return this.__fb.group({
      icon:[''],
      title: ['']
    });
  }

  // Create a new goal climate item
  createGoalClimateProgramItem() {
    return this.__fb.group({
      icon:[''],
      title: ['']
    });
  }
  

    //Add................................................................

    // Add impactsubsection item
    addImpactsubsectionItem() {
      this.impactsubsection.push(this.createImpactsubsectionItem());
    }

    // Add employerstats item
    addemployerStatsItem() {
      this.employer_stats.push(this.createEmployerStatsItem());
    }

    // Add hospitalityFeatures item
    addhospitalityFeaturesItem() {
      this.hospitality_features.push(this.createhospitalityFeaturesItem());
    }

     // Add Sustainability Program item
     addSustainabilityProgramItem() {
      this.sustainability_program.push(this.createSustainabilityProgramItem());
    }

    // Add Sustainability Strategy Program item
    addSustainabilityStrategyProgramItem() {
      this.sustainability_strategy_program.push(this.createSustainabilityStrategyProgramItem());
    }

    // Add Goal Social Program item
    addgoalSocialProgramItem() {
      this.goal_social.push(this.createGoalSocialProgramItem());
    }

    // Add Goal Climate Program item
    addGoalClimateProgramItem() {
      this.goal_climate.push(this.createGoalClimateProgramItem());
    }
  

    //Remove...................................................................

    // Remove employer stats item
    removeEmployerStatsItem(index: number) {
      this.employer_stats.removeAt(index);
      this.ensureAtLeastOneEmployerStatsItem(); // Ensure at least one item remains
    }

    // Remove hospitalityFeatures item
    removeHospitalityFeaturesItem(index: number) {
      this.hospitality_features.removeAt(index);
      this.ensureAtLeastOneHospitalityFeaturesItem(); // Ensure at least one item remains
    }

    // Remove impactsubsection item
    removeimpactsubsectionItem(index: number) {
      this.impactsubsection.removeAt(index);
      this.ensureAtLeastOneImpactSubsectionItem(); // Ensure at least one item remains
    }

    // Remove sustainability program item
    removeSustainabilityProgramItem(index: number) {
      // console.log("mediaTypes======",this.getDetails.sustainability_program[index].type);
      
      this.sustainability_program.removeAt(index);
      // if(this.getDetails.sustainability_program[index].type === 'image'){
      //   this.sustainabilityImageImagePreviews.splice(index, 1);
      // }
      // else if(this.getDetails.sustainability_program[index].type === 'video'){
      //   this.sustainabilityvideoPreview.splice(index, 1);
      // }
      this.ensureAtLeastOneSustainabilityprogramItem(); // Ensure at least one item remains
    }

    // Remove sustainability strategy program item
    removeSustainabilityStrategyProgramItem(index: number) {
      this.sustainability_strategy_program.removeAt(index);
      this.ensureAtLeastOneSustainabilitystrategyprogramItem(); // Ensure at least one item remains
    }

    // Remove goal social program item
    removeGoalSocialProgramItem(index: number) {
      this.goal_social.removeAt(index);
      this.ensureAtLeastOnegoalSocialItem(); // Ensure at least one item remains
    }

    // Remove goal climate program item
    removeGoalClimateProgramItem(index: number) {
      this.goal_climate.removeAt(index);
      this.ensureAtLeastOneGoalClimateItem(); // Ensure at least one item remains
    }

  
    //Ensure...................................................................

    // Ensure at least one impactsubsection item exists
    private ensureAtLeastOneImpactSubsectionItem(): void {
      if (this.impactsubsection.length === 0) {
        this.addImpactsubsectionItem();
      }
    }

    // Ensure at least one Hospitality Features item exists
    private ensureAtLeastOneHospitalityFeaturesItem(): void {
      if (this.hospitality_features.length === 0) {
        this.addhospitalityFeaturesItem();
      }
    }

     // Ensure at least one  employer stats item exists
     private ensureAtLeastOneEmployerStatsItem(): void {
      if (this.employer_stats.length === 0) {
        this.addemployerStatsItem();
      }
    }

    // Ensure at least one  sustainability program item exists
    private ensureAtLeastOneSustainabilityprogramItem(): void {
      if (this.sustainability_program.length === 0) {
        this.addSustainabilityProgramItem();
      }
    }

    // Ensure at least one  sustainability strategy program item exists
    private ensureAtLeastOneSustainabilitystrategyprogramItem(): void {
      if (this.sustainability_strategy_program.length === 0) {
        this.addSustainabilityStrategyProgramItem();
      }
    }

    // Ensure at least one goal social item exists
    private ensureAtLeastOnegoalSocialItem(): void {
      if (this.goal_social.length === 0) {
        this.addgoalSocialProgramItem();
      }
    }

     // Ensure at least one goal climate item exists
     private ensureAtLeastOneGoalClimateItem(): void {
      if (this.goal_climate.length === 0) {
        this.addGoalClimateProgramItem();
      }
    }

     //Video upload.......
  onvideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if(file){
      this.uploadVideoFile(file);
    }
  }

  uploadVideoFile(file: File): void {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
      return;
    }

    const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 80MB limit.');
      return;
    }

    this.videoSelectedFile = file;
    // console.log("videoSelectedFile.....",this.videoSelectedFile);
    

    // Preview the video
    const reader = new FileReader();
    reader.onload = () => {
      this.videoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    
  }

  //Upload Image......
  onImageSelected(event: Event, index: number,type: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    // console.log("file====", file);
  
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
        return;
      }
  
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 2MB limit.');
        return;
      }
  
      // Preview the image (optional)
      const reader = new FileReader();
      if(type === 'impactImage'){
        reader.onload = () => {
          if (!this.impactImagePreviews) {
            this.impactImagePreviews = [];
          }
          this.impactImagePreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }

      else if(type === 'statImage'){
        reader.onload = () => {
          if (!this.statImagePreviews) {
            this.statImagePreviews = [];
          }
          this.statImagePreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }

      // else if(type === 'sustainabilityImage'){
      //   reader.onload = () => {
      //     if (!this.sustainabilityImageImagePreviews) {
      //       this.sustainabilityImageImagePreviews = [];
      //     }
      //     this.sustainabilityImageImagePreviews[index] = reader.result as string; // Store the preview
      //   };
      //   reader.readAsDataURL(file);
      // }

      else if(type === 'strategyImage'){
        reader.onload = () => {
          if (!this.strategyImageImagePreviews) {
            this.strategyImageImagePreviews = [];
          }
          this.strategyImageImagePreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }

      else if(type === 'strategyIcon'){
        reader.onload = () => {
          if (!this.strategyIconPreviews) {
            this.strategyIconPreviews = [];
          }
          this.strategyIconPreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }

      else if(type === 'socialImage'){
        reader.onload = () => {
          if (!this.socialImagePreviews) {
            this.socialImagePreviews = [];
          }
          this.socialImagePreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }

      else if(type === 'climateImage'){
        reader.onload = () => {
          if (!this.climateImagePreviews) {
            this.climateImagePreviews = [];
          }
          this.climateImagePreviews[index] = reader.result as string; // Store the preview
        };
        reader.readAsDataURL(file);
      }
      
  
      // Upload the file and update the form with the actual URL
      this.uploadFile(file, index, type);
    }
  }

  uploadFile(file: File, index: number, type:any): void {
    // console.log("fiiririri.....",file);
    
    const formData = new FormData();
    formData.append('media', file);
  
    this.isLoading = true;
  
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false;
  
        if (!response.error) {
          const imageUrl = response?.data?.mediaUrl?.fileUrl;
          // console.log("Uploaded Image URL:", imageUrl);
  
          // Update the image field in the syllabus form array with the URL
          if(type === 'impactImage'){
            const impactSubsectyionFormArray = this.addEditForm.get('impactsubsection') as FormArray;
            if (impactSubsectyionFormArray && impactSubsectyionFormArray.length > index) {
              if(this.detailsId){
                impactSubsectyionFormArray.at(index).patchValue({ image: imageUrl });
              }
              else{
                impactSubsectyionFormArray.at(index).patchValue({ image: imageUrl });
              }
              // console.log("Updated Form Value:", impactSubsectyionFormArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'statImage'){
            const statImageFormArray = this.addEditForm.get('employer_stats') as FormArray;
            if (statImageFormArray && statImageFormArray.length > index) {
              if(this.detailsId){
                statImageFormArray.at(index).patchValue({ image: imageUrl });
              }
              else{
                statImageFormArray.at(index).patchValue({ image: imageUrl });
              }
              // console.log("Updated Form Value:", statImageFormArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          else if(type === 'sustainabilityImage'){
            const sustainabilityImageFormArray = this.addEditForm.get('sustainability_program') as FormArray;
            if (sustainabilityImageFormArray && sustainabilityImageFormArray.length > index) {
              if(this.detailsId){
                sustainabilityImageFormArray.at(index).patchValue({ media: imageUrl });
              }
              else{
                sustainabilityImageFormArray.at(index).patchValue({ media: imageUrl });
              }
              // console.log("Updated Form Value:", sustainabilityImageFormArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }
          

          else if(type === 'strategyImage'){
            const strategyImageFormArray = this.addEditForm.get('sustainability_strategy_program') as FormArray;
            if (strategyImageFormArray && strategyImageFormArray.length > index) {
              if(this.detailsId){
                strategyImageFormArray.at(index).patchValue({ image: imageUrl });
              }
              else{
                strategyImageFormArray.at(index).patchValue({ image: imageUrl });
              }
              // console.log("Updated Form Value:", strategyImageFormArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }

          else if(type === 'strategyIcon'){
            const strategyIconFormArray = this.addEditForm.get('sustainability_strategy_program') as FormArray;
            if (strategyIconFormArray && strategyIconFormArray.length > index) {
              if(this.detailsId){
                strategyIconFormArray.at(index).patchValue({ icon: imageUrl });
              }
              else{
                strategyIconFormArray.at(index).patchValue({ icon: imageUrl });
              }
              // console.log("Updated Form Value:", strategyIconFormArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }

          else if(type === 'socialImage'){
            const socialImageFormArray = this.addEditForm.get('goal_social') as FormArray;
            if (socialImageFormArray && socialImageFormArray.length > index) {
              if(this.detailsId){
                socialImageFormArray.at(index).patchValue({ icon: imageUrl });
              }
              else{
                socialImageFormArray.at(index).patchValue({ icon: imageUrl });
              }
              console.log("Updated Form Value:", socialImageFormArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }

          else if(type === 'climateImage'){
            const climateImageFormArray = this.addEditForm.get('goal_climate') as FormArray;
            if (climateImageFormArray && climateImageFormArray.length > index) {
              if(this.detailsId){
                climateImageFormArray.at(index).patchValue({ icon: imageUrl });
              }
              else{
                climateImageFormArray.at(index).patchValue({ icon: imageUrl });
              }
              console.log("Updated Form Value:", climateImageFormArray.at(index)?.value);
            } else {
              console.error(`FormArray is invalid or index ${index} is out of range.`);
            }
          }

          else {
          this.__shared.toastError(response.message || 'Upload failed.');
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.__shared.toastError('An error occurred while uploading the file.');
        console.error("Upload Error:", error);
      }
    );
  }

  onImageSelected2(event: Event, type: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if(type === 'video'){
      if (file) {
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
        return;
      }
  
      const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 80MB limit.');
        return;
      }
      this.selectedFile1 = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.videoPreview = reader.result as string; // Show preview Video
      };
      reader.readAsDataURL(file);
      this.uploadFile2(file, type);
    }
  }
    else{
      if (file) {
        // Allowed file types
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          this.__shared.toastError('Invalid file type. Please select a PNG, SVG, or JPEG image.');
          return;
        }
    
        // Validate file size (e.g., 10MB max)
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeInBytes) {
          this.__shared.toastError('File size exceeds the 10MB limit.');
          return;
        }
    
        this.selectedFile1 = file;
        if(type === 'hospitalityImage'){
          // Preview the image
          const reader = new FileReader();
          reader.onload = () => {
            this.hospitalityImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'student'){
          const reader = new FileReader();
          reader.onload = () => {
            this.studentImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
    
        else if(type === 'sustainabilityImage'){
          const reader = new FileReader();
          reader.onload = () => {
            this.sustainabilityImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'goalIcon'){
          const reader = new FileReader();
          reader.onload = () => {
            this.goalIconPreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
  
        else if(type === 'goalImage'){
          const reader = new FileReader();
          reader.onload = () => {
            this.goalImagePreview = reader.result as string; // Show preview image
          };
          reader.readAsDataURL(file);
        }
    
        // Upload the file
        this.uploadFile2(file, type);
      }
    }
  }

  uploadFile2(file: File, type:any): void {
    const formData = new FormData();
    if(type === 'hospitalityImage'){
      formData.append('media', file);
    }
    else if(type === 'student'){
      formData.append('media', file);
    }
    else if(type === 'sustainabilityImage'){
      formData.append('media', file);
    }
    else if(type === 'goalIcon'){
      formData.append('media', file);
    }
    else if(type === 'goalImage'){
      formData.append('media', file);
    }
    else if(type === 'video'){
      formData.append('media', file);
    }
    // console.log("File being uploaded: ", file);
  
    this.isLoading = true; // Show loader
    this._product.upload(formData).subscribe(
      (response) => {
        this.isLoading = false; // Stop loading spinner
        if (!response.error) {
          // Handle successful response
          if (type === 'hospitalityImage') {
            this.hospitalityImageUrl = response?.data?.mediaUrl?.fileUrl;
          } else if (type === 'student') {
            this.studentImageUrl = response?.data?.mediaUrl?.fileUrl;
          } else if (type === 'sustainabilityImage') {
            this.sustainabilityImageUrl = response?.data?.mediaUrl?.fileUrl;
          } else if (type === 'goalIcon') {
            this.goalIconUrl = response?.data?.mediaUrl?.fileUrl;
          } else if (type === 'goalImage') {
            this.goalImageUrl = response?.data?.mediaUrl?.fileUrl;
          }
          else if (type === 'video') {
            this.videoUrl = response?.data?.mediaUrl?.fileUrl;
          }
        } else {
          // Handle server-side error
          this.errorMessage = response.message || 'Upload failed.';
          this.__shared.toastError(this.errorMessage);
        }
      },
      (error) => {
        this.isLoading = false; // Stop loading spinner
        this.errorMessage = 'An error occurred while uploading the file.';
        this.__shared.toastError(this.errorMessage);
        console.error(error);
      }
    );
  }


   // Fetch details for editing
   getDetail() {
    this.__impact.getDetailById(this.detailsId).subscribe(
      (response: any) => {
        if (!response.error) {
          this.getDetails = response?.data;
          this.videoPreview = this.getDetails?.impact_video || '';
          this.hospitalityImagePreview = this.getDetails?.hospitality_image || '';
          this.studentImagePreview = this.getDetails?.student_image || '';
          this.sustainabilityImagePreview = this.getDetails?.sustainability_image || '';
          this.goalIconPreview = this.getDetails?.goal_icon || '';
          this.goalImagePreview = this.getDetails?.goal_image || '';
          // console.log("getDetails======>",this.getDetails);
          // return;
          // this.imagePreview = this.getDetails?.image || null;
          this.patchData();
          // console.log("data patched ---->");
        } else {
          this.__shared.toastError(response.message);
        }
      },
      (err) => {
        if (err.status === 403) {
          this.__shared.sessionExpired();
        } else {
          this.__shared.toastError('Error fetching details.');
        }
      }
    );
  }

  // Patch data for editing
  patchData() {
    if(this.getDetails){}
    this.addEditForm.patchValue({
      impact_title: this?.getDetails?.impact_title || '',
      impact_subtitle: this?.getDetails?.impact_subtitle || '',
      hospitality_title: this?.getDetails?.hospitality_title || '',
      hospitality_subtitle: this?.getDetails?.hospitality_subtitle || '',
      hospitality_description: this?.getDetails?.hospitality_description || '',
      hospitality_bottom_subtitle: this?.getDetails?.hospitality_bottom_subtitle || '',
      employer_title: this?.getDetails?.employer_title || '',
      employer_description: this?.getDetails?.employer_description || '',
      employer_action: this?.getDetails?.employer_action || '',
      student_title: this?.getDetails?.student_title || '',
      student_subtitle: this?.getDetails?.student_subtitle || '',
      student_description: this?.getDetails?.student_description || '',
      student_action: this?.getDetails?.student_action || '',
      sustainability_title: this?.getDetails?.sustainability_title || '',
      sustainability_description: this?.getDetails?.sustainability_description || '',
      sustainability_text: this?.getDetails?.sustainability_text || '',
      sustainability_strategy_title: this?.getDetails?.sustainability_strategy_title || '',
      sustainability_strategy_description: this?.getDetails?.sustainability_strategy_description || '',
      sustainability_strategy_subtitle: this?.getDetails?.sustainability_strategy_subtitle || '',
      sustainability_strategy_text: this?.getDetails?.sustainability_strategy_text || '',
      goal_title: this?.getDetails?.goal_title || '',
      goal_description: this?.getDetails?.goal_description || '',
      goal_social_title: this?.getDetails?.goal_social_title || '',
      goal_climate_title: this?.getDetails?.goal_climate_title || '',
      more_title: this?.getDetails?.more_title || ''
    });

    //impact subsection...........
    const impactsubsectionArray = this.addEditForm.get('impactsubsection') as FormArray;;
    impactsubsectionArray.clear(); // Clear existing
    if (this.getDetails?.impactsubsection?.length) {
      this.getDetails.impactsubsection.forEach((sub: any, index: number) => {
        impactsubsectionArray.push(
          this.__fb.group({
            title: [sub.title || ''],
            image: [sub.image || ''],
          })
        );
        // Update the image preview array
        this.impactImagePreviews[index] = sub?.image || '';
      });
    } else {
      this.ensureAtLeastOneImpactSubsectionItem(); // Ensure at least one item if impact is empty
    }


    //hospitality features........
    const hospitalityfeaturesArray = this.addEditForm.get('hospitality_features') as FormArray;;
    hospitalityfeaturesArray.clear(); // Clear existing
    if (this.getDetails?.hospitality_features?.length) {
      this.getDetails.hospitality_features.forEach((feat: any, index: number) => {
        hospitalityfeaturesArray.push(
          this.__fb.group({
            title: [feat.title || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneHospitalityFeaturesItem(); // Ensure at least one item if hospitality features are empty
    }

    //employer stats...........
    const employerstatsArray = this.addEditForm.get('employer_stats') as FormArray;;
    employerstatsArray.clear(); // Clear existing
    if (this.getDetails?.employer_stats?.length) {
      this.getDetails.employer_stats.forEach((emp: any, index: number) => {
        employerstatsArray.push(
          this.__fb.group({
            stat: [emp.stat || ''],
            description: [emp.description || ''],
            image: [emp.image || ''],
          })
        );
        // Update the image preview array
        this.statImagePreviews[index] = emp?.image || '';
      });
    } else {
      this.ensureAtLeastOneEmployerStatsItem(); // Ensure at least one item if employer stats are empty
    }

    //Sustainability Program...........
    const susArray = this.addEditForm.get('sustainability_program') as FormArray;
    susArray.clear(); // Clear existing
    if (this.getDetails?.sustainability_program?.length) {
      this.getDetails.sustainability_program.forEach((sus: any, index: number) => {
        // console.log("sus....",sus);
        
        susArray.push(
          this.__fb.group({
            description: [sus.description || ''],
            type: [sus.type || ''],
            media: [sus.media || ''],
          })
        );
        // console.log("sus=====",sus.media);
        this.getType[index] = sus.type;
      // Determine the media type and update the corresponding preview
      if (sus.type === 'image') {
        // console.log("type is image");
        this.sustainabilityImageImagePreviews[index] = sus.media || ''; // Assign to image preview
        // console.log("this.sustainabilityImageImagePreviews[index]===",this.sustainabilityImageImagePreviews[index]);
        
        // this.sustainabilityvideoPreview[index] = null; // Clear video preview
      } else if (sus.type === 'video') {
        // console.log("type is video");
        this.sustainabilityvideoPreview[index] = sus.media || ''; // Assign to video preview
        // this.sustainabilityImageImagePreviews[index] = null; // Clear image preview
        // console.log("this.sustainabilityImageImagePreviews[index]===",this.sustainabilityvideoPreview[index]);
      }
      // console.log("patch data complete ----->");
    });
    } else {
      this.ensureAtLeastOneSustainabilityprogramItem(); // Ensure at least one item if empty
    }



    //Sustainability Strategy Program...........
    const programArray = this.addEditForm.get('sustainability_strategy_program') as FormArray;;
    programArray.clear(); // Clear existing
    if (this.getDetails?.sustainability_strategy_program?.length) {
      this.getDetails.sustainability_strategy_program.forEach((prog: any, index: number) => {
        programArray.push(
          this.__fb.group({
            title: [prog.title || ''],
            description: [prog.description || ''],
            icon: [prog.icon || ''],
            image: [prog.image || ''],
          })
        );
        // Update the icon preview array
        this.strategyIconPreviews[index] = prog?.icon || '';
        // Update the image preview array
        this.strategyImageImagePreviews[index] = prog?.image || '';
      });
    } else {
      this.ensureAtLeastOneSustainabilitystrategyprogramItem(); // Ensure at least one item if Sustainability Strategy Program is empty
    }

    //Goal Social...........
    const socialArray = this.addEditForm.get('goal_social') as FormArray;;
    socialArray.clear(); // Clear existing
    if (this.getDetails?.goal_social?.length) {
      this.getDetails.goal_social.forEach((social: any, index: number) => {
        socialArray.push(
          this.__fb.group({
            title: [social.title || ''],
            icon: [social.icon || ''],
          })
        );
        // Update the icon preview array
        this.socialImagePreviews[index] = social?.icon || '';
      });
    } else {
      this.ensureAtLeastOnegoalSocialItem(); // Ensure at least one item if Goal Social is empty
    }

    //Goal Climate...........
    const climateArray = this.addEditForm.get('goal_climate') as FormArray;;
    climateArray.clear(); // Clear existing
    if (this.getDetails?.goal_climate?.length) {
      this.getDetails.goal_climate.forEach((climate: any, index: number) => {
        climateArray.push(
          this.__fb.group({
            title: [climate.title || ''],
            icon: [climate.icon || ''],
          })
        );
        // Update the icon preview array
        this.climateImagePreviews[index] = climate?.icon || '';
      });
    } else {
      this.ensureAtLeastOneGoalClimateItem(); // Ensure at least one item if Goal Climate is empty
    }
  }

  

  add(){
    const data: any = this.addEditForm?.value;
    const params: any = {
        impact_title: data.impact_title || '',
        impact_video: this.videoUrl || this.videoPreview,
        impact_subtitle: data.impact_subtitle || '',
        impactsubsection: data?.impactsubsection,
        hospitality_title: data.hospitality_title || '',
        hospitality_subtitle: data.hospitality_subtitle || '',
        hospitality_description: data.hospitality_description || '',
        hospitality_image: this.hospitalityImageUrl || this.hospitalityImagePreview,
        hospitality_features: data?.hospitality_features,
        hospitality_bottom_subtitle: data.hospitality_bottom_subtitle || '',
        employer_title: data.employer_title || '',
        employer_description: data.employer_description || '',
        employer_stats: data?.employer_stats,
        employer_action: data.employer_action || '',
        student_title: data.student_title || '',
        student_subtitle: data.student_subtitle || '',
        student_description: data.student_description || '',
        student_image: this.studentImageUrl || this.studentImagePreview,
        student_action: data.student_action || '',
        sustainability_title: data.sustainability_title || '',
        sustainability_description: data.sustainability_description || '',
        sustainability_program: data?.sustainability_program,
        sustainability_text: data.sustainability_text || '',
        sustainability_strategy_title: data.sustainability_strategy_title || '',
        sustainability_strategy_description: data.sustainability_strategy_description || '',
        sustainability_strategy_program: data?.sustainability_strategy_program,
        sustainability_strategy_subtitle: data.sustainability_strategy_subtitle || '',
        sustainability_strategy_text: data.sustainability_strategy_text || '',
        sustainability_image: this.sustainabilityImageUrl || this.studentImagePreview,
        goal_title: data.goal_title || '',
        goal_icon: this.goalIconUrl || this.goalIconPreview,
        goal_image: this.goalImageUrl || this.goalImagePreview,
        goal_description: data.goal_description || '',
        goal_social_title: data.goal_social_title || '',
        goal_social: data?.goal_social,
        goal_climate_title: data.goal_climate_title || '',
        goal_climate: data?.goal_climate,
        more_title: data.more_title || ''
    }; 
    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    const apiCall = this.detailsId
    ? this.__impact.edit(this.detailsId, params)
    : this.__impact.create(params);
 
     apiCall.subscribe(
         response => {
           this.isLoading = false; // Stop loading spinner
           this.__spinner.hide(); // Hide visual spinner
           if (!response.error) {
               this.displayMessage = this.detailsId
                   ? "Details updated successfully."
                   : "Details added successfully.";
               this.__shared.toastSuccess(this.displayMessage);
               this.__route.navigate(['/impact/list']);
           } else {
               this.errorMessage = response.message;
               this.__shared.toastError(this.errorMessage);
           }
       },
         error => {
             this.isLoading = false; // Stop loading spinner
             this.__spinner.hide(); // Hide visual spinner
             this.errorMessage = "An error occurred.";
             this.__shared.toastError(this.errorMessage);
         }
     );
  }


  selectType(event: any, index: number): void {
    this.resetFileSelection(index);
    const selectedType = event.target?.value;
    if (!this.mediaTypes[index]) {
      this.mediaTypes[index] = selectedType; // Initialize the value at the index
    } else {
      this.mediaTypes[index] = selectedType; // Update the value if already initialized
    }
  
    // console.log("this.mediaTypes[index]1111=====", this.mediaTypes[index]);
  }
  
  
  onMediaSelected(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    // const file = (event.target as HTMLInputElement).filfes?.[0];
    // Ensure mediaType array is initialized and has enough elements
    if (this.mediaTypes.length <= index) {
      this.mediaTypes.length = index + 1;  // Extend array to match the index
    }
  
    // Check if the selected file and mediaTypes[index] exist
    if (file) {
      if (this.mediaTypes[index] === 'image' || this.getType[index] === 'image') {
        this.handleImage(file, index);
      } else if (this.mediaTypes[index] === 'video' || this.getType[index] === 'video') {
        this.handleVideo(file, index);
      }
    }
  }
  

  resetFileSelection(index:number): void {
    // Reset the selected file and preview
    this.susSelectedImageFile[index] = null;
    this.susSelectedVideoFile[index] = null;
    this.filename = null;
    this.sustainabilityImageImagePreviews[index] = null;
    this.sustainabilityvideoPreview[index] = null;
  
    // Optionally, reset the file input element itself (if needed)
    const fileInput: HTMLInputElement = document.querySelector('input[type="file"]')!;
    if (fileInput) {
      fileInput.value = '';  // Clear the file input value
    }
  }

  
  
  handleImage(file: File, index: number): void {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select a PNG, JPEG, JPG, or SVG image.');
      this.resetFileSelection(index);
      return;
    }
  
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 10MB limit.');
      this.resetFileSelection(index);
      return;
    }
  
    this.susSelectedImageFile[index]= file;
    const reader = new FileReader();
    reader.onload = () => {
      this.sustainabilityImageImagePreviews[index] = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.uploadFile(file, index, 'sustainabilityImage');
  }
  
  handleVideo(file: File, index: number): void {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      this.__shared.toastError('Invalid file type. Please select an MP4, WebM, or OGG video.');
      this.resetFileSelection(index);
      return;
    }
  
    const maxSizeInBytes = 80 * 1024 * 1024; // 80MB
    if (file.size > maxSizeInBytes) {
      this.__shared.toastError('File size exceeds the 80MB limit.');
      this.resetFileSelection(index);
      return;
    }
    // console.log("file.....",file);
    
    this.susSelectedVideoFile[index] = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.sustainabilityvideoPreview[index] = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.uploadFile(file, index, 'sustainabilityImage');
  }

  
  

  
}
