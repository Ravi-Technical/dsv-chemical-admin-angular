import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageDialogData } from '../../@core/models/commonModels';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-message-dialog',
  imports: [CommonModule,
    MatDialogModule,MatIcon,
    MatButtonModule],
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})
export class MessageDialog {
  constructor(public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: MessageDialogData) { }

  closeDialog() {
    this.dialogRef.close(false);
  }

  successDialog(){
    this.dialogRef.close(true);
  } 


}
