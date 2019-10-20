import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Category } from '../models/category';
import { Post } from '../models/post';
import { MainService } from '../main.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit  {

  path = '';
  post: Post = {title: '', content: ''} as Post;
  file: File = null;
  posts: Post[];
  categories: Category[];
  currentCategorie: Category = new Category();
  dateParam =  null;
  @ViewChild('ref', {static: false})
  tref: ElementRef;

  constructor(private mainservice: MainService) {}

  ngAfterViewInit(): void {
    console.log(this.tref);
  }
  ngOnInit(): void {
    this.mainservice.getCategories().subscribe(result => {
      if(result) {
        this.categories = result.map(c => {
          return {... c.payload.doc.data()
          };
        });
        this.currentCategorie.id = this.categories[0].id;
      }
    })
    this.mainservice.getPosts().subscribe(data => {
      console.log(data);
      this.posts = data.map(c => {
        return {
          ...c.payload.doc.data()
        };
      });

    });
    // this.getFiles();
    this.mainservice.getPost('Mentions Légales').subscribe(result => {
      console.log(result);
      if (result && result.length > 0) {
        let p = result[0].payload.doc.data()
        console.log(p);
      }
    })
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
