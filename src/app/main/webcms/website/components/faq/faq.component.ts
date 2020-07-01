import { Component, OnInit, ViewChild } from '@angular/core';
import { FaqService } from './faq.service';
import { map, take } from 'rxjs/operators';
import { FaqPost } from './models/faqPost';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { SatPopover } from '@ncstate/sat-popover';

@Component({
  selector: 'faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  @ViewChild('faqPopover', { static: false }) faqPopover: SatPopover;
  faqs: FaqPost[];
  dialogRef: any;
  faq: FaqPost;

  constructor(
    private faqService: FaqService,
    private _matDialog: MatDialog) {
      this.faq = new FaqPost();
    }

  ngOnInit(): void {
    this.faqService.getFaqsPosts().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as FaqPost;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(faqs => {
      this.faqs = faqs;
    });
  }

  updateFaq(faq: FaqPost): void {
    faq.title = faq.title.trim();
    if (faq.title.length > 0) {
      this.faqService.updateFaq(faq)
        .then(() => {
          console.log('updated');
        });
    }
  }

  deleteFaq(faq: FaqPost): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Supprimer FAQ',
        message: 'Confirmez-vous la suppression de ce FAQ ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this.faqService.deleteFaq(faq);
        }
      });
  }

  addFaq(): void{
    this.faq.title = this.faq.title.trim();
    this.faq.displayOrder = this.faqs.length + 1;
    if (this.faq.title.length > 0) {
      this.faqService.addFaq(this.faq)
        .then(() => {
          console.log('added');
          this.faqPopover.close();
          this.faq = new FaqPost();
        });
    }
  }

}
