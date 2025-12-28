import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../services/contact-banner/banner.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from '../../../../app/services/validator/validation.service';

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
  stats!: FormArray;
  detailsId: string | null = null;
  getDetails: any;

  constructor(
    private __fb: FormBuilder,
    private __banner: BannerService,
    private __route: Router,
    private __shared: SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute: ActivatedRoute,
    private __validationService: ValidationService,
  ) {
    // Get ID from route params
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
    this.addEditForm = this.__fb.group({
      title: ['', [Validators.required,this.__validationService.isEmpty, this.__validationService.noSpace]],
      image: [''],
      stats: this.__fb.array([]), // Start with an empty array
    });
    this.stats = this.addEditForm.get('stats') as FormArray;
    this.ensureAtLeastOneStatsItem(); // Always ensure one stats item
  }

  // Getter for stats controls
  get statsControls() {
    return (this.addEditForm.get('stats') as FormArray)?.controls || [];
  }

  // Create a new stats item
  createStatsItem() {
    return this.__fb.group({
      title: [''],
      link: [''],
    });
  }

  // Add stats item
  addStatsItem() {
    this.stats.push(this.createStatsItem());
  }

  // Remove stats item
  removeStatsItem(index: number) {
    this.stats.removeAt(index);
    this.ensureAtLeastOneStatsItem(); // Ensure at least one item remains
  }

  // Ensure at least one stats item exists
  private ensureAtLeastOneStatsItem(): void {
    if (this.stats.length === 0) {
      this.addStatsItem();
    }
  }

  // Submit Form
  add() {
    const data: any = this.addEditForm.value;

    // Validate required image
    if (!this.selectedFile && (!this.getDetails || !this.getDetails.image)) {
      this.__shared.toastError('Please upload an image.');
      return;
    }

    // Filter valid stats entries
    const statsArray = (data.stats || []).filter(
      (stat: any) => stat.title.trim() !== '' && stat.link.trim() !== ''
    );

    const formData = new FormData();
    formData.append('title', data.title);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Add selected file
    } else if (this.getDetails?.image && !this.detailsId) {
      formData.append('image', this.getDetails.image); // Use existing image
    }

    formData.append('stats', JSON.stringify(statsArray));

    const apiCall = this.detailsId
      ? this.__banner.edit(this.detailsId, formData)
      : this.__banner.create(formData);

    apiCall.subscribe(
      (response: any) => {
        if (!response.error) {
          this.displayMessage = this.detailsId
            ? 'Data has been updated successfully'
            : 'Data has been saved successfully';

          this.__shared.toastSuccess(this.displayMessage);
          this.__route.navigate(['/contact-banner/list']);
        } else {
          this.handleError(response.message);
        }
      },
      (err) => this.handleApiError(err)
    );
  }

  // Image Selection
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.__shared.toastError('Invalid file type. Please select a valid image.');
        return;
      }

      // Validate file size (10MB max)
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.__shared.toastError('File size exceeds the 10MB limit.');
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

  // Fetch details for editing
  getDetail() {
    this.__banner.getDetailById(this.detailsId).subscribe(
      (response: any) => {
        if (!response.error) {
          this.getDetails = response?.data;
          this.imagePreview = this.getDetails?.image || null;
          this.patchData();
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
    this.addEditForm.patchValue({
      title: this.getDetails.title || '',
    });

    const statsArray = this.addEditForm.get('stats') as FormArray;
    statsArray.clear(); // Clear existing stats

    if (this.getDetails?.stats?.length) {
      this.getDetails.stats.forEach((stat: any) => {
        statsArray.push(
          this.__fb.group({
            title: [stat.title || ''],
            link: [stat.link || ''],
          })
        );
      });
    } else {
      this.ensureAtLeastOneStatsItem(); // Ensure at least one item if stats are empty
    }
  }

  // Error handling
  private handleError(message: string): void {
    this.errorMessage = message;
    this.__shared.toastError(this.errorMessage);
  }

  private handleApiError(err: any): void {
    this.errorMessage = err.error?.message || 'An error occurred';
    if (err.status === 403) {
      this.__shared.sessionExpired();
    } else {
      this.__shared.toastError(this.errorMessage);
    }
  }
}
