import { Injectable } from '@angular/core';
import {CartItem} from '../common/cart-item';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() {
    // read data from storage
    const data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;
      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem): any {

    let alreadyExistsInCart = false;
    let existingCartItem: CartItem;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );
      alreadyExistsInCart = (existingCartItem !== undefined);
    }
    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals(): void {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (const currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

    this.persistCartItems();
  }

  persistCartItems(): void {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number): void {
    console.log('Contents of the cart');
    for (const tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
  }

  decrementQuantity(theCartItem: CartItem): void {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem): void {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
