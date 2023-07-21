import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm!: FormGroup;
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
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    })
  }

  crearUsuario() {
    if(this.registroForm.invalid) {
      return;
    }
    this.store.dispatch( ui.isLoading() )
    const { nombre, correo, password } = this.registroForm.value;
    let timerInterval: any;
    /* Swal.fire({
      title: 'Creating user...',
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
    }); */
    this.authService.crearUsuario(nombre, correo, password)
      .then(response => {
        console.log(response);
        this.store.dispatch( ui.stopLoading() )
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error(error);
        this.store.dispatch( ui.stopLoading() )
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });
  }
}
