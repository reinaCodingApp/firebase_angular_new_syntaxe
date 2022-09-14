import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PostsService } from '../posts/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { forkJoin } from 'rxjs';
import { Post } from '../posts/models/post';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html'
})
export class NewPostComponent implements OnInit {
  post: Post;
  mode: string = 'new';
  isNews: boolean;
  postId: string;
  file: File = null;
  categories: any[];
  editor = ClassicEditor;
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
  dialogRef: any;

  constructor(
    private _postsService: PostsService,
    private _notificationService: SharedNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    public _matDialog: MatDialog
  ) {
    this.mode = this.route.snapshot.queryParams.mode as string;
    this.isNews = this.route.snapshot.queryParams.isNews === 'true' ? true : false;

    if (this.mode === 'edit') {
      this.postId = this.route.snapshot.queryParams.postId;
      this._postsService.getPost(this.postId, this.isNews).subscribe((result) => {
        if (result.exists) {
          this.post = { uid: result.id, ...result.data() } as Post;
        } else {
          this.router.navigateByUrl('website');
        }
      });
    } else {
      this.post = new Post();
      this.post.content = '';
    }
  }

  ngOnInit(): void {
    this._postsService.getCategories().subscribe(categories => {
      if (categories) {
        this.categories = categories;
        if (this.mode === 'new') {
          this.post.categoryId = this.categories[0].id;
        }
      }
    });
  }

  filePicked(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
      const bigImage = this._postsService.uploadFile(this.post, this.file, 'big');
      const mediumImage = this._postsService.uploadFile(this.post, this.file, 'medium');
      forkJoin([bigImage, mediumImage]).subscribe(() => {
        console.log('## Upload Done');
      });
    }
  }

  addPost(): void {
    if (this.isNews) {
      if (!this.post.src) {
        this._notificationService.showWarning(`L'image est obligatoire!`);
        return;
      }
    }
    this.post.timestamp = new Date().getTime();
    this._postsService.addPost(this.post, this.file, this.isNews).subscribe(result => {
      if (result) {
        this._notificationService.showSuccess('Article crée avec succés');
        this.router.navigateByUrl('website');
      }
    }, (err) => {
      this._notificationService.showStandarError();
      console.log(err);
    });
  }

  updatePost(): void {
    this._postsService.editPost(this.post, this.isNews).then((response) => {
      this._notificationService.showSuccess('Article crée avec succés');
      this.router.navigateByUrl('website');
    }, (err) => {
      this._notificationService.showStandarError();
      console.log(err);
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.mode === 'edit') {
        this.updatePost();
      } else {
        this.addPost();
      }
    }
  }

  disablePost(): void {
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Désactiver article',
        message: 'Etes-vous sûr de vouloir désactiver cet article ?'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._postsService.disablePost(this.post, this.isNews).then(() => {
            this._notificationService.showSuccess('Article désactivé avec succés');
            this.router.navigateByUrl('website');
          });
        }
      });
  }

  onEditorReady(editor): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}

