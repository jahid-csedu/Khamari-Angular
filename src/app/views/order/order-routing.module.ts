import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderListComponent } from './order-list/order-list.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Orders'
    },
    children: [
      {
        path: '',
        redirectTo: 'new-order',
        pathMatch: 'full'
      },
      {
        path: 'new-order',
        component: NewOrderComponent,
        data: {
          title: 'New Order'
        }
      },
      {
        path: 'order-list',
        component: OrderListComponent,
        data: {
          title: 'Order List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
