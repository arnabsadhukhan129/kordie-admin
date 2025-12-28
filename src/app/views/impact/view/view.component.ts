import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImpactService } from '../../../services/impact/impact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
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
        this.hospitality_features = this.addEditForm.get('hospitality_features') as FormArray;
        this.employer_stats = this.addEditForm.get('employer_stats') as FormArray;
        this.sustainability_program = this.addEditForm.get('sustainability_program') as FormArray;
        this.sustainability_strategy_program = this.addEditForm.get('sustainability_strategy_program') as FormArray;
        this.goal_social = this.addEditForm.get('goal_social') as FormArray;
        this.goal_climate = this.addEditForm.get('goal_climate') as FormArray;
        
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
      // this.ensureAtLeastOneImpactSubsectionItem(); // Ensure at least one item if impact is empty
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
      // this.ensureAtLeastOneHospitalityFeaturesItem(); // Ensure at least one item if hospitality features are empty
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
      // this.ensureAtLeastOneEmployerStatsItem(); // Ensure at least one item if employer stats are empty
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
            media: [sus.media || 'Arnab'],
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
      // this.ensureAtLeastOneSustainabilityprogramItem(); // Ensure at least one item if empty
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
      // this.ensureAtLeastOneSustainabilitystrategyprogramItem(); // Ensure at least one item if Sustainability Strategy Program is empty
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
      // this.ensureAtLeastOnegoalSocialItem(); // Ensure at least one item if Goal Social is empty
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
      // this.ensureAtLeastOneGoalClimateItem(); // Ensure at least one item if Goal Climate is empty
    }
  }

      

}
