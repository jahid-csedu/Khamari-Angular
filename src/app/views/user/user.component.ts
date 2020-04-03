import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from '../../shared/services/encryption.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('editModal') public editModal: ModalDirective;

  userForm:FormGroup;
  userEditForm:FormGroup;
  users: User[];
  userBeforeEdit:User;

  constructor(private userService:UserService, private formBuilder:FormBuilder, private toaster:ToastrService, private encryptionService:EncryptionService) { 
    this.userForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['editor']
    });
    this.userEditForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['editor']
    })
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as User
        }
      })
    })
  }

  onSubmit() {
    let user = this.userForm.value;
    this.userService.getUserById(user.id).subscribe( res => {
      if(res.exists){//check whether the user already exists or not
        this.toaster.error('User already exists')
        return;
      }else {//no user with this id
        user.password = this.encryptionService.encrypt(user.id, user.password);
        this.userService.createUser(user).then(res =>
          {
            this.toaster.success('User created successfully', 'User');
            this.resetForm();
          },
          err => {
            this.toaster.error('Could not create user', 'User')
          })
      }
    })
  }

  onEdit(user:User) {
    this.userBeforeEdit = Object.assign({}, user)
    this.userEditForm.setValue(user)
    this.editModal.show();
  }

  onUpdateUser() {
    let editedUser:User = this.userEditForm.value;
    if(editedUser.password !== this.userBeforeEdit.password){
      editedUser.password = this.encryptionService.encrypt(editedUser.id, editedUser.password);
    }
    this.userService.updateUser(editedUser);
    this.editModal.hide();
    this.toaster.success('User updated successfully', 'User');
  }

  onDelete(id:string) {
    if(sessionStorage.getItem('loggedInUser') === id) {
      this.toaster.error('Can not delete currently logged in user');
      return;
    }
    if(confirm('Are you sure to delete this user?')) {
      this.userService.deleteUser(id);
      this.toaster.warning('User deleted successfully', 'User')
    }
  }

  resetForm() {
    this.userForm.reset();
    this.userForm.patchValue({
      role: 'editor'
    })
  }

}
