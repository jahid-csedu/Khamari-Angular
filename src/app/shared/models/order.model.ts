import { OrderItem } from './order-item.model';

export class Order {
    id: string;
    invoiceNo:string;
    orderDate: string;
    items:OrderItem[];
    customerName: string;
    deliveryAddress: string;
    orderAmount: number;
    orderStatus: string;
    deliveryDate: string;
    deliveredBy: string;
}
