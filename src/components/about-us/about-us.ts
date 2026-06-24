import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatDialogService } from '../../@core/services/common-service';
import { ConfirmDialogComponent } from '../../share/mat-dialog/mat-dialog';
import { DEFAULT_DIALOG_CONFIG } from '../../share/Def_Mat_Dialog_CSS';
import { NotifyService } from '../../share/mat-snackbar/mat-snack-bar';
import { AdminService } from '../../@core/services/admin-service';
import { ResetForms } from '../../share/form_reset_method';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, CKEditorModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AboutUs implements OnInit {
  courseForm!: FormGroup;
  public Editor: any = null;
  public isBrowser = false;
  selectedImageUrl: string = '';
  isUploading: boolean = false;
  selectedCertificateUrl: string = '';
  isUploadingCertificate: boolean = false;
  previewData: any;
  isEdit: boolean = false;
  isModifying: boolean = false;

  public editorConfig = {
    height: 350,
    toolbar: [
      'undo', 'redo', '|',
      'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
      '|', 'insertTable', 'imageUpload', 'mediaEmbed', 'removeFormat'
    ],
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private matDialog: MatDialog,
    private notify: NotifyService,
    private commonService: MatDialogService,
    private dataResource: AdminService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

    this.isBrowser = isPlatformBrowser(this.platformId);
    // Form editor setup
    if (this.isBrowser) {
      import('@ckeditor/ckeditor5-build-classic').then((module) => {
        this.Editor = module.default ?? module;
      }).catch((err) => {
        console.error('CKEditor load failed', err);
      });
    }
    this.initializeForm();
  }
  ngOnInit(): void {
    this.getAboutData();
  }

  getAboutData() {
    this.dataResource.Get_About_Data().subscribe({
      next: (result) => {
        if (result.success) {
          this.previewData = [];
          this.previewData = result.data ? result.data[0] : [];
        }
      },
      error: (error) => { }
    })
  }

  initializeForm(): void {
    this.courseForm = this.fb.group({
      name: [''],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      certificateImageUrl: ['']
    });
  }
  // Reset Image Upload 
  resetImage() {
    this.isUploading = false;
    this.selectedImageUrl = '';
    this.courseForm.patchValue({
      imageUrl: ''
    });
  }
  // Reset Certificate Image
  resetCerficateImage() {
    this.isUploadingCertificate = false;
    this.selectedCertificateUrl = '';
    this.courseForm.patchValue({
      certificateImageUrl: ''
    })
  }
  // About Image Upload
  onSelectImage(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.isUploading = true;
    this.commonService.uploadImage(file).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedImageUrl = result.secure_url;
        this.courseForm.patchValue({
          imageUrl: result.secure_url
        });
        this.isUploading = false;
        this.notify.success("Image Upload Successfully");
      },
      error: (error) => { 
        this.matDialog.open(ConfirmDialogComponent, {
          ...DEFAULT_DIALOG_CONFIG,
          data: { title: "Something went wrong", message: error.error.message, buttonType: 'Ok' }
        })
      }
    })
  }
  // About Certificate Upload
  onSelectCertificate(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.isUploadingCertificate = true;
    this.commonService.uploadImage(file).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedCertificateUrl = result.secure_url;
        this.courseForm.patchValue({
          certificateImageUrl: result.secure_url
        });
        this.isUploadingCertificate = false;
        this.notify.success("Certificate Upload Successfully");
      },
      error: (error) => {
        console.error(error);
        this.matDialog.open(ConfirmDialogComponent, {
          ...DEFAULT_DIALOG_CONFIG,
          data: { title: "Something went wrong", message: error.error.message, buttonType: 'Ok' }
        })
      }
    })
  }

  onSubmit() {
    this.formValidation();
    const payload = this.courseForm.value;
    if (this.isEdit) {
      const hasChanged = Object.keys(payload).some(
        key => payload[key] !== this.previewData[key]
      );
      if (!hasChanged) {
        this.matDialog.open(ConfirmDialogComponent, {
          ...DEFAULT_DIALOG_CONFIG,
          data: { title: "No changes detected.", message: "Please change any field of content", buttonType: 'Ok' }
        });
        return;
      }

      // Call the update API Here
      const currentDataId = this.previewData.id;
      this.dataResource.Update_About_Data(payload, currentDataId ?? currentDataId).subscribe({
        next: (result) => {
          if (result.success) {
            this.isEdit = false;
            this.isModifying = false;
            this.cd.detectChanges();
            this.previewData = [];
            this.previewData = result.data ? result.data : [];
            this.notify.success("About has been updated successfully");
            ResetForms(this.courseForm);
            this.resetCerficateImage();
            this.resetImage();
          }
        },
        error: (error) => {
          this.matDialog.open(ConfirmDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: { title: "Something went wrong!", message: error.error.message, buttonType: 'Ok' }
          });
        }
      })
    } else {
      const isValid = payload.name && payload.description && payload.imageUrl && payload.certificateImageUrl;
      if (!isValid) {
        this.matDialog.open(ConfirmDialogComponent, {
          ...DEFAULT_DIALOG_CONFIG,
          data: { title: 'Fill the input filed', message: "Please fill the input fileds", buttontype: 'Ok' }
        })
      } else {
        this.dataResource.Insert_About_Data(payload)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.getAboutData();
                this.matDialog.open(ConfirmDialogComponent, {
                  ...DEFAULT_DIALOG_CONFIG,
                  data: { title: "About Data Inserted Success", message: response.message, buttonType: 'Ok' }
                });
                this.isModifying = false;
              }
              this.courseForm.reset();
              ResetForms(this.courseForm);
              this.resetCerficateImage();
              this.resetImage();
            },
            error: (error) => {
              this.matDialog.open(ConfirmDialogComponent, {
                ...DEFAULT_DIALOG_CONFIG,
                data: { title: 'Something went wrong', message: error.error.title, buttontype: 'Ok' }
              })
            }
          });
      }
    }
  }

  // Update About Data
  editAbout() {
    this.isModifying = true;
    this.isEdit = true;
    this.courseForm.patchValue({
      name: this.previewData.name,
      description: this.previewData.description,
      imageUrl: this.previewData.imageUrl,
      certificateImageUrl: this.previewData.certificateImageUrl
    })
    this.selectedCertificateUrl = this.previewData.certificateImageUrl.trim();
    this.selectedImageUrl = this.previewData.imageUrl.trim();
    this.cd.detectChanges();
  }

  formValidation() {
    if (this.courseForm.invalid && !this.courseForm.value) {
      debugger
      this.courseForm.markAllAsTouched();
      this.matDialog.open(ConfirmDialogComponent, {
        ...DEFAULT_DIALOG_CONFIG,
        data: { title: 'Fill input field', message: 'Please fill all required fields!', buttontype: 'Ok' }
      })
    }
  }

} // END MAIN CLASS HERE
