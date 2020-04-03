import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from '../../shared/services/encryption.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent { 

  loginForm:FormGroup;

  constructor(private userService:UserService, private formBuilder:FormBuilder, private toaster:ToastrService, private encryptionService:EncryptionService, private router:Router) {
    this.loginForm = this.formBuilder.group({
      id: [''],
      password: ['']
    })
  }

  onLogin() {
    let user:User;
    let id = this.loginForm.get('id').value;
    let password = this.loginForm.get('password').value;
    this.userService.getUserById(id).subscribe(res => {
      if(res.exists){
        user = {
          id: res.id,
          ...res.data() as User
        }
        if(user.password === this.encryptionService.encrypt(id,password)){
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('loggedInUser', id);
          sessionStorage.setItem('loggedInUserRole', user.role);
          this.router.navigate(['/dashboard']);
        }else{
          this.toaster.error('Wrong Password', 'Login');
          return;
        }
      }else{
        this.toaster.error('User does not exist', 'Login');
        return;
      }
    })
  }
}
