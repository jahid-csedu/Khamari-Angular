import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user.service';
import { EncryptionService } from '../../shared/services/encryption.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  passwordChangeForm:FormGroup;

  constructor(private formBuilder:FormBuilder, private toaster:ToastrService, private userService:UserService, private encryptionService:EncryptionService) { 
    this.passwordChangeForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required]
    })
  }

  get currentPassword(){
    return this.passwordChangeForm.get('currentPassword');
  }

  get newPassword(){
    return this.passwordChangeForm.get('newPassword');
  }

  get repeatPassword(){
    return this.passwordChangeForm.get('repeatPassword');
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.newPassword.value !== this.repeatPassword.value) {
      this.toaster.error('Repeat Password does not match', 'Password Change');
      return;
    }
    let encryptedPassword = this.encryptionService.encrypt(sessionStorage.getItem('loggedInUser'), this.currentPassword.value);
    this.userService.getUserById(sessionStorage.getItem('loggedInUser')).subscribe(res => {
      let user:User = {
        id: res.id,
        ...res.data() as User
      }
      if(user.password !== encryptedPassword){
        this.toaster.error('Current password is not correct', 'Password Change');
        return;
      }
      user.password = this.encryptionService.encrypt(sessionStorage.getItem('loggedInUser'), this.newPassword.value);
      this.userService.updateUser(user);
      this.toaster.success('Password Changed successfully', 'Password Change');
      this.passwordChangeForm.reset();
    })
  }

}
