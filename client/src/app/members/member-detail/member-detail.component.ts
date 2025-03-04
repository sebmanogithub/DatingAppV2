import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/models/members';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs!: TabsetComponent;
  activeTab!: TabDirective;
  messages: Message[] = [];
  member!: Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    this.route.queryParams.subscribe(params => {
      params?.tabs ? this.selectTab(params.tabs) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }];

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrl = [];
    if (this.member?.photos){
      for (const photo of this.member?.photos)
        {
          imageUrl.push({
            small: photo?.url,
            medium: photo?.url,
            big: photo?.url
          })
        }
    }
    return imageUrl;
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActived(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages'
      && this.messages.length === 0) {
        this.loadMessages();
    }
  }
}
