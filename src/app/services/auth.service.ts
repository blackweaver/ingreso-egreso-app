import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { environment } from 'src/environments/environment';

// https://www.youtube.com/watch?v=8VTxuIvMTlc&ab_channel=Garajedeideas

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    public firestore: Firestore,
    public store: Store<AppState>
  ) {}

  initAuthListener() {
    return authState(this.auth);
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      ({ user }) => {
        const userModel = new Usuario(user.uid, nombre, user.email);
        const newUser = {
          nombre: userModel.nombre,
          email: userModel.email,
          userId: userModel.uid,
        };
        const userRef = collection(this.firestore, 'users');
        addDoc(userRef, newUser).then((res) => {
          console.log(res);
        });
      }
    );
  }

  login(user: string, password: string) {
    const dataLogin = signInWithEmailAndPassword(this.auth, user, password);
    dataLogin.then(async (data) => {
      if (data) {
        const userRef = collection(this.firestore, 'users');
        const q = query(userRef, where('userId', '==', data.user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          const userData = doc.data();
          const tempUser = new Usuario(
            userData['userId'],
            userData['nombre'],
            userData['email']
          );
          userData['userId'] === data.user.uid &&
            this.store.dispatch(
              authActions.setUser({
                user: tempUser,
              })
            );
        });
      } else {
        this.store.dispatch(
          authActions.unSetUser()
        );
      }
    });
    return dataLogin;
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    this.store.dispatch(
      authActions.unSetUser()
    );
    return signOut(this.auth);
  }
}
