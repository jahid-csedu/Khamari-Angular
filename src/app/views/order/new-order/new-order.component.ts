import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/models/order.model';
import { OrderItem } from '../../../shared/models/order-item.model';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/order.service';
import { Product } from '../../../shared/models/product.model';
import { Inventory } from '../../../shared/models/inventory.model';
import { InventoryService } from '../../../shared/services/inventory.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  order: Order;
  orderItem: Array<OrderItem>;
  products: Product[];
  productMap = new Map();
  inventoryList: Array<Inventory>=[];
  inventoryPriceMap = new Map();
  inventoryStockMap = new Map();
  inventoryId:string;
  orderForm:FormGroup;

  constructor(private productService:ProductService, private toaster:ToastrService, private orderService:OrderService, private inventoryService:InventoryService, private formBuilder:FormBuilder) { 
    this.orderForm = this.formBuilder.group({
      orderId: [''],
      orderDate: [''],
      itemList:this.formBuilder.array([]),
      customerName: [''],
      deliveryAddress: [''],
      orderStatus: ['P'],
      deliveryDate: [''],
      deliveredBy: ['']
    })
  }

  get orderItems() {
    return this.orderForm.get('itemList') as FormArray;
  }

  get stock() {
    return this.inventoryStockMap.get(this.inventoryId);
  }

  get price() {
    return this.inventoryPriceMap.get(this.inventoryId);
  }

  ngOnInit(): void {
    this.resetForm();
    this.getProductList();
  }

  onSubmit() {
    console.log(this.orderForm.value)
  }

  getProductList() {
    this.productService.getProducts().subscribe( res => {
      this.products = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Product
        }
      });
      for(let i=0; i<this.products.length; i++) {
        this.productMap.set(this.products[i].id, this.products[i].name);
      }
    });
  }

  onProductChange(productId:string) {
    this.inventoryList = [];
    this.inventoryService.getInventoryByProductId(productId).then(querySnapshot  =>{
      querySnapshot.forEach(doc => {
          this.inventoryList.push({
            id: doc.id,
            ...doc.data() as Inventory
          });
          this.inventoryPriceMap.set(doc.id, doc.data().price);
          this.inventoryStockMap.set(doc.id, doc.data().stock);
      });
    });
  }
  onInventoryChange(inventoryId) {
    this.inventoryId = inventoryId;
  }

  addItem() {
    this.orderItems.push(this.createItem());
  }

  createItem():FormGroup {
    return this.formBuilder.group({
      productId: [''],
      unit:  [''],
      price: ['0'],
      discount: ['0'],
      quantity: ['0'],
      total: ['0']
    })
  }

  resetForm() {
    this.orderItems.clear();
    this.orderForm.reset();
    this.orderItems.push(this.createItem());
  }

}
