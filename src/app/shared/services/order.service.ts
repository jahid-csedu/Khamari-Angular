import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore:AngularFirestore) { }

  getAllOrders() {
    return this.firestore.collection('orders', ref => ref.orderBy('orderDate', 'desc')).snapshotChanges();
  }

  getCurrentMonthOrder(fromDay:string, uptoDay:string) {
    return this.firestore.collection('orders').ref.where('orderDate', '>=', fromDay).where('orderDate', '<=', uptoDay).get();
  }

  addOrder(order:Order) {
    return this.firestore.collection('orders').add(JSON.parse(JSON.stringify(order)));
  }

  updateOrder(order:Order) {
    let temp = Object.assign({}, order);
    delete order.id;
    this.firestore.collection('orders').doc(temp.id).update(order);
  }
}
