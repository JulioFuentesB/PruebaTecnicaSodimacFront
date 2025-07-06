import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

import { ConfirmationModal } from "../modals/confirmation/confirmation.modal";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private matDialog: MatDialog
  ) { }

  public openConfirmationModal(message: string, title: string) {
    const dialogRef = this.matDialog.open(ConfirmationModal, {
      panelClass: ['sgl__modal-frame'], // sgl__modal-frame is a Homecenter custom class for styling
      autoFocus: false,
      enterAnimationDuration: '10ms',
      disableClose: true,
      data: { message, title },
      height: '300px', // Place your desired height
      width: '500px'   // Place your desired width
    });
    return dialogRef.afterClosed();
  }
}
