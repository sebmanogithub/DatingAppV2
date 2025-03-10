import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm!: NgForm;
  @Input() messages: Message[] = [];
  @Input() username: string = '';
  messageContent: string = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    })
  }
}
