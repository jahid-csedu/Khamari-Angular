import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fiestore:AngularFirestore) { }

  createUser(user:User) {
    let id = user.id;
    delete user.id;
    return this.fiestore.collection('users').doc(id).set(user);
  }

  getUsers () {
    return this.fiestore.collection('users', ref => ref.orderBy('name')).snapshotChanges();
  }

  getUserById(id:string) {
    return this.fiestore.collection('users', ref => ref.where('id', '==', id)).snapshotChanges();
  }

  updateUser(user:User) {
    let id = user.id;
    delete user.id;
    this.fiestore.collection('users').doc(id).update(user);
  }

  deleteUser(id:string) {
    this.fiestore.collection('users').doc(id).delete();
  }
}
