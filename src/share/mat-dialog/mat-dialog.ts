import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mat-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './mat-dialog.html',
  styleUrl: './mat-dialog.scss',
})
export class ConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; buttonType?: string }
  ) { }
  ngOnInit(): void {
   console.log("Test dailog......");
  }
 
  onConfirm(): void { 
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }




}
