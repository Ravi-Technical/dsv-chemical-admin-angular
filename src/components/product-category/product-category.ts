import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ProductCategoryModel, ProductCateogriesModel } from '../../@core/models/commonModels';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../share/message-dialog/message-dialog';
import { MatDialogService } from '../../@core/services/common-service';
import { AdminService } from '../../@core/services/admin-service';
import { NotifyService } from '../../share/mat-snackbar/mat-snack-bar';
import { CharacterSpliting } from '../../@core/pipes/charSplit';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../../share/mat-dialog/mat-dialog';
import { title } from 'process';
import { ResetForms } from '../../share/form_reset_method';
import { DEFAULT_DIALOG_CONFIG } from '../../share/Def_Mat_Dialog_CSS';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-category',
  imports: [CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    CharacterSpliting,
    MatTooltipModule
  ],
  templateUrl: './product-category.html',
  styleUrl: './product-category.scss',
})
export class ProductCategory implements AfterViewInit {

  productCategoryForm!: FormGroup;

  currentElementId: string = '';

  displayedColumns: string[] = [
    'Id',
    'Name',
    'Slug',
    'CreatedDate',
    'ModifyDate',
    'Status',
    'Actions'
  ];

  dataSource = new MatTableDataSource<ProductCategoryModel>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  isEditMode: boolean = false;

  constructor(private fb: FormBuilder, private dataResource: AdminService,
    private notify: NotifyService, private matDialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.productCategoryForm = this.fb.group({
      Name: ['', Validators.required],
      Slug: ['', Validators.required]
    });
    this.Get_All_Categories();
  }

  // Get All Categories
  Get_All_Categories() {
    this.dataResource.Get_Generic_Product_Categoris().subscribe({
      next: (result) => {
        if (!result.success) return;
        this.dataSource.data = result.data ? result.data : [];
      },
      error: () => { }
    })
  }
  
  // Can Deactivate Implementation
  canDeactivate(): boolean | Observable<boolean> {
    if (this.productCategoryForm.pristine) {
      return of(true);
    }
    const matDialofRef = this.matDialog.open(ConfirmDialogComponent, {
       ...DEFAULT_DIALOG_CONFIG,
       data:{title:'Warning !', message:'You have unsaved changes. Do you really want to leave?', buttonType:'Ok'}
    });
    return matDialofRef.afterClosed();
  }

  // Add Fresh New Category Submit Form
  addNewCategory() {
    if (this.isEditMode) {
      if (this.productCategoryForm.dirty && this.productCategoryForm.valid) {
        this.dataResource.Update_Category(this.productCategoryForm.value, this.currentElementId).subscribe({
          next: (result) => {
            if (!result.success) return this.notify.info("Please cross check the input");
            this.notify.success("Category Updated successfully!");
            this.Get_All_Categories();
            ResetForms(this.productCategoryForm);
            this.isEditMode = false;
          },
          error: (error) => { 
            if (error) return this.notify.error("Something went wrong!"); 
          }
        });
      }
      else {
        this.matDialog.open(ConfirmDialogComponent, {
          ...DEFAULT_DIALOG_CONFIG,
          data: { title: "No Changes Made", message: "Please fill in at least one field before submitting", buttonType: "Ok" }
        })
      }
    }
    if (!this.isEditMode) {
      // Add New Category API Calling Here
      this.dataResource.Insert_New_Generic_Category(this.productCategoryForm.value).subscribe({
        next: (result) => {
          if (result.success) this.notify.success("Category Created successfully!");
          this.Get_All_Categories();
          ResetForms(this.productCategoryForm);
        },
        error: (error) => {}
      })
    }
  }

  edit(row: ProductCateogriesModel) {
    this.currentElementId = row.id;
    this.isEditMode = true;
    this.productCategoryForm.setValue({
      Name: row.name,
      Slug: row.slug
    })
  }

  delete(row: ProductCateogriesModel) {
    const matRef = this.matDialog.open(ConfirmDialogComponent, {
      ...DEFAULT_DIALOG_CONFIG,
      data: { title: 'Delete Category', message: 'Are you sure you want to delete this category?', buttonType: 'Delete' }
    });
    matRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataResource.delete_Category(row.id).subscribe({
          next: (result) => {
            if (result) {
              this.Get_All_Categories();
              this.notify.success("Category has been deleted successfully");
            }
          },
          error: (err) => {
            this.matDialog.open(ConfirmDialogComponent, {
              ...DEFAULT_DIALOG_CONFIG,
              data: { title: 'Unable to delete category', message: 'Unable to delete category. Please try again later.', buttonType: 'Error' }
            })
          }
        })

      }
    })
  }

  applyFilter(event: any) {
    const currentFilter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = currentFilter;
  }

  // Close Current Update 
  closeUpdate(){
     this.isEditMode = false;
     ResetForms(this.productCategoryForm);
  }

  // Convert Category Name to Slug
  convertSlug(event:any){
       const name = event.target.value;
       if(name) {
          const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          this.productCategoryForm.get('Slug')?.setValue(slug);
       }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

}
