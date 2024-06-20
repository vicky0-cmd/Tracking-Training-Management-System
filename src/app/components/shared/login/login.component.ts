import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}
  hide = true;

  // reactive forms
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      rememberMe: new FormControl(null, Validators.required),
    });
  }

  protected openSnackBar() {
    this.snackBar.open('Login Invalid', 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  protected onSubmit() {
    this.loginService.getUsers().subscribe({
      next: (data) => {
        for (const obj of data) {
          if (
            this.loginForm.value.username == obj.username &&
            this.loginForm.value.password == obj.password
          ) {
            if (obj.role == 'admin') {
              localStorage.setItem('loggedInSaveAdmin', 'true');
              this.router.navigate(['admin/home/', 'courses']);
              return;
            } else if (obj.role == 'teacher') {
              localStorage.setItem('loggedInSaveTeacher', 'true');
              this.router.navigate(['teacher', 'home']);
            }
          } else {
            this.openSnackBar();
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    // if (
    //   this.loginForm.value.username == 'admin' &&
    //   this.loginForm.value.password == 'admin' &&
    //   this.loginForm.value.rememberMe == true
    // ) {
    //   localStorage.setItem('loggedInSave', 'true');
    //   this.router.navigate(['admin/home/', 'courses']);
    // } else if (
    //   this.loginForm.value.username == 'admin' &&
    //   this.loginForm.value.password == 'admin'
    // ) {
    //   localStorage.setItem('loggedInTemp', 'true');
    //   this.router.navigate(['admin/home/', 'courses']);
    // } else {
    //   this.openSnackBar();
    // }
    // console.log(this.loginForm);
  }
}
