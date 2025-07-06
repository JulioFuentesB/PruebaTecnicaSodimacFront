import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.modal.html',
  styleUrls: ['./confirmation.modal.scss']
})
export class ConfirmationModal {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModal>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title: string },
  ) {
  }

  closeDialog(option: boolean) {
    this.dialogRef.close(option);
  }

}
