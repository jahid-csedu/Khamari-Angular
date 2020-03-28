import { OrderItem } from './order-item.model';

export class Order {
    id: string;
    invoiceId:string;
    orderDate: Date;
    items:OrderItem[];
    customerName: string;
    deliveryAddress: string;
    orderAmount: number;
    orderStatus: string;
    deliveryDate: Date;
    deliveredBy: string;
}
