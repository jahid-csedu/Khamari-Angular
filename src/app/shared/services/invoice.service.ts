import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  invoice: Invoice;

  constructor() { }
}
