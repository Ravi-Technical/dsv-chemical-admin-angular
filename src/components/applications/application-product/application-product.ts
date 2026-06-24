import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from '../../../@core/services/application.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ResetForms } from '../../../share/form_reset_method';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../../../share/mat-dialog/mat-dialog';
import { DEFAULT_DIALOG_CONFIG } from '../../../share/Def_Mat_Dialog_CSS';
 

@Component({
  selector: 'app-application-product',
  imports: [ReactiveFormsModule, CommonModule,
    MatFormFieldModule, MatSelectModule,
    MatInputModule, MatProgressSpinnerModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './application-product.html',
  styleUrl: './application-product.scss',
})
export class ApplicationProduct implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() categoriesData!: any[];
  appProductForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isEditingId: string = "";
  tempProductCategory:any[] = [];
  selectedProduct:string = "";
  // Table Data Properties
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  displayedColumns: string[] = ['Name', 'Slug', 'CategoryName', 'actions'];

  constructor(private dataResource: ApplicationService, private fb: FormBuilder, private matDialog: MatDialog,
    private cd: ChangeDetectorRef, private snakbar: MatSnackBar) { }
  ngOnInit(): void {
    this.InitForm();
    this.LoadAllProducts();
  }
  // Init Form
  InitForm(): void {
    this.appProductForm = this.fb.group({
      Title: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      Slug: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      CategoryId: ['', Validators.required]
    })
    this.appProductForm.get('CategoryId')?.setValue("Select Category");
  }
  // Get All Application Products
  LoadAllProducts(): void { 
    this.dataResource.GET_ALL_APPLICATION_PRODUCTS().pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        if (result.success) {
          this.dataSource.data = result.data ? result.data : [];
          this.tempProductCategory = result.data ? result.data : [];
         
        }
      },
      error: (error) => { }
    });
  }
  // Get Form Field Controls
  get f() {
    return this.appProductForm.controls;
  }
  // Get All Application Category() Initial loaded
  onSubmit() {
    this.isLoading = true;
    const payload = this.appProductForm.value;
    console.log(payload);
    const request$ = this.isEditMode && this.isEditingId ? this.dataResource.UPDATE_APPLICATION_PRODUCT(this.isEditingId, payload)
      : this.dataResource.INSERT_FRESH_APPLICATION_PRODUCT(payload);
    if (this.appProductForm.valid && this.appProductForm.dirty) {
      request$.subscribe({
        next: (result) => {
          this.isEditMode = false;
          this.isLoading = false;
          ResetForms(this.appProductForm);
          this.LoadAllProducts();
        },
        error: (error) => { }
      })
    } else {

    }
  }
  // Auto-generate slug from name
  generateSlug(): void {
    const name = this.f['Title'].value;
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      this.f['Slug'].setValue(slug);
    }
  }
  // Edit Product
  onEdit(p: any): void {
    console.log("onEdit data", p); 
    this.isEditMode = true;
    this.isEditingId = p.id; 
   // this.selectedID = p.categoryId;
    this.appProductForm.patchValue({
      Title: p.productTitle,
      Slug: p.productSlug,
      CategoryId:p.categoryId
    });
  }
  // Delete Product
  onDelete(row:any): void {
    console.log("Row", row);
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      ...DEFAULT_DIALOG_CONFIG,
      data: { title: 'Delete Product', message: 'Are you sure want to delete?', buttonType: 'Delete' }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dataResource.DELETE_APPLICATION_PRODUCT_BY_ID(row.productId)
          .pipe(finalize(() => this.cd.detectChanges()))
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.LoadAllProducts();
                this.snakbar.open('Product deleted!', 'Close', { duration: 3000 });
                if (res.data.length == 0) {
                  this.dataSource.data = []
                  this.isEditMode = false;
                } 
              }
            }
          });
      }
    })
  }

  // Reset Form
  resetForm(): void {
    ResetForms(this.appProductForm);
    this.isEditMode = false;
    this.isEditingId = "";
    //this.selectedProduct = "Select Category"; 
    this.appProductForm.get('CategoryId')?.setValue('Select Category');
  }

  // Clean Component Activities
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngAfterViewInit(): void {
   
  }


}
