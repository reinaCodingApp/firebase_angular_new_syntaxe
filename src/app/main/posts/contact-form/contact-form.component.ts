import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from 'app/models/post';
import $ from 'jquery';
import { PostsService } from '../posts.service';



@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent implements OnInit, AfterViewInit
{

    post: Post;
    dateParam = new Date();
    @ViewChild('ref', {static: false})
    ref: ElementRef;
    constructor(private postsService: PostsService,
                public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private _data: any)
    {
        this.post = _data.post;
        this.dateParam = new Date(this.post.timestamp);

    }


    save() {
      $('.content').removeAttr('contenteditable');
      this.post.content = $('#parent').children()[0].outerHTML;
      this.post.editionDate = new Date().getTime();
      if (this.dateParam == null) {
        this.post.timestamp = new Date().getTime();
      } else {
        const date = new Date(this.dateParam);
        this.post.timestamp = date.getTime();
      }
      this.matDialogRef.close(['save', this.post]);
    }
    filePicked(fileInput){
      if (fileInput.target.files && fileInput.target.files[0]) {
        console.log();
        this.postsService.uploadFile(this.post, fileInput.target.files[0]).subscribe(percent => {
          console.log(percent);
        });
      }
    }
    removePostUrl() {
      this.post.src = null;
      this.post.fileName = null;
    }

    ngOnInit(): void {

    }
    ngAfterViewInit() {
      $('.content').attr('contenteditable', 'true');
    }
}
