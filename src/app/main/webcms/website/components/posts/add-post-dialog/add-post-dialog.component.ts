import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from 'app/main/webcms/website/components/posts/models/post';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import * as moment from 'moment';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { PostsService } from '../posts.service';

@Component({
  selector: 'add-post-dialog-dialog',
  templateUrl: './add-post-dialog.component.html',
  styleUrls: ['./add-post-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPostDialogComponent implements OnInit {
  post: Post;
  file: File = null;
  categories: any[];
  editor = DocumentEditor;
  config = {
    fontFamily: {
      options: [
        'Raleway, sans-serif'
      ]
    },
    mediaEmbed: {
      previewsInData: true
    }
  };

  constructor(
    private _postsService: PostsService,
    private _notificationService: SharedNotificationService,
    public matDialogRef: MatDialogRef<AddPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.mode === 'edit') {
      this.post = data.post;
      this.post.editionDate = moment(this.post.timestamp);
    } else {
      this.post = new Post();
      this.post.content = '';
      this.post.editionDate = moment(new Date());
    }
  }

  ngOnInit(): void {
    this._postsService.getCategories().subscribe(categories => {
      if (categories) {
        this.categories = categories;
        if (this.data.mode === 'new') {
          this.post.categoryId = this.categories[0].id;
        }
      }
    });
  }

  filePicked(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
      if (this.data.mode === 'edit') {
        this._postsService.uploadFile(this.post, this.file)
          .subscribe(() => {
          });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (_event) => {
          this.post.src = reader.result;
        };
      }
    }
  }

  addPost(): void {
    this.post.timestamp = this.post.editionDate.toDate().getTime();
    this.post.editionDate = this.post.editionDate.toDate().getTime();
    this._postsService.insertPost(this.post, this.file).subscribe(result => {
      if (result) {
        this.matDialogRef.close();
        this._notificationService.showSuccess('Article crée avec succés');
      }
    }, (err) => {
      this._notificationService.showStandarError();
      console.log(err);
    });
  }

  updatePost(): void {
    this.post.timestamp = this.post.editionDate.toDate().getTime();
    this.post.editionDate = this.post.editionDate.toDate().getTime();
    this._postsService.editPost(this.post).then((response) => {
      this.matDialogRef.close();
      this._notificationService.showSuccess('Article modifié avec succés');
    }, (err) => {
      this._notificationService.showStandarError();
      console.log(err);
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updatePost();
      } else {
        this.addPost();
      }
    }
  }

  onEditorReady(editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}
