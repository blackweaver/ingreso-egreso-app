import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';

// https://www.youtube.com/watch?v=8VTxuIvMTlc&ab_channel=Garajedeideas

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    public firestore: Firestore,
  ) {}

  initAuthListener() {
    return authState(this.auth);
  }

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
  
  login(user: string, password: string) {
    return signInWithEmailAndPassword(this.auth, user, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider);
  }

  logout() {
    return signOut(this.auth);
  }
}