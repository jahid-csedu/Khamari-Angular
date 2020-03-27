import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  formData: Product;

  constructor(private firestore: AngularFirestore) { }

  getProducts() {
    return this.firestore.collection('products').snapshotChanges();
  }

  createProduct(product:Product) {
    return this.firestore.collection('products').add(product);
  }

  updateProduct(product: Product) {
    let temp = Object.assign({}, product);
    delete product.id;
    this.firestore.collection('products').doc(temp.id).update(product);
  }

  deleteProduct(id: string) {
    this.firestore.collection('products').doc(id).delete();
  }
}
