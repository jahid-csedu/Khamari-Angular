import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { InventoryService } from '../../../shared/services/inventory.service';
import { ProductService } from '../../../shared/services/product.service';
import { Order } from '../../../shared/models/order.model';
import { Product } from '../../../shared/models/product.model';
import { Inventory } from '../../../shared/models/inventory.model';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  @ViewChild('editModal') public editModal: ModalDirective;

  orders: Order[];
  updatedOrder = new Order();
  productMap = new Map();
  inventoryUnitMap = new Map();
  inventoryProductMap = new Map();
  orderStatusMap = new Map();

  constructor(private orderService:OrderService, private inventoryService:InventoryService, private productService:ProductService, private toaster:ToastrService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getInventory();
    this.getAllOrders();

    this.orderStatusMap.set('P', 'Processing');
    this.orderStatusMap.set('D', 'Delivered');
    this.orderStatusMap.set('C', 'Cancelled');
    this.orderStatusMap.set('R', 'Returned');
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe(res => {
      this.orders = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Order
        }
      });
    });
  }

  getProducts() {
    let products:Product[];
    this.productService.getProducts().subscribe( res => {
      products = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Product
        }
      });
      for(let i=0; i< products.length; i++) {
        this.productMap.set(products[i].id, products[i].name)
      }
    });
  }

  getInventory() {
    let inventories:Inventory[];
    this.inventoryService.getInventory().subscribe( res => {
      inventories = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Inventory
        }
      });
      for(let i=0; i< inventories.length; i++) {
        this.inventoryUnitMap.set(inventories[i].id, inventories[i].unit);
        this.inventoryProductMap.set(inventories[i].id, this.productMap.get(inventories[i].productId));
      }
      console.log(inventories);
    });
  }

  openEdit(order:Order) {
    this.updatedOrder = Object.assign({}, order);
    this.editModal.show();
  }

  onUpdateStatus() {
    this.orderService.updateOrder(this.updatedOrder);
    this.editModal.hide();
    this.toaster.success('Order updated successfully', 'Order');
  }

}
