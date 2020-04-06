export class Invoice {
    invoiceNo:string;
    orderDate:string;
    items: Item[];
    customerName:string;
    customerPhone:string;
    deliveryAddress:string;
    orderAmount:number;
}

export class Item {
    name: string;
    unit: string;
    price: number;
    discount: number;
    quantity: number;
    total: number;
}