import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }
    const { user, password } = this.loginForm.value;
    let timerInterval: any;
    Swal.fire({
      title: 'Login...',
      // html: 'I will close in <b></b> milliseconds.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        /* const b: any = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (b.textContent) {
            b.textContent = Swal.getTimerLeft();
          }
        }, 100); */
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
    this.authService
      .login(user, password)
      .then((response) => {
        console.log(response);
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
          // footer: '<a href="">Why do I have this issue?</a>'
        });
      });
  }

  loginGoogle() {
    this.authService
      .loginWithGoogle()
      .then((response) => {
        console.log(response);
        this.router.navigate(['/']);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
          // footer: '<a href="">Why do I have this issue?</a>'
        });
      });
  }
}
