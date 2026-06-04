import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogData } from '../models/commonModels';
import { MessageDialog } from '../../share/message-dialog/message-dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MatDialogService {

  private cloudName = "dpfj5dzeg";
  private uploadPreset = "dsv_chemical";
  private apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  constructor(private matDialog: MatDialog, private http:HttpClient) { }

  openDialog(data: MessageDialogData) {
    return this.matDialog.open(MessageDialog, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: data
    });
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post(this.apiUrl, formData);
  }


}
