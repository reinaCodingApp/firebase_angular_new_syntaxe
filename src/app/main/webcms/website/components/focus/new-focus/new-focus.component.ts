import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { PostsService } from '../../posts/posts.service';
import { Focus } from '../models/focus';
import { FocusService } from '../focus.service';
import { FocusDetails } from '../models/focusDetails';
import * as moment from 'moment';

@Component({
  selector: 'app-new-focus',
  templateUrl: './new-focus.component.html',
  styleUrls: ['./new-focus.component.scss'],
  animations: fuseAnimations
})
export class NewFocusComponent implements OnInit {
  focus: Focus;
  mode: string = 'new';
  focusId: string;
  file: File = null;
  categories: any[];
  editor = DocumentEditor;
  config = {
    toolbar: ['mediaEmbed'],
    fontFamily: {
      options: [
        'Raleway, sans-serif'
      ]
    },
    mediaEmbed: {
      previewsInData: true
    }
  };
  dialogRef: any;

  constructor(
    private focusService: FocusService,
    private _notificationService: SharedNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    public matDialog: MatDialog
  ) {
    this.mode = this.route.snapshot.queryParams.mode as string;
    if (this.mode === 'edit') {
      this.focusId = this.route.snapshot.queryParams.focusId;
      this.focusService.getFocus(this.focusId).subscribe((result) => {
        if (result.exists) {
          this.focus = { uid: result.id, ...result.data() } as Focus;
          this.focus.date = moment(this.focus.date);
        } else {
          this.router.navigateByUrl('website');
        }
      });
      this.focusService.getFocusDetails(this.focusId).subscribe((result) => {
        if (result.exists) {
          this.focus.focusDetails = { uid: result.id, ...result.data() } as FocusDetails;
        } else {
          this.router.navigateByUrl('website');
        }
      });
    } else {
      this.focus = new Focus();
    }
    console.log(this.focus);
  }

  ngOnInit(): void {
  }

  uploadImageForFocus(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      if (this.mode === 'edit') {
        this.focusService.uploadImageForFocus(this.focus, file)
          .then(() => {
          });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.focusService.uploadImageForFocus(this.focus, file)
            .then(() => {
            });
        };
      }
    }
  }

  uploadImageForInterlocutor(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      if (this.mode === 'edit') {
        this.focusService.uploadImageForInterlocutor(this.focus, file)
          .then(() => {
          });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {

          this.focusService.uploadImageForInterlocutor(this.focus, file)
            .then(() => {
            });
        };
      }
    }
  }

  uploadImageForIllustration(fileInput, index: number): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      if (this.mode === 'edit') {
        this.focusService.uploadImageForIllustration(this.focus, file, index)
          .subscribe(() => {
          });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {

          this.focusService.uploadImageForIllustration(this.focus, file, index)
            .subscribe(() => {
            });
        };
      }
    }
  }

  addFocus(): void {
    this.focus.displayOrder = 0;
    this.focusService.addFocus(this.focus).then(() => {
      this._notificationService.showSuccess('Focus crée avec succés');
      this.router.navigateByUrl('website');
    }, (err) => {
      this._notificationService.showStandarError();
      console.log(err);
    });
  }

  updateFocus(): void {
    this.focusService.updateFocus(this.focus).then(() => {
      this._notificationService.showSuccess('Focus modifié avec succés');
      this.router.navigateByUrl('website');
    }, (err) => {
      this._notificationService.showStandarError();
      console.log(err);
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.focus.images.length > 0) {
      if (this.mode === 'edit') {
        this.updateFocus();
      } else {
        this.addFocus();
      }
    } else {
      this._notificationService.showWarning('Veuillez remplir tout les champs obligatoires avec au moins une image!');
    }
  }

  removeImage(index: number): void {
    this.focus.images.splice(index, 1);
    this.focusService.updateFocus(this.focus).then(() => {
      console.log('updated');
    });
  }

  onEditorReady(editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}

