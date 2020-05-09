import { Component, OnInit, AfterViewChecked, Input, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, AfterViewChecked {
  @Input() recipientId: number;
  @ViewChild('scrollMe', {static : true} ) scrollMe: ElementRef ;
  messages: Message[];
  newMessage: any = {};
  constructor(private userService: UserService,
              private authService: AuthService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
    this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages(){
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap( messages => {
          for ( let i = 0; i < messages.length; i++) {
          if ( messages[i].isRead === false && messages[i].recipientId === currentUserId){
            this.userService.markAsRead(currentUserId, messages[i].id);
          }
        }
        }
      )
      ).subscribe( messages => {
            this.messages = messages;
          }, error =>  {
            this.alertify.error(error);
          });
  }

  sendMessage(){
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((message: Message) => {
        this.messages.push(message);
        this.newMessage = '';
      }, error => {
        this.alertify.error(error);
      });

  }

  scrollToBottom(){
    try{
    this.scrollMe.nativeElement.scrollTop
     = Math.max(0, this.scrollMe.nativeElement.scrollHeight - this.scrollMe.nativeElement.offsetHeight);
    }
    catch (err){
      this.alertify.error(err.message);
    }
  }

}
