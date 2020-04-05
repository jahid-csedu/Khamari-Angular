import { Component, OnInit } from '@angular/core';
import { Order } from '../../shared/models/order.model';
import { OrderService } from '../../shared/services/order.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  orders:Order[];
  totalOrders:number = 0;
  deliveredOrders:number = 0;
  returnedOrders:number = 0;
  cancelledOrders:number = 0;

  constructor(private orderService:OrderService){}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe( res =>{
      this.orders = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Order
        }
      });
      this.totalOrders = this.orders.length;
      for(let i=0; i<this.orders.length; i++) {
        if(this.orders[i].orderStatus == 'D') {
          this.deliveredOrders++;
        }else if(this.orders[i].orderStatus == 'R') {
          this.returnedOrders++;
        }else if(this.orders[i].orderStatus == 'C') {
          this.cancelledOrders++;
        }
      }
    })
  }
}
