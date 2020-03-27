import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  constructor(public productService:ProductService, private toaster:ToastrService) { }

  ngOnInit(): void {
    this.resetForm();
  }

  onSubmit(form:NgForm) {
    let data = Object.assign({}, form.value);
    if(data.id == null) {
      delete data.id;
      this.productService.createProduct(data)
      .then(
        res => {
          this.toaster.success('Product added successfully', 'Product');
          this.resetForm();
        },
        error => {
          this.toaster.error('Could not update product', 'Product');
        }
      );
    }else {
      this.productService.updateProduct(data)
      this.toaster.success('Product updated successfully', 'Product');
    }
    this.resetForm(form);
  }

  resetForm(form?:NgForm) {
    if(form != null) {
      form.resetForm();
    }
    this.productService.formData = {
      id: null,
      name: '',
      description: ''
    }
  }

}
