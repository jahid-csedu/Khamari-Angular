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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  providers: [DatePipe]
})
export class NewOrderComponent implements OnInit {

  order: Order;
  orderItem: Array<OrderItem>;
  products: Product[];
  productMap = new Map();
  inventoryProductMap = new Map<string, Inventory[]>();
  inventoryStockMap = new Map();
  inventoryPriceMap = new Map();
  inventoryId: string;
  orderForm: FormGroup;

  constructor(private productService: ProductService, private datepipe: DatePipe, private toaster: ToastrService, private orderService: OrderService, private inventoryService: InventoryService, private formBuilder: FormBuilder) {
    this.orderForm = this.formBuilder.group({
      orderId: [''],
      orderDate: [''],
      itemList: this.formBuilder.array([]),
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

  getProductInventoryMap(productId) {
    return this.inventoryProductMap.get(productId);
  }

  ngOnInit(): void {
    this.resetForm();
    this.getProductList();
  }

  onSubmit() {
    this.order = new Order();
    this.orderItem = [];
    this.order.orderDate = this.orderForm.get('orderDate').value;
    this.order.customerName = this.orderForm.get('customerName').value;
    this.order.deliveryAddress  = this.orderForm.get('deliveryAddress').value;
    this.order.orderStatus  = this.orderForm.get('orderStatus').value;
    this.order.deliveryDate  = this.orderForm.get('deliveryDate').value;
    this.order.deliveredBy  = this.orderForm.get('deliveredBy').value;
    this.order.orderAmount = 0;
    for(let i=0; i<this.orderItems.length; i++) {
      if(this.orderItems.value[i].quantity > 0) {
        this.orderItem.push({
          inventoryId:this.orderItems.value[i].unit,
          discount: this.orderItems.value[i].discount,
          quantity: this.orderItems.value[i].quantity,
        })
        this.order.orderAmount += (this.inventoryPriceMap.get(this.orderItems.value[i].unit)-this.orderItems.value[i].discount)*this.orderItems.value[i].quantity;
      }
    }
    this.order.items = this.orderItem;

    //generating invoice no
    let today = new Date();
    let firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    let todayString = this.datepipe.transform(today, 'yyyy-MM-dd');
    let firstDayString = this.datepipe.transform(firstDay, 'yyyy-MM-dd');
    let orderCount;
    this.orderService.getCurrentMonthOrder(firstDayString, todayString).then(snapshot => {
      orderCount = snapshot.size
      this.order.invoiceNo = todayString.substring(2,4)+todayString.substring(5,7)+(orderCount+1).toString();
      this.orderService.addOrder(this.order)
      .then(
        res => {
          this.toaster.success('Order added successfully', 'Order');
          this.resetForm();
        },
        error => {
          this.toaster.error('Could not add order', 'Order');
        }
      );
    });
    
  }

  getProductList() {
    this.productService.getProducts().subscribe(res => {
      this.products = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Product
        }
      });
      for (let i = 0; i < this.products.length; i++) {
        this.productMap.set(this.products[i].id, this.products[i].name);
      }
    });
  }

  onProductChange(productId: string) {
    let inventoryList: Array<Inventory> = [];
    this.inventoryService.getInventoryByProductId(productId).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        inventoryList.push({
          id: doc.id,
          ...doc.data() as Inventory
        });
        this.inventoryPriceMap.set(doc.id, doc.data().price);
        this.inventoryStockMap.set(doc.id, doc.data().stock);
      });
      this.inventoryProductMap.set(productId, inventoryList);
    });
  }

  addItem() {
    this.orderItems.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      productId: [''],
      unit: [''],
      discount: ['0'],
      quantity: ['0']
    })
  }

  resetForm() {
    this.orderItems.clear();
    this.orderForm.reset();
    this.orderItems.push(this.createItem());
  }

}
