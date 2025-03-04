import { viewClassName } from '@angular/compiler';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/models/members';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  member?: Member;
  user?: User;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService,
    private memberService: MembersService,
    private toaster : ToastrService) {
    }

   ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.user = user;
        this.loadMember();
      }
    });
  }

  loadMember() {
    if (!this.user) return; 

    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    });
  }
  
  updateMember(){
    if (this.member)
    {
        this.memberService.updateMember(this.member).subscribe(() => {
          this.toaster.success('Profile updates successfully');
          this.editForm?.reset(this.member);
      })
    }   
  }
}
