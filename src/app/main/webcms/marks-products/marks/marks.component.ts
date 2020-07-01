import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Mark } from '../models/mark';
import { MarksProductsService } from '../marks-products.service';
import { map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';

@Component({
  selector: 'marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MarksComponent implements OnInit {
  currentMark: Mark = null;
  newMark: Mark = null;
  file: File = null;
  marks: Mark[] = [];
  editionMode: boolean;

  constructor(private marksPorductsService: MarksProductsService, private notificationService: SharedNotificationService) { }

  ngOnInit() {
    this.marksPorductsService.getMarks().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as Mark;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(marks => {
      console.log(marks);
      this.marks = marks;
    });
  }

  getMarkDetails(mark: Mark): void {
    this.newMark = null;
    this.currentMark = JSON.parse(JSON.stringify(mark));
    this.editionMode = false;
  }

  enableEditionMode(mark): void {
    this.newMark = null;
    this.currentMark = JSON.parse(JSON.stringify(mark));
    this.editionMode = true;
  }

  createNewMark(): void {
    this.currentMark = null;
    this.newMark = new Mark();
  }

  addMark(): void {
    if (this.newMark && this.newMark.name.length > 0 && this.newMark.webSite.length > 0 && this.newMark.src) {
      this.newMark.displayOrder = this.marks.length;
      this.marksPorductsService.addMark(this.newMark, this.file).subscribe(() => {
        console.log('added');
        this.newMark = null;
      });
    } else {
      this.notificationService.showWarning(`Tous les champs et l'image sont obligatoires!`);
    }
  }

  updateMark(mark: Mark): void {
    this.marksPorductsService.updateMark(mark).then(() => {
      console.log('updated');
    });
  }

  filePicked(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
      if (this.editionMode) {
        this.marksPorductsService.uploadFile(this.currentMark, this.file)
          .subscribe(() => {
          });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (_event) => {
          this.newMark.src = reader.result;
        };
      }
    }
  }

}
