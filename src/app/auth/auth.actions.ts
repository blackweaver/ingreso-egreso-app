import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';

export const setUser = createAction(
    '[Auth] setUser',
    props<{ user: any}>()  
);

export const unSetUser = createAction(
    '[Auth] unSetUser',
);