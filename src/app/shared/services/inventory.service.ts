import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private firestore:AngularFirestore) { }

  createInventory(inventory:Inventory) {
    return this.firestore.collection('inventory').add(inventory);
  }

  getInventory() {
    return this.firestore.collection('inventory').snapshotChanges();
  }
  
  getInventoryById(id:string) {
    return this.firestore.collection('inventory').doc(id).get();
  }

  getInventoryByProductId(productId:string) {
    return this.firestore.collection('inventory').ref.where('productId', '==', productId).get();
  }

  updateInventory(inventory: Inventory) {
    let temp = Object.assign({}, inventory);
    delete inventory.id;
    this.firestore.collection('inventory').doc(temp.id).update(inventory);
  }
}
