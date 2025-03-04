import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/models/members';
import { Photo } from 'src/app/models/photo';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member = {} as Member;
  uploader: FileUploader = new FileUploader({});
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User = {} as User;

  constructor(private accountService: AccountService,
    private memberService: MembersService
  ) {
    this.accountService.currentUser$.pipe(take(1)).
      subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if (p.isMain) {
          p.isMain = false;
        }
        if (p.id == photo.id) {
          p.isMain = true;
        }
      })
  })
  }

  deletePhoto(photoId: number){
    console.log(photoId);
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    })
  }

  fileOverBase(event: any){
    this.hasBaseDropzoneOver = event;
  }

  initializeUploader() {
    this.uploader.setOptions({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5 : true,
      allowedFileType: ['image'],
      removeAfterUpload: false,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    })

    this.uploader.onAfterAddingAll = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isMain) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }

}
