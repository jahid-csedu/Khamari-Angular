import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { OrderService } from '../../shared/services/order.service';


@NgModule({
  declarations: [OrderListComponent, NewOrderComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    DataTablesModule
  ],
  providers: [
    OrderService
  ]
})
export class OrderModule { }
