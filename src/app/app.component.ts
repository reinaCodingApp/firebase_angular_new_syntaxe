import { MainService } from './main.service';
import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Post } from './models/post';
import { Category } from './models/category';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit, AfterViewInit  {
  currentCategorie: Category;
  path = '';
  post: Post = {title: '', content: ''} as Post;
  file: File = null;
  posts: Post[];
  dateParam =  null;
  @ViewChild('ref', {static: false})
  tref: ElementRef;

  constructor(private mainservice: MainService) {}

  ngAfterViewInit(): void {
    console.log(this.tref);
  }
  ngOnInit(): void {
    this.currentCategorie = {id: 132, name: 'L\'association AVS'};
    this.mainservice.getPosts().subscribe(data => {
      console.log(data);
      this.posts = data.map(c => {
        return {
          ...c.payload.doc.data()
        };
      });
      console.log(this.posts);
    });
    // this.getFiles();
  }
  filePicked(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
    }
  }

  addPost() {
      if (this.dateParam == null) {
        console.log('date is null');
        this.post.timestamp = new Date().getTime();
      } else {
        const date = new Date(this.dateParam);
        this.post.timestamp = date.getTime();
        console.log('date not null', this.dateParam);
        console.log('date not null timestamp', this.post.timestamp);
      }
      $('#ref').removeAttr('contenteditable');
      this.post.categoryId = this.currentCategorie.id;
      this.post.content  = this.tref.nativeElement.outerHTML;
      console.log(this.post.content);
      $('#ref').attr('contenteditable', 'true');
      this.mainservice.insertPost(this.post, this.file);
  }
  upload() {
    console.log('upload()');
  }
  getFiles() {
    this.mainservice.getFiles().subscribe(response => {
      console.log('getfiles', response);
    });
  }
}
