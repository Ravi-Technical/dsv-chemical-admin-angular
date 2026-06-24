import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IProduct, ProductModel } from '../../@core/models/commonModels';
import { MatSelectModule } from '@angular/material/select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdminService } from '../../@core/services/admin-service';
import { catchError, forkJoin, Observable } from 'rxjs';
import { CharacterSpliting } from '../../@core/pipes/charSplit';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { NotifyService } from '../../share/mat-snackbar/mat-snack-bar';
import { ConfirmDialogComponent } from '../../share/mat-dialog/mat-dialog';
import { ResetForms } from '../../share/form_reset_method';
import { mapProductCategoryName } from '../../share/mapProductWithCategory';
import { of } from 'rxjs';
import { DEFAULT_DIALOG_CONFIG } from '../../share/Def_Mat_Dialog_CSS';
import { title } from 'process';
import { MatDialogService } from '../../@core/services/common-service';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    CKEditorModule,
    CharacterSpliting,
    MatTooltipModule
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class Products implements OnInit, AfterViewInit {

  public Editor: any = null;
  public isBrowser = false;
  selectedImageUrl: string = "";
  isUploading: boolean = false;

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
  text = '';
  productForm!: FormGroup;
  displayedColumns: string[] = [
    'Id',
    'Name',
    'Category',
    'Description',
    'Slug',
    'ImageUrl',
    'CreatedDate',
    'ModifiedDate',
    'Status',
    'Actions'
  ];
  dataSource = new MatTableDataSource<ProductModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  categoryList: any[] = [];
  isEditMode: boolean = false;
  currentId: string = "";
  existingProductData: any[] = [];

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object, private adminService: AdminService,
    private matDialog: MatDialog, private notify: NotifyService, private commonService: MatDialogService) {

    this.isBrowser = isPlatformBrowser(this.platformId);
    // Form editor setup
    if (this.isBrowser) {
      import('@ckeditor/ckeditor5-build-classic').then((module) => {
        this.Editor = module.default ?? module;
      }).catch((err) => {
        console.error('CKEditor load failed', err);
      });
    }
    // Form setup here
    this.productForm = this.fb.group({
      Name: ['', Validators.required],
      Slug: ['', Validators.required],
      ProductCategoryId: ['', Validators.required],
      Description: ['', Validators.required],
      ImageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllProducts();
  } // END ngOnInit();

  // Load All Products 
  loadAllProducts() {
    forkJoin({
      products: this.adminService.GetAllProduct().pipe(
        catchError(err => {
          console.log('❌ Products API failed:', err); // ADD THIS

          this.matDialog.open(ConfirmDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: { title: 'API Failed!', message: err.error.message, buttonType: 'Ok' }
          })
          return of(null);
        })
      ),
      categories: this.adminService.Get_Generic_Product_Categoris().pipe(
        catchError(err => {
          console.log('❌ Categories API failed:', err); // ADD THIS

          this.matDialog.open(ConfirmDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: { title: "API Failed!", message: err.error.message, buttonType: 'Ok' }
          })
          return of(null);
        })
      )

    }).subscribe({
      next: (res) => {
        const products = res.products?.data ? res.products?.data : [];
        const categories = res.categories?.data ? res.categories?.data : [];
        this.categoryList = categories ? categories : [];
        const data = mapProductCategoryName(products, categories);
        this.dataSource.data = data;
      },
      error: (error) => {
        //this.notify.error(error.error.Message);
      },
      complete: () => { }
    })
  }

  // Get Product By Id
  GetSingleProductById(id: string) {
    this.adminService.GetProductById(id).subscribe({
      next: (result) => {
        this.existingProductData = result.success ? result.data : [];
      },
      error: (error) => {
        this.notify.error(error.error.Message);
      }
    })
  }

  // Can Deactivate Implementation
  canDeactivate(): boolean | Observable<boolean> {
    if (this.productForm.pristine) {
      return of(true);
    }
    const matDialofRef = this.matDialog.open(ConfirmDialogComponent, {
      ...DEFAULT_DIALOG_CONFIG,
      data: { title: 'Warning !', message: 'You have unsaved changes. Do you really want to leave?', buttonType: 'Ok' }
    });
    return matDialofRef.afterClosed();
  }

  // Reset Image
  resetImage() {
    this.isUploading = false;
    this.selectedImageUrl = "";
    this.productForm.patchValue({
      ImageUrl: ''
    })
  }

  // On Select Image
  onSelectImage(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.isUploading = true;
    this.commonService.uploadImage(file).subscribe({
      next: (result) => {
        debugger
        this.isUploading = false;
        this.selectedImageUrl = result.secure_url;
        this.productForm.patchValue({
          ImageUrl: result.secure_url
        })
        this.notify.success("Image Upload Successfully");
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
  // Add Fresh New Category Submit Form
  addNewProduct() {
    if (this.isEditMode) {
      if (this.productForm.valid && this.productForm.dirty) {
        this.updateNewMethod();
      } else {
        this.matDialog.open(ConfirmDialogComponent, {
          ...DEFAULT_DIALOG_CONFIG,
          data: { title: "No Changes Made", message: "Please fill in at least one field before submitting", buttonType: "Ok" }
        })
      }
    } else {
      if (this.productForm.valid && this.productForm.value) {
        this.adminService.Insert_New_Product(this.productForm.value).subscribe({
          next: (result) => {
            if (result.success) {
              this.loadAllProducts();
              this.selectedImageUrl = "";
              this.notify.success(result.message);
              ResetForms(this.productForm);
            } else {
              this.notify.error(result.message);
            }
          },
          error: (error) => {
            console.log("BUg find");
            this.notify.error(error.error.Message);
          }
        })
      }
    }
  }

  // Update Method
  updateNewMethod() {
    this.adminService.UpdateProductById(this.productForm.value, this.currentId).subscribe({
      next: (result) => {
        if (result.success) {
          this.notify.success(result.message);
          ResetForms(this.productForm);
          this.isEditMode = false;
          this.loadAllProducts();
        }
      },
      error: (error) => {
        this.notify.error(error.error.Message);
      }
    })
  }

  edit(row: IProduct) {
    this.isEditMode = true;
    this.currentId = "";
    this.GetSingleProductById(row.id);
    this.currentId = row.id;
    this.productForm.setValue({
      Name: row.name,
      Slug: row.slug,
      ProductCategoryId: row.productCategoryId,
      Description: row.description,
      ImageUrl: row.imageUrl
    })
  }
  delete(row: IProduct) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      ...DEFAULT_DIALOG_CONFIG,
      data: { title: 'Delete Product', message: 'Are you sure want to delete?', buttonType: 'Delete' }
    });
    dialogRef.afterClosed().subscribe((popupResponse) => {
      if (popupResponse) {
        this.adminService.DeleteProductById(row.id).subscribe({
          next: (result) => {
            if (result.success) {
              this.loadAllProducts();
              this.notify.success(result.message);
            }
            if (this.dataSource.paginator) {
              this.dataSource.paginator?.firstPage();
            }
          },
          error: (error) => {
            this.notify.error(error.error.Message);
          }
        });
      }
    })
  }

  applyFilter(event: Event) {
    const currentFilter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = currentFilter.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.dataSource.filter = '';
  }

  // Generate Slug from Name
  generateSlug(event: any) {
    const nameValue = event.target.value;
    const slug = nameValue.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    this.productForm.patchValue({
      Slug: slug
    })
  }

  ngOnDestroy(): void {
    this.selectedImageUrl = "";
    this.isUploading = false;
    ResetForms(this.productForm);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;

  }
}
