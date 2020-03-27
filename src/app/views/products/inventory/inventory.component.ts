import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../shared/services/inventory.service';
import { ProductService } from '../../../shared/services/product.service';
import { Inventory } from '../../../shared/models/inventory.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  products: Product[];
  productMap = new Map();
  inventory:Inventory;
  inventoryList:Inventory[];

  constructor(private inventoryService:InventoryService, private productService:ProductService, private toaster:ToastrService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getInventory();
    this.resetForm();
  }

  onSubmit() {
    if(this.inventory.unit === '') {
      this.toaster.error('Please Enter product unit', 'Inventory');
      return;
    }
    if(this.inventory.id == null) {
      delete this.inventory.id;
      this.inventoryService.createInventory(this.inventory)
        .then(
          res => {
            this.toaster.success('Inventory updated successfully', 'Inventory');
            this.resetForm();
          },
          error => {
            this.toaster.error('Could not update inventory', 'Inventory');
          }
        );
    }else {
      this.inventoryService.updateInventory(this.inventory);
      this.toaster.success('Inventory updated successfully', 'Inventory');
    }
  }

  onEdit(inventory:Inventory) {
    this.inventory = Object.assign({}, inventory);
  }

  getProducts() {
    this.productService.getProducts().subscribe( res => {
      this.products = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Product
        }
      });
      for(let i=0; i<this.products.length; i++) {
        this.productMap.set(this.products[i].id, this.products[i].name);
      }
      if(this.products.length > 0){
        this.inventory.productId = this.products[0].id;
      }
    });
  }

  getInventory() {
    this.inventoryService.getInventory().subscribe(res => {
      this.inventoryList = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Inventory
        }
      });
    });
  }

  resetForm() {
    this.inventory = {
      id: null,
      productId: '',
      unit: '',
      price: 0,
      stock: 0
    }
  }

}
