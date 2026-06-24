import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationService } from '../../@core/services/application.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { finalize, Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from '../../share/mat-dialog/mat-dialog';
import { ResetForms } from '../../share/form_reset_method';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ApplicationProduct } from './application-product/application-product';
import { DEFAULT_DIALOG_CONFIG } from '../../share/Def_Mat_Dialog_CSS';

@Component({
  selector: 'app-applications',
  imports: [ReactiveFormsModule, CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule, MatPaginatorModule,
    MatSortModule, ApplicationProduct],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications implements OnInit, OnDestroy, AfterViewInit {

  //shareCategoriesData:any[] = [];
  // Form
  categoryForm!: FormGroup;
  isEditMode = false;
  editingId: string | null = null;
  isLoading = false;

  // Table
  categories = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  displayedColumns: string[] = ['applicationName', 'slug', 'isActive', 'actions'];

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar, private matDialog: MatDialog, private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      applicationName: ['', [Validators.required, Validators.maxLength(100)]],
      slug: ['', [Validators.required, Validators.maxLength(100)]],
      isActive: true
    });
  }

  loadCategories(): void {
    //this.isLoading = true;
    this.applicationService.GET_ALL_APPLICATION_CATEGORIES().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories.data = res.data ?? res.data;
        } else {
          this.categories.data = res.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid && this.categoryForm.dirty) {
      this.isLoading = true;
      const payload = this.categoryForm.value;
      const request$ = this.isEditMode && this.editingId ? this.applicationService.UPDATE_SINGLE_APPLICATION_CATEGORY(payload, this.editingId)
        : this.applicationService.INSERT_APPLICATION_CATEGORY(payload);
      request$.pipe(finalize(() => {
        this.isLoading = false;
        this.cd.detectChanges();
      }))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.snackBar.open(
                this.isEditMode ? 'Category updated successfully' : 'Category has been created successfully',
                'Close', { duration: 3000 }
              );
              ResetForms(this.categoryForm);
              this.categoryForm.setValue({
                isActive: true
              });
              // Reload categories AFTER success
              this.loadCategories();
            }
            this.isLoading = false;
            this.isEditMode = false;
          },
          error: () => {
            this.snackBar.open('Something went wrong', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
    } else {
      this.matDialog.open(ConfirmDialogComponent, {
        ...DEFAULT_DIALOG_CONFIG,
        data: { title: 'No Changes Made', message: 'Please fill in at least one field before submitting', buttonType: 'Ok' }
      })
    }
  }

  onEdit(category: any): void {
    this.isEditMode = true;
    this.editingId = category.id;
    this.categoryForm.patchValue({
      applicationName: category.applicationName,
      slug: category.slug,
      isActive: category.isActive
    });
  }

  onDelete(id: string): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      ...DEFAULT_DIALOG_CONFIG,
      data: { title: 'Delete Product', message: 'Are you sure want to delete?', buttonType: 'Delete' }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.applicationService.DELETE_SINGLE_APPLICATION_CATEGORY(id)
          .pipe(finalize(() => this.cd.detectChanges()))
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBar.open('Category deleted!', 'Close', { duration: 3000 });
                if (res.data.length == 0) {
                  this.categories.data = []
                  this.isEditMode = false;
                }
                this.loadCategories();
              }
            }
          });
      }
    })
  }

  // Can Deactivate Implementation
  canDeactivate(): boolean | Observable<boolean> {
    if (this.categoryForm.pristine) {
      return of(true);
    }
    const matDialofRef = this.matDialog.open(ConfirmDialogComponent, {
      ...DEFAULT_DIALOG_CONFIG,
      data: { title: 'Warning !', message: 'You have unsaved changes. Do you really want to leave?', buttonType: 'Ok' }
    });
    return matDialofRef.afterClosed();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.categoryForm.reset({ isActive: true });
    this.categoryForm.setValue({
      isActive: true
    });
    this.editingId = null;
  }

  // Helper for template
  get f() { return this.categoryForm.controls; }

  // Auto-generate slug from name
  generateSlug(): void {
    const name = this.f['applicationName'].value;
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      this.f['slug'].setValue(slug);
    }
  }

  ngOnDestroy(): void {
    this.isEditMode = false;
    this.cd.detectChanges();
  }


  ngAfterViewInit() {
    this.categories.paginator = this.paginator;
    this.categories.sort = this.matSort;
  }

}