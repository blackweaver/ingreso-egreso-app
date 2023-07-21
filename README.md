# IngresosEgresos

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Adding user to firebase

https://console.firebase.google.com/u/0/project/ingreso-egreso-app-b26cf/firestore/data/~2Fusers~2F9H8ZYW7A3Xz9ejIqtiZO

```
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';

crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(({user}) => {
        const userModel = new Usuario(user.uid, nombre, user.email);
        const newUser = { nombre: userModel.nombre, email: userModel.email, userId: userModel.uid };
        console.log(userModel);
        const userRef = collection(this.firestore, 'users')
        addDoc(userRef, newUser).then(res => {
          console.log(res);
        });
    });
  }
```

## NGRX

https://ngrx.io/