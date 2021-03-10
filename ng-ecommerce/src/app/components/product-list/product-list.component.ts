import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  searchMode = false;
  previousCategoryId: number;

  // pagination
  thePageNumber = 1;
  thePageSize = 5;
  theTotalElements = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {

      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts(): void {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
  }

  processResult(): any {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  handleSearchProducts(): void {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than the previous
    // then set thePageNumber to 1

    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: number): any {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product): void {
    console.log(`You added ${theProduct.name}, ${theProduct.unitPrice} to cart!`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
