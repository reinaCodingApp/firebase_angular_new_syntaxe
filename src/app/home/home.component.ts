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
  confirmationText = '';
  @ViewChild('ref', {static: false})
  tref: ElementRef;

  constructor(private mainservice: MainService) {}

  ngAfterViewInit(): void {
    console.log(this.tref);
  }
  ngOnInit(): void {
    this.mainservice.getCategories().subscribe(result => {
      if (result) {
        this.categories = result.map(c => {
          return {... c.payload.doc.data()
          };
        });
        this.currentCategorie.id = this.categories[0].id;
      }
    });
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
        const p = result[0].payload.doc.data();
        console.log(p);
      }
    });
  }
  filePicked(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
    }
  }
  private getPostId(title: string) {
    const id = title.trim().toLowerCase().replace('?', '').
    replace(/'/g, '').replace(/"/g, '').replace(/!/g, '').replace(/:/g, '').trim().replace(/ /g, '-')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    console.log('id ', id);
    return id;
  }
  private getExcerpt(outerHTML: any) {
    let excerpt = null;
    if (outerHTML == null) {
    return excerpt;
    }
    const stripedHtml: string = outerHTML.replace(/<[^>]+>/g, '');
    if (stripedHtml.length >= 500) {
      excerpt = stripedHtml.slice(0, 255);

    } else {
      excerpt = stripedHtml.slice(0, stripedHtml.length / 2);
    }

    const lastIndexOf = excerpt.lastIndexOf(' ');
    excerpt = excerpt.slice(0, lastIndexOf);
    excerpt += '...';
    return excerpt;
  }

  addPost() {
    if (!this.post.title || this.post.title.length < 10) {
      this.confirmationText = 'Veuillez saisir le titre de l\'article';
      return;
    }
    if (this.dateParam == null) {
        this.post.timestamp = new Date().getTime();
      } else {
        const date = new Date(this.dateParam);
        this.post.timestamp = date.getTime();
      }
    $('#ref').removeAttr('contenteditable');
    this.post.categoryId = this.currentCategorie.id;
    this.post.content  = this.tref.nativeElement.outerHTML;
    if (!this.post.content || this.post.content.length < 255) {
      this.confirmationText = 'Le corp de l\'article doit dépasser les 255 carctères';
      return;
    }
    this.post.id = this.getPostId(this.post.title);
    this.post.excerpt = this.getExcerpt(this.post.content);
    console.log(this.post.content);
    $('#ref').attr('contenteditable', 'true');
    this.mainservice.insertPost(this.post, this.file).subscribe(result => {
      if (result) {
        console.log('result ', result);
        this.confirmationText = 'Article inséré avec succès';
        this.post = new Post();
        this.tref.nativeElement.innerHTML = '';
        this.file = null;
        setTimeout(() => {
            this.confirmationText = '';
        }, 6000);
      }
    },
    err => {
      this.confirmationText = 'L\'opération d\insertion a échoué';
      setTimeout(() => {
      this.confirmationText = '';
    }, 6000);
    });
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
