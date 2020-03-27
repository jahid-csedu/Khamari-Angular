import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productList: Product[];
  constructor(private productService:ProductService, private toaster:ToastrService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getProducts().subscribe(res => {
      this.productList = res.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Product
        }
      });
    });
  }

  onEdit(product: Product){
    this.productService.formData = Object.assign({}, product);
  }

  onDelete(id:string) {
    if(confirm('Are you sure to delete this record?')){
      this.productService.deleteProduct(id);
      this.toaster.warning('Deleted successfully', 'Product List');
    }
  }

}
