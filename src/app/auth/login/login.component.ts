import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}
  
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    })
  }

  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }
    this.store.dispatch( ui.isLoading() )
    const { user, password } = this.loginForm.value;
    let timerInterval: any;
    /* Swal.fire({
      title: 'Login...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });  */
    this.authService
      .login(user, password)
      .then((response) => {
        console.log(response);
        this.store.dispatch( ui.stopLoading() )
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
        this.store.dispatch( ui.stopLoading() )
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
