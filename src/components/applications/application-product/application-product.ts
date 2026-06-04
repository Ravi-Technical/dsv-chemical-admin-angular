import { AfterViewInit, Component, DestroyRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from '../../../@core/services/application.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ResetForms } from '../../../share/form_reset_method';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-application-product',
  imports: [ReactiveFormsModule, CommonModule,
    MatFormFieldModule,MatSelectModule,
    MatInputModule,
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
  appProductForm!:FormGroup;
  isEditMode:boolean = false;
  isLoading:boolean = false;
  isEditingId:string = "";
  
  constructor(private dataResource:ApplicationService, private fb:FormBuilder, private matDialog:MatDialog, private snakbar:MatSnackBar) { }
  ngOnInit(): void {  
  }
  // Init Form
  InitForm():void{
     this.appProductForm = this.fb.group({
       title:['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
       slug:['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
       category:['', Validators.required]
     })
  }
  // Get Form Field Controls
  get proForm(){
     return this.appProductForm.controls;
  }
  // Get All Application Category() Initial loaded
  onSubmit(){
      this.isLoading = true;
      const payload = this.appProductForm.value;
      const request$ = this.isEditMode && this.isEditingId ? this.dataResource.UPDATE_APPLICATION_PRODUCT(this.isEditingId, payload) 
      : this.dataResource.INSERT_FRESH_APPLICATION_PRODUCT(payload);
      if(this.appProductForm.valid && this.appProductForm.dirty){
          request$.subscribe({
             next:(result)=>{
                this.isEditMode = false;
                this.isLoading = false;
                console.log(result);
             },
             error:(error)=>{}
          })
      }  else {

      }
  }
    // Auto-generate slug from name
  generateSlug(): void {
    const name = this.proForm['title'].value;
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      this.proForm['slug'].setValue(slug);
    }
  }

 // Reset Form
 resetForm():void{
    ResetForms(this.appProductForm);
 }

  // Clean Component Activities
  ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
  }
  ngAfterViewInit(): void {

  }


}
