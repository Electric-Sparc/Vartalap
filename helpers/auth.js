import { auth } from "../services/Fire";

export function signup(email, password) {
    return auth().createUserWithEmailAndPassword(email, password);
};

export function signin(email, password) {
    return auth().signInWithEmailAndPassword(email, password);
};

export function logout() {
    return auth().signOut();
};