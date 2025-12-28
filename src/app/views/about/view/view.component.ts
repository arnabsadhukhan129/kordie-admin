import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AboutService } from '../../../services/about-us/about.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../services/product/product.service';
import { EditorService } from '../../../services/editor/editor.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  detailsId: string | null = null;
    addEditForm!: FormGroup;
    about_banner!: FormArray;
    economic_section!: FormArray;
    bannerImagePreviews: any = [];
    jobImagePreviews:any = [];
    storyImagePreviews:any = [];
    nextImagePreviews: any = [];
    nextIconPreviews: any = [];
    isLoading = false;
    displayMessage: string = '';
    errorMessage: string = '';
    selectedFile: File | null = null;
    selectedFile1: File | null = null;
    seeVideoPreview: string | null = null;
    economicIconPreview: string | null = null;
    videoUrl: string = '';
    economicIconUrl: string = '';
    economicImageUrl: string = '';
    worldIconUrl: string = '';
    economicImagePreview: string | null = null;
    worldIconPreview: string | null = null;
    world_section!: FormArray;
    world_subsection!: FormArray;
    learningImagePreview: string | null = null;
    kordieImagePreview: string | null = null;
    liveImagePreview: string | null = null;
    kordieImageUrl: string = '';
    liveImageUrl: string = '';
    learningImageUrl: string = '';
    learning_skill!: FormArray;
    kordie_job_section!: FormArray;
    kordie_industries_section!: FormArray;
    story_section!: FormArray;
    live_section!: FormArray;
    next_section!: FormArray;
    getDetails: any;
    editorConfig: any;
    

  constructor(
    private __fb: FormBuilder,
    private __about: AboutService,
    private __route: Router,
    private __shared: SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute: ActivatedRoute,
    private _product: ProductService,
    private editorSettings: EditorService
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.detailsId = params.get('id');
      },
      error: (err) => {},
    });
    this.editorConfig = this.editorSettings.viewEditorConfig();
   }

  ngOnInit(): void {
    this.createForm();
    if (this.detailsId) {
      this.getDetail();
      // console.log("get detail done");
    }
  }

  // Initialize Form
    createForm() {
      // console.log("form initialization started");
      this.addEditForm = this.__fb.group({
        about_title: ['',],
        about_description: ['',],
        about_banner: this.__fb.array([]), // Start with an empty array
        see_title: [''],
        see_description: [''],
        see_type: ['video'],
        see_media: [''],
        economic_title: [''],
        economic_section: this.__fb.array([]), // Start with an empty array,
        economic_icon: [''],
        economic_description: [''],
        economic_image: [''],
        world_icon: [''],
        world_title: [''],
        world_section: this.__fb.array([]), // Start with an empty array,
        world_subsection: this.__fb.array([]), // Start with an empty array,
        learning_title: [''],
        learning_image: [''],
        learning_subtitle: [''],
        learning_below_subtitle: [''],
        learning_description: [''],
        learning_skill: this.__fb.array([]), // Start with an empty array,
        kordie_title: [''],
        kordie_image: [''],
        kordie_description: [''],
        kordie_job_subtitle: [''],
        kordie_job_section: this.__fb.array([]), // Start with an empty array,
        kordie_industries_title: [''],
        kordie_industries_section: this.__fb.array([]), // Start with an empty array,
        story_title: [''],
        story_section: this.__fb.array([]), // Start with an empty array,
        live_title: [''],
        live_section: this.__fb.array([]), // Start with an empty array,
        live_image: [''],
        next_title: [''],
        next_section: this.__fb.array([]), // Start with an empty array,
      });
  
      this.about_banner = this.addEditForm.get('about_banner') as FormArray;
      this.ensureAtLeastOneBannerSubsectionItem(); // Always ensure one about banner item
  
      this.economic_section = this.addEditForm.get('economic_section') as FormArray;
      this.ensureAtLeastOneEconomicSubsectionItem(); // Always ensure one economic section item
  
      this.world_section = this.addEditForm.get('world_section') as FormArray;
      this.ensureAtLeastOneWorldSubsectionItem(); // Always ensure one world section item
  
      this.world_subsection = this.addEditForm.get('world_subsection') as FormArray;
      this.ensureAtLeastOneWorldSubSubsectionItem(); // Always ensure one world subsection item
  
      this.learning_skill = this.addEditForm.get('learning_skill') as FormArray;
      this.ensureAtLeastOneSkillsectionItem(); // Always ensure one learning skill item
  
      this.kordie_job_section = this.addEditForm.get('kordie_job_section') as FormArray;
      this.ensureAtLeastOneJobsectionItem(); // Always ensure one kordie job section item
  
      this.kordie_industries_section = this.addEditForm.get('kordie_industries_section') as FormArray;
      this.ensureAtLeastOneIndustriessectionItem(); // Always ensure one kordie industries section item
  
      this.story_section = this.addEditForm.get('story_section') as FormArray;
      this.ensureAtLeastOneStorysectionItem(); // Always ensure one story section item
  
      this.live_section = this.addEditForm.get('live_section') as FormArray;
      this.ensureAtLeastOneLivesectionItem(); // Always ensure one live section item
  
      this.next_section = this.addEditForm.get('next_section') as FormArray;
      this.ensureAtLeastOneNextsectionItem(); // Always ensure one next section item
    }
  
    //Getter.....................................................................
      // Getter for Banner controls
        get bannerControls() {
          return (this.addEditForm.get('about_banner') as FormArray)?.controls || [];
        }
      // Getter for economic section controls
        get economicControls() {
          return (this.addEditForm.get('economic_section') as FormArray)?.controls || [];
        }
      // Getter for world section controls
        get worldControls() {
          return (this.addEditForm.get('world_section') as FormArray)?.controls || [];
        }
      // Getter for world section controls
        get worldSubControls() {
          return (this.addEditForm.get('world_subsection') as FormArray)?.controls || [];
        }
      // Getter for skill controls
        get sillsControls() {
          return (this.addEditForm.get('learning_skill') as FormArray)?.controls || [];
        }
      // Getter for skill controls
      get jobControls() {
        return (this.addEditForm.get('kordie_job_section') as FormArray)?.controls || [];
      }
      // Getter for industries controls
      get industriesControls() {
        return (this.addEditForm.get('kordie_industries_section') as FormArray)?.controls || [];
      }
      // Getter for Story controls
      get storyControls() {
        return (this.addEditForm.get('story_section') as FormArray)?.controls || [];
      }
       // Getter for Live controls
       get liveControls() {
        return (this.addEditForm.get('live_section') as FormArray)?.controls || [];
      }
  
      // Getter for Live controls
      get nextControls() {
        return (this.addEditForm.get('next_section') as FormArray)?.controls || [];
      }
  
  
  
    //Create.............................................................
      // Create a new banner item
        createBannerItem() {
          return this.__fb.group({
            image:[''],
          });
        }
      // Create a new economic section item
        createEconomicItem() {
          return this.__fb.group({
            title:[''],
          });
        }
      // Create a new world section item
        createWorldItem() {
          return this.__fb.group({
            title: [''],
            description: ['']
          });
        }
      // Create a new world section item
        createWorldSubItem() {
          return this.__fb.group({
            title: [''],
            subtitle: ['']
          });
        }
       // Create a new world section item
       createSkillItem() {
        return this.__fb.group({
          title: ['']
        });
      }  
      // Create a new world section item
      createJobItem() {
        return this.__fb.group({
          title: [''],
          description: [''],
          image:['']
        });
      }  
       // Create a Industries section item
       createIndustriesItem() {
        return this.__fb.group({
          title: ['']
        });
      } 
      // Create a new story section item
      createStoryItem() {
        return this.__fb.group({
          description: [''],
          image:['']
        });
      }  
      // Create a new story section item
      createLiveItem() {
        return this.__fb.group({
          title: [''],
          description: ['']
        });
      }  
      
      // Create a new story section item
      createNextSectionItem() {
        return this.__fb.group({
          title: [''],
          description: [''],
          image:[''],
          icon:['']
        });
      }  
  
  
  
    //Add................................................................
      // Add banner item
        addBannersubsectionItem() {
          this.about_banner.push(this.createBannerItem());
        }
      // Add economic item
        addEconomicItem() {
          this.economic_section.push(this.createEconomicItem());
        }
  
      // Add world section item
        addWorldSectionItem() {
          this.world_section.push(this.createWorldItem());
        }
  
      // Add world subsection item
        addWorldSubsectionItem() {
          this.world_subsection.push(this.createWorldSubItem());
        }
      // Add world subsection item
      addSkillItem() {
        this.learning_skill.push(this.createSkillItem());
      }
      // Add Kordie Job item
      addJobItem(){
        this.kordie_job_section.push(this.createJobItem());
      }
      // Add Kordie Industries item
      addIndustriesItem(){
        this.kordie_industries_section.push(this.createIndustriesItem());
      }
      // Add story section item
      addStoryItem(){
        this.story_section.push(this.createStoryItem());
      }
      // Add live section item
      addLiveItem(){
        this.live_section.push(this.createLiveItem());
      }
      // Add live section item
      addnextSectionItem(){
        this.next_section.push(this.createNextSectionItem());
      }
  
  
    //Remove...................................................................
      // Remove Banner item
        removeBannersubsectionItem(index: number) {
          this.about_banner.removeAt(index);
          this.bannerImagePreviews[index]= '';
          this.ensureAtLeastOneBannerSubsectionItem(); // Ensure at least one item remains
        }
      // Remove economic section item
        removeEconomicItem(index: number) {
          this.economic_section.removeAt(index);
          this.ensureAtLeastOneEconomicSubsectionItem(); // Ensure at least one item remains
        }
      // Remove world section item
        removeworldSectionItem(index: number) {
          this.world_section.removeAt(index);
          this.ensureAtLeastOneWorldSubsectionItem(); // Ensure at least one item remains
        }
      // Remove world subsection item
        removeworldSubsectionItem(index: number) {
          this.world_subsection.removeAt(index);
          this.ensureAtLeastOneWorldSubSubsectionItem(); // Ensure at least one item remains
        }
      // Remove Learning Skill item
        removeSkillItem(index: number) {
          this.learning_skill.removeAt(index);
          this.ensureAtLeastOneSkillsectionItem(); // Ensure at least one item remains
        }
      
       // Remove Learning Skill item
       removeJobItem(index: number) {
        this.jobImagePreviews[index]= '';
        this.kordie_job_section.removeAt(index);
        this.ensureAtLeastOneJobsectionItem(); // Ensure at least one item remains
      }  
  
      // Remove Learning Skill item
      removeIndustriesItem(index: number) {
        this.kordie_industries_section.removeAt(index);
        this.ensureAtLeastOneIndustriessectionItem(); // Ensure at least one item remains
      }  
  
      // Remove story section item
      removeStoryItem(index: number) {
        this.storyImagePreviews[index]= '';
        this.story_section.removeAt(index);
        this.ensureAtLeastOneStorysectionItem(); // Ensure at least one item remains
      } 
      
      // Remove Live section item
      removeLiveItem(index: number) {
        this.live_section.removeAt(index);
        this.ensureAtLeastOneLivesectionItem(); // Ensure at least one item remains
      }  
  
      // Remove Next section item
      removenextSectionItem(index: number) {
        this.nextImagePreviews[index]= '';
        this.nextIconPreviews[index]= '';
        this.next_section.removeAt(index);
        this.ensureAtLeastOneNextsectionItem(); // Ensure at least one item remains
      }  
  
  
    //Ensure...................................................................
      // Ensure at least one impactsubsection item exists
      private ensureAtLeastOneBannerSubsectionItem(): void {
        if (this.about_banner.length === 0) {
          this.addBannersubsectionItem();
        }
      }
      private ensureAtLeastOneEconomicSubsectionItem(): void {
        if (this.economic_section.length === 0) {
          this.addEconomicItem();
        }
      }
      private ensureAtLeastOneWorldSubsectionItem(): void {
        if (this.world_section.length === 0) {
          this.addWorldSectionItem();
        }
      }
      private ensureAtLeastOneWorldSubSubsectionItem(): void {
        if (this.world_subsection.length === 0) {
          this.addWorldSubsectionItem();
        }
      }
  
      private ensureAtLeastOneSkillsectionItem(): void {
        if (this.learning_skill.length === 0) {
          this.addSkillItem();
        }
      }
  
      private ensureAtLeastOneJobsectionItem(): void {
        if (this.kordie_job_section.length === 0) {
          this.addJobItem();
        }
      }
  
      private ensureAtLeastOneIndustriessectionItem(): void {
        if (this.kordie_industries_section.length === 0) {
          this.addIndustriesItem();
        }
      }
  
      private ensureAtLeastOneStorysectionItem(): void {
        if (this.story_section.length === 0) {
          this.addStoryItem();
        }
      }
  
      private ensureAtLeastOneLivesectionItem(): void {
        if (this.live_section.length === 0) {
          this.addLiveItem();
        }
      }
  
      private ensureAtLeastOneNextsectionItem(): void {
        if (this.next_section.length === 0) {
          this.addnextSectionItem();
        }
      }

      // Fetch details for editing
  getDetail() {
    this.__about.getDetailById(this.detailsId).subscribe(
      (response: any) => {
        if (!response.error) {
          this.getDetails = response?.data;
          this.seeVideoPreview = this.getDetails?.see_media || '',
          this.economicIconPreview = this.getDetails?.economic_icon || '', 
          this.economicImagePreview = this.getDetails?.economic_image || '', 
          this.worldIconPreview = this.getDetails?.world_icon || '',
          this.learningImagePreview = this.getDetails?.learning_image || '',
          this.kordieImagePreview = this.getDetails?.kordie_image || '',
          this.liveImagePreview = this.getDetails?.live_image || ''
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

  patchData(){
    this.addEditForm.patchValue({
      about_title: this?.getDetails?.about_title || '',
      about_description: this?.getDetails?.about_description || '',
      see_title: this?.getDetails?.see_title || '',
      see_description: this?.getDetails?.see_description || '',
      economic_title: this?.getDetails?.economic_title || '',
      economic_description: this?.getDetails?.economic_description || '',
      world_title: this?.getDetails?.world_title || '',
      learning_title: this?.getDetails?.learning_title || '',
      learning_subtitle: this?.getDetails?.learning_subtitle || '',
      learning_below_subtitle: this?.getDetails?.learning_below_subtitle || '',
      learning_description: this?.getDetails?.learning_description || '',
      kordie_title: this?.getDetails?.kordie_title || '',
      kordie_description: this?.getDetails?.kordie_description || '',
      kordie_job_subtitle: this?.getDetails?.kordie_job_subtitle || '',
      kordie_industries_title: this?.getDetails?.kordie_industries_title || '',
      story_title: this?.getDetails?.story_title || '',
      live_title: this?.getDetails?.live_title || '',
      next_title: this?.getDetails?.next_title || '',
    });

    //About Banner...........
    const bannerArray = this.addEditForm.get('about_banner') as FormArray;
    bannerArray.clear(); // Clear existing
    if (this.getDetails?.about_banner?.length) {
      this.getDetails.about_banner.forEach((banner: any, index: number) => {
        bannerArray.push(
          this.__fb.group({
            image: [banner.image || ''],
          })
        );
        // Update the image preview array
        this.bannerImagePreviews[index] = banner?.image || '';
      });
    } else {
      this.ensureAtLeastOneBannerSubsectionItem(); 
    }

    //Economic Section...........
    const sectionArray = this.addEditForm.get('economic_section') as FormArray;
    sectionArray.clear(); // Clear existing
    if (this.getDetails?.economic_section?.length) {
      this.getDetails.economic_section.forEach((section: any, index: number) => {
        sectionArray.push(
          this.__fb.group({
            title: [section.title || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneEconomicSubsectionItem(); 
    }

    //World Section...........
    const worldArray = this.addEditForm.get('world_section') as FormArray;
    worldArray.clear(); // Clear existing
    if (this.getDetails?.world_section?.length) {
      this.getDetails.world_section.forEach((world: any, index: number) => {
        worldArray.push(
          this.__fb.group({
            title: [world.title || ''],
            description: [world.description || '']
          })
        );
      });
    } else {
      this.ensureAtLeastOneWorldSubsectionItem(); 
    }

    //World Subsection...........
    const worldSubArray = this.addEditForm.get('world_subsection') as FormArray;
    worldSubArray.clear(); // Clear existing
    if (this.getDetails?.world_subsection?.length) {
      this.getDetails.world_subsection.forEach((subsection: any, index: number) => {
        worldSubArray.push(
          this.__fb.group({
            title: [subsection.title || ''],
            subtitle: [subsection.subtitle || '']
          })
        );
      });
    } else {
      this.ensureAtLeastOneWorldSubSubsectionItem(); 
    }

    //Learning skill...........
    const learningArray = this.addEditForm.get('learning_skill') as FormArray;
    learningArray.clear(); // Clear existing
    if (this.getDetails?.learning_skill?.length) {
      this.getDetails.learning_skill.forEach((learning: any, index: number) => {
        learningArray.push(
          this.__fb.group({
            title: [learning.title || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneSkillsectionItem(); 
    }

    //Kordie Job Section...........
    const jobArray = this.addEditForm.get('kordie_job_section') as FormArray;
    jobArray.clear(); // Clear existing
    if (this.getDetails?.kordie_job_section?.length) {
      this.getDetails.kordie_job_section.forEach((job: any, index: number) => {
        jobArray.push(
          this.__fb.group({
            title: [job.title || ''],
            description: [job.description || ''],
            image: [job.image || ''],
          })
        );
        // Update the image preview array
        this.jobImagePreviews[index] = job?.image || '';
      });
    } else {
      this.ensureAtLeastOneJobsectionItem(); 
    }

     //Kordie Industries Section...........
     const industriesArray = this.addEditForm.get('kordie_industries_section') as FormArray;
     industriesArray.clear(); // Clear existing
     if (this.getDetails?.kordie_industries_section?.length) {
       this.getDetails.kordie_industries_section.forEach((industries: any, index: number) => {
         industriesArray.push(
           this.__fb.group({
             title: [industries.title || ''],
           })
         );
       });
     } else {
       this.ensureAtLeastOneIndustriessectionItem(); 
     }

    //Story Section...........
    const storyArray = this.addEditForm.get('story_section') as FormArray;
    storyArray.clear(); // Clear existing
    if (this.getDetails?.story_section?.length) {
      this.getDetails.story_section.forEach((story: any, index: number) => {
        storyArray.push(
          this.__fb.group({
            description: [story.description || ''],
            image: [story.image || ''],
          })
        );
        // Update the image preview array
        this.storyImagePreviews[index] = story?.image || '';
      });
    } else {
      this.ensureAtLeastOneStorysectionItem(); 
    }

    //Live Section...........
    const liveArray = this.addEditForm.get('live_section') as FormArray;
    liveArray.clear(); // Clear existing
    if (this.getDetails?.live_section?.length) {
      this.getDetails.live_section.forEach((live: any, index: number) => {
        liveArray.push(
          this.__fb.group({
            title: [live.title || ''],
            description: [live.description || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneLivesectionItem(); 
    }

     //Next Section...........
     const nextArray = this.addEditForm.get('next_section') as FormArray;
     nextArray.clear(); // Clear existing
     if (this.getDetails?.next_section?.length) {
       this.getDetails.next_section.forEach((next: any, index: number) => {
         nextArray.push(
           this.__fb.group({
             title: [next.title || ''],
             description: [next.description || ''],
             image: [next.image || ''],
             icon: [next.icon || ''],
           })
         );
         // Update the image preview array
         this.nextImagePreviews[index] = next?.image || '';

        // Update the icon preview array
        this.nextIconPreviews[index] = next?.icon || '';
       });
     } else {
       this.ensureAtLeastOneNextsectionItem(); 
     }

  }

}
