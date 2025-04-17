import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIFactoryService } from 'src/app/service/api-factory.service';
import { AppServiceService } from 'src/app/service/app-service.service';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent implements OnInit {
  constructor(
    private appServiceService: AppServiceService,
    private router: Router,
    private apiFactoryService: APIFactoryService
  ) {}
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  get val() {
    return this.registerForm.value;
  }
  pageTitle: any;
  ngOnInit(): void {
    const stateData = window.history.state;
    if (stateData) {
      this.pageTitle = stateData.pageTitle;
      console.log(this.pageTitle); // { userId: 123, score: 50 }
    } else {
      console.log('No state data found.');
    }
  }
  verifyUser() {
    let formValue = this.loginForm.value;
    console.log(formValue);
    this.apiFactoryService.loginUser(formValue).subscribe((res) => {
      console.log(res);
      if (res.response) {
        alert('Login Successfully done !!');
        this.appServiceService.logedInUser = res.data;
        this.router.navigate(['/solve-sudoku']);
        return;
      } else {
        alert('Invalid username or Password !!');
      }
    });
  }
  registeruser() {
    if (this.val.password != this.val.confirmPassword) return;
    let formValue = {
      username: this.val.username,
      password: this.val.password,
    };
    this.apiFactoryService.registerUser(formValue).subscribe((res) => {
      console.log(res);
      if (res.response) {
        alert(res.message);
        this.appServiceService.logedInUser = res.data;
        console.log(this.appServiceService.logedInUser);
        this.router.navigate(['/solve-sudoku']);

        return;
      } else {
        alert(res.message);
        this.router.navigate(['/login'], {
          state: { pageTitle: 'login' },
        });
      }
    });
  }
  goToSignUp() {
    let data = { pageTitle: 'sign-up' };
    if (this.pageTitle == 'sign-up') {
      data = { pageTitle: 'login' };
      this.router.navigate(['/login'], {
        state: data, // Passing data
      });
    } else {
      this.router.navigate(['/sign_up'], {
        state: data, // Passing data
      });
    }
  }
}
