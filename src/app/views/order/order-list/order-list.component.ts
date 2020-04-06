import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { InventoryService } from '../../../shared/services/inventory.service';
import { ProductService } from '../../../shared/services/product.service';
import { Order } from '../../../shared/models/order.model';
import { Product } from '../../../shared/models/product.model';
import { Inventory } from '../../../shared/models/inventory.model';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Invoice, Item } from '../../../shared/models/invoice.model';
import { InvoiceService } from '../../../shared/services/invoice.service';

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
  inventoryPriceMap = new Map();
  orderStatusMap = new Map();

  constructor(private orderService:OrderService, private inventoryService:InventoryService, private productService:ProductService, private toaster:ToastrService, private router:Router, private invoiceService:InvoiceService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getInventory();
    this.getAllOrders();
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
        this.inventoryPriceMap.set(inventories[i].id, inventories[i].price);
      }
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

  onGenerateInvoice(order: Order) {
    let invoice = new Invoice();
    invoice.invoiceNo = order.invoiceNo;
    invoice.orderDate = order.orderDate.substring(8,10)+"/"+order.orderDate.substring(5,7)+"/"+order.orderDate.substring(0,4);
    invoice.customerName = order.customerName;
    invoice.customerPhone = order.customerPhone;
    invoice.deliveryAddress = order.deliveryAddress;
    invoice.orderAmount = order.orderAmount;
    let items:Array<Item> = [];
    let item:Item;
    for(let i=0; i< order.items.length; i++) {
      item = {
        name: this.inventoryProductMap.get(order.items[i].inventoryId),
        unit: this.inventoryUnitMap.get(order.items[i].inventoryId),
        price: this.inventoryPriceMap.get(order.items[i].inventoryId),
        discount: order.items[i].discount,
        quantity: order.items[i].quantity,
        total: (this.inventoryPriceMap.get(order.items[i].inventoryId)-order.items[i].discount)*order.items[i].quantity
      }
      items.push(item);
    }
    invoice.items = items;
    this.invoiceService.invoice = invoice;
    this.router.navigateByUrl('/invoice');
  }

}
