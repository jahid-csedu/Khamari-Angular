import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service';
import { Invoice } from '../../shared/models/invoice.model';
import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  shipping = 0;
  invoice: Invoice;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoice = this.invoiceService.invoice;
  }

  generatePDF() {
    var data = document.getElementById('printArea');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpeg', 1)
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'jpeg', 0, position, imgWidth, imgHeight)
      pdf.save(this.invoice.invoiceNo+".pdf"); // Generated PDF   
    });
  }

}
