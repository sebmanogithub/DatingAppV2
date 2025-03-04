import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: Partial<User[]> = [];
  bsModalRef!: BsModalRef;

  constructor(private adminService: AdminService,
    private modalService: BsModalService,
    private adminservice: AdminService
  ) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  openRolesModal(user: User) {
    // const initialState: ModalOptions = {
    //   class: 'modal-lg',
    //   initialState: {
    //     title: 'User roles',
    //     // username: user.username,
    //     // selectedRoles: [...user.roles],
    //     availableRoles: ['Admin', 'Moderator', 'Member'],
    //     users: this.users,
    //     rolesUpdated: false
    //   }
    // }
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles : this.getRolesArray(user)
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe((values: any[]) => {
      const rolesToUpdate = {
        roles: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
          user.roles = [...rolesToUpdate.roles]
        })
      }
    })
    // this.bsModalRef.onHide?.subscribe({
    //   next: () => {
    //     if (this.bsModalRef.content && this.bsModalRef.content.rolesUpdated) {
    //       const selectedRoles = this.bsModalRef.content.selectedRoles;
    //       this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
    //         next: roles => user.roles = roles
    //       })
    //     }
    //   }
    // })
  }

  private getRolesArray(user: User): any[]{
    const roles: any[] = [];
    const userRoles = user.roles;
    const availableRoles : any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'}
    ];

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    });
    return roles;
  }

  getUsersWithRoles() {
    this.adminService.getUserWithRoles().subscribe(users => {
      this.users = users
    })
  }
}
