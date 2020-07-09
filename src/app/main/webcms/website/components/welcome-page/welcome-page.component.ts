import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WelcomeService } from './welcome.service';
import { fuseAnimations } from '@fuse/animations';
import { Post } from '../posts/models/post';
import { map } from 'rxjs/operators';
import { ServiceItem } from './models/serviceItem';
import { MissionItem } from './models/missionItem';
import { Testimonial } from './models/testimonial';

@Component({
  selector: 'welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class WelcomePageComponent implements OnInit {
  settings: any;
  homeSettingsToDisplay: any[] = [];
  homeSettingsToSave: any = {};
  posts: Post[];
  selectedPost: Post;
  highlightPostTitleMode = 'fromPosts';
  highlightPostTitle: string;
  serviceItems: ServiceItem[];
  missionItems: MissionItem[];
  testimonials: Testimonial[];

  constructor(private welcomeService: WelcomeService) { }

  ngOnInit(): void {
    this.welcomeService.getWebHomeSettings().subscribe(data => {
      this.settings = data.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() } as {}))[0];
      console.log('###### settings', this.settings);
      const homeSettings = [];
      Object.keys(this.settings).map((key) => {
        if (key !== 'id') {
          const componentSettings = {
            componentId: key,
            displayOrder: this.settings[key].displayOrder,
            show: this.settings[key].show,
            title: this.settings[key].title,
          };
          if (key === 'highlightPost') {
            componentSettings['highlightPostTitle'] = this.settings[key].highlightPostTitle ? this.settings[key].highlightPostTitle : null;
            componentSettings['isClickablePost'] = this.settings[key].isClickablePost ? this.settings[key].isClickablePost : false;
            componentSettings['postUrl'] = this.settings[key].postUrl ? this.settings[key].postUrl : null;
          }
          return homeSettings.push(componentSettings);
        }
      });
      this.homeSettingsToDisplay = homeSettings;
      this.homeSettingsToDisplay.sort((a, b) => a.displayOrder - b.displayOrder);
    });

    this.welcomeService.getPosts().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as Post;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(posts => {
      this.posts = posts;
    });

    this.welcomeService.getOurServices().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as ServiceItem;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(serviceItems => {
      this.serviceItems = serviceItems;
    });

    this.welcomeService.getOurMission().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as MissionItem;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(missionItems => {
      this.missionItems = missionItems;
    });

    this.welcomeService.getTestimonials().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as Testimonial;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(testimonials => {
      this.testimonials = testimonials;
    });

  }

  drop(event: CdkDragDrop<string[]>): void {
    if (this.homeSettingsToDisplay[event.previousIndex].displayOrder === 0
      || this.homeSettingsToDisplay[event.currentIndex].displayOrder === 0
      || this.homeSettingsToDisplay[event.previousIndex].displayOrder === this.homeSettingsToDisplay.length - 1
      || this.homeSettingsToDisplay[event.currentIndex].displayOrder === this.homeSettingsToDisplay.length - 1
    ) {
      return;
    }
    moveItemInArray(this.homeSettingsToDisplay, event.previousIndex, event.currentIndex);
  }

  save(): void {
    for (let index = 0; index < this.homeSettingsToDisplay.length; index++) {
      this.homeSettingsToDisplay[index].displayOrder = index;
      const componentSettings = this.homeSettingsToDisplay[index];
      const key = componentSettings.componentId;
      this.homeSettingsToSave[key] = {
        displayOrder: componentSettings.displayOrder,
        show: componentSettings.show,
        title: componentSettings.title
      };
      if (key === 'highlightPost') {
        this.homeSettingsToSave[key].highlightPostTitle = componentSettings.highlightPostTitle ? componentSettings.highlightPostTitle : null;
        this.homeSettingsToSave[key].isClickablePost = componentSettings.isClickablePost ? componentSettings.isClickablePost : false;
        this.homeSettingsToSave[key].postUrl = componentSettings.postUrl ? componentSettings.postUrl : null;
      }
    }

    this.welcomeService.updateSettings(this.settings.id, this.homeSettingsToSave)
      .then(() => {
        console.log('updated');
      });
  }

  saveHighlightPostTitle(): void {
    const isClickable = this.highlightPostTitleMode === 'fromPosts';
    let postUrl: string = null;
    if (isClickable) {
      postUrl = this.selectedPost.uid;
    }
    this.welcomeService.updateHighlightPostTitle(this.settings.id, this.highlightPostTitle, isClickable, postUrl)
      .then(() => {
        console.log('updated');
      });
  }

  isHighlightTitleValid(): boolean {
    if (!this.highlightPostTitle) {
      return false;
    }
    if (this.highlightPostTitleMode === 'customTitle' && this.highlightPostTitle.length < 20) {
      return false;
    }
    return true;
  }

  postChanged(event): void {
    this.highlightPostTitle = event.value.title;
  }

  updateOurServices(serviceItem: ServiceItem): void {
    this.welcomeService.updateOurServices(serviceItem)
      .then(() => {
        console.log('updated');
      });
  }

  updateOurMission(missionItem: MissionItem): void {
    this.welcomeService.updateOurMission(missionItem)
      .then(() => {
        console.log('updated');
      });
  }

  updateTestimonials(testimonial: Testimonial): void {
    this.welcomeService.updateTestimonials(testimonial)
      .then(() => {
        console.log('updated');
      });
  }
}
